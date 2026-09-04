"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clock3, History, Pause, Play, RotateCcw, Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { categories, topics, type Topic } from "@/lib/topics";

type Phase = "topic-selected" | "researching" | "ready-to-explain" | "explaining" | "reflection" | "completed";
type Reflection = { learned: string; difficult: string; improve: string };
type Active = { topic: Topic; phase: Phase; researchEnd?: number; speakingEnd?: number; pausedRemaining?: number; startedAt: number };
type Practice = { id: string; topic: Topic; date: string; researchDuration: number; speakingDuration: number; reflection: Reflection };
type View = "home" | "challenge" | "reflection" | "history" | "detail";
const ACTIVE_KEY = "ten-minute-learn-active";
const HISTORY_KEY = "ten-minute-learn-history";
const blank = { learned: "", difficult: "", improve: "" };

function pick(category: string, exclude?: string, recent: string[] = []) {
  let pool = topics.filter((topic) => (category === "Random" || topic.category === category) && topic.name !== exclude && !recent.includes(topic.name));
  if (!pool.length) pool = topics.filter((topic) => category === "Random" || topic.category === category);
  return pool[Math.floor(Math.random() * pool.length)];
}
function clock(ms: number) { const total = Math.max(0, Math.ceil(ms / 1000)); return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`; }
function load<T>(key: string, fallback: T): T { try { return JSON.parse(localStorage.getItem(key) || "") as T; } catch { return fallback; } }

export function LearnApp({ view, detailId }: { view: View; detailId?: string }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<Active | null>(null);
  const [history, setHistory] = useState<Practice[]>([]);
  const [category, setCategory] = useState("Random");
  const [now, setNow] = useState(Date.now());
  const [reflection, setReflection] = useState<Reflection>(blank);
  useEffect(() => { setHistory(load(HISTORY_KEY, [])); setActive(load(ACTIVE_KEY, null)); setReady(true); }, []);
  useEffect(() => { if (!ready) return; active ? localStorage.setItem(ACTIVE_KEY, JSON.stringify(active)) : localStorage.removeItem(ACTIVE_KEY); }, [active, ready]);
  useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 250); return () => clearInterval(id); }, []);
  useEffect(() => {
    if (!active) return;
    if (active.phase === "researching" && active.researchEnd && now >= active.researchEnd) setActive({ ...active, phase: "ready-to-explain", researchEnd: undefined });
    if (active.phase === "explaining" && active.speakingEnd && now >= active.speakingEnd) { setActive({ ...active, phase: "reflection", speakingEnd: undefined }); if (view !== "reflection") router.replace("/reflection"); }
  }, [active, now, router, view]);
  const choose = useCallback((nextCategory = category) => {
    setActive({ topic: pick(nextCategory, active?.topic.name, history.slice(0, 10).map((x) => x.topic.name)), phase: "topic-selected", startedAt: Date.now() });
  }, [active?.topic.name, category, history]);
  useEffect(() => { if (ready && view === "challenge" && !active) choose(); }, [active, choose, ready, view]);
  const remaining = active?.phase === "researching" ? active.pausedRemaining ?? (active.researchEnd || now) - now : active?.phase === "explaining" ? (active.speakingEnd || now) - now : 0;
  const go = (patch: Partial<Active>) => active && setActive({ ...active, ...patch });
  const save = () => { if (!active) return; const item: Practice = { id: crypto.randomUUID(), topic: active.topic, date: new Date().toISOString(), researchDuration: 600, speakingDuration: 60, reflection }; const next = [item, ...history]; setHistory(next); localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); go({ phase: "completed" }); };
  if (!ready) return <Shell><p className="muted">Restoring your challenge…</p></Shell>;
  if (view === "home") return <Home active={active} />;
  if (view === "history") return <HistoryView practices={history} />;
  if (view === "detail") return <Detail practice={history.find((item) => item.id === detailId)} />;
  if (view === "reflection" || active?.phase === "reflection" || active?.phase === "completed") return <ReflectionView active={active} reflection={reflection} setReflection={setReflection} save={save} reset={() => { setActive(null); router.push("/challenge"); }} />;
  return <Challenge active={active} category={category} setCategory={(value) => { setCategory(value); choose(value); }} choose={() => choose()} remaining={remaining} startResearch={() => go({ phase: "researching", researchEnd: Date.now() + 600_000 })} pauseResearch={() => active?.researchEnd && go({ researchEnd: undefined, pausedRemaining: Math.max(0, active.researchEnd - Date.now()) })} resumeResearch={() => active?.pausedRemaining && go({ researchEnd: Date.now() + active.pausedRemaining, pausedRemaining: undefined })} endResearch={() => go({ phase: "ready-to-explain", researchEnd: undefined, pausedRemaining: undefined })} startSpeaking={() => go({ phase: "explaining", speakingEnd: Date.now() + 60_000 })} finishSpeaking={() => { go({ phase: "reflection", speakingEnd: undefined }); router.push("/reflection"); }} />;
}

function Shell({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) { return <main className="app-shell"><header className="topbar"><Link href="/" className="brand"><span className="brand-mark">10</span><span>Minute Learn</span></Link><nav><Link href="/challenge">Challenge</Link><Link href="/history"><History size={16} /> History</Link></nav></header><section className={compact ? "content content-wide" : "content"}>{children}</section><footer>No AI. No shortcuts. The effort is yours.</footer></main>; }
function Home({ active }: { active: Active | null }) { return <Shell><div className="home"><p className="eyebrow"><Sparkles size={14} /> Deliberate practice for curious minds</p><h1>Learn something new.<br /><span>Explain it clearly.</span></h1><p className="lead">Get an unfamiliar topic. Research it yourself for 10 minutes. Then explain it out loud in 1 minute.</p><div className="actions"><Link className="button primary" href="/challenge">{active ? "Continue challenge" : "Start a challenge"}<ArrowRight size={17} /></Link><Link className="button secondary" href="/history">View history</Link></div><div className="rhythm"><div><strong>01</strong><span>Get a topic</span></div><i /><div><strong>10:00</strong><span>Research</span></div><i /><div><strong>01:00</strong><span>Explain</span></div></div></div></Shell>; }

function Challenge(p: { active: Active | null; category: string; setCategory:(v:string)=>void; choose:()=>void; remaining:number; startResearch:()=>void; pauseResearch:()=>void; resumeResearch:()=>void; endResearch:()=>void; startSpeaking:()=>void; finishSpeaking:()=>void }) {
  const a = p.active; if (!a) return <Shell><p className="muted">Choosing a topic…</p></Shell>;
  return <Shell><div className="challenge"><div className="progress-steps"><span className="active">Topic</span><span className={a.phase !== "topic-selected" ? "active" : ""}>Research</span><span className={["ready-to-explain","explaining"].includes(a.phase) ? "active" : ""}>Explain</span><span>Reflect</span></div>
  {a.phase === "topic-selected" && <><label className="category-label">Choose a category<select value={p.category} onChange={(e)=>p.setCategory(e.target.value)}>{categories.map(x=><option key={x}>{x}</option>)}</select></label><p className="eyebrow">Your topic</p><h1 className="topic">{a.topic.name}</h1><p className="category">{a.topic.category}</p><div className="actions centered"><button className="button primary" onClick={p.startResearch}>Start challenge <ArrowRight size={17}/></button><button className="button secondary" onClick={p.choose}><RotateCcw size={16}/> Give me another</button></div></>}
  {a.phase === "researching" && <><p className="eyebrow"><Clock3 size={14}/> Research time</p><h1 className="topic small">{a.topic.name}</h1><div className="timer">{clock(p.remaining)}</div><p className="instruction">Research this topic using any sources you want.</p><div className="actions centered">{a.pausedRemaining ? <button className="button primary" onClick={p.resumeResearch}><Play size={16}/> Resume</button> : <button className="button secondary" onClick={p.pauseResearch}><Pause size={16}/> Pause</button>}<button className="button ghost" onClick={p.endResearch}>End research early</button></div></>}
  {a.phase === "ready-to-explain" && <><p className="eyebrow">Research complete</p><h1 className="topic small">{a.topic.name}</h1><div className="timer muted-timer">01:00</div><p className="instruction">Explain what you learned out loud in your own words.</p><button className="button primary solo" onClick={p.startSpeaking}><Play size={16}/> Start speaking</button></>}
  {a.phase === "explaining" && <><p className="eyebrow">Explain it</p><h1 className="topic small">{a.topic.name}</h1><div className="timer">{clock(p.remaining)}</div><p className="instruction">Keep going. Clarity matters more than completeness.</p><button className="button secondary solo" onClick={p.finishSpeaking}>Finish early <ArrowRight size={16}/></button></>}
  </div></Shell>;
}

function ReflectionView({ active, reflection, setReflection, save, reset }:{ active:Active|null; reflection:Reflection; setReflection:(v:Reflection)=>void; save:()=>void; reset:()=>void }) {
  if (!active) return <Shell><Empty title="No challenge to reflect on" href="/challenge" label="Start a challenge" /></Shell>;
  if (active.phase === "completed") return <Shell><div className="complete"><span className="success"><Check size={30}/></span><p className="eyebrow">Challenge complete</p><h1>{active.topic.name}</h1><p>10 min research · 1 min explanation</p><div className="actions centered"><button className="button primary" onClick={reset}>New challenge</button><Link className="button secondary" href="/history">View history</Link></div></div></Shell>;
  const field=(key:keyof Reflection,label:string)=><label className="field"><span>{label}</span><textarea rows={4} value={reflection[key]} onChange={(e)=>setReflection({...reflection,[key]:e.target.value})} placeholder="Optional"/></label>;
  return <Shell compact><div className="reflection"><Link href="/challenge" className="back"><ArrowLeft size={16}/> Back</Link><p className="eyebrow">Final step</p><h1>Reflection</h1><p className="reflection-topic">{active.topic.name}</p><div className="form-grid">{field("learned","What did you learn?")}{field("difficult","What was difficult to explain?")}{field("improve","What would you improve next time?")}</div><button className="button primary" onClick={save}>Save & finish <Check size={17}/></button></div></Shell>;
}
function HistoryView({ practices }:{ practices:Practice[] }) { return <Shell compact><div className="history-page"><div className="page-heading"><div><p className="eyebrow">Your practice</p><h1>History</h1></div><Link className="button primary" href="/challenge">New challenge</Link></div>{!practices.length?<Empty title="No completed challenges yet" href="/challenge" label="Start your first"/>:<div className="history-list">{practices.map(x=><Link href={`/history/${x.id}`} className="history-row" key={x.id}><time>{new Intl.DateTimeFormat("en",{month:"short",day:"numeric"}).format(new Date(x.date))}</time><div><strong>{x.topic.name}</strong><span>{x.topic.category}</span></div><span className="check"><Check size={16}/></span><ArrowRight className="row-arrow" size={17}/></Link>)}</div>}</div></Shell>; }
function Detail({ practice }:{ practice?:Practice }) { if(!practice)return <Shell><Empty title="Practice not found" href="/history" label="Back to history"/></Shell>; const items=[["What did you learn?",practice.reflection.learned],["What was difficult to explain?",practice.reflection.difficult],["What would you improve next time?",practice.reflection.improve]]; return <Shell compact><article className="detail"><Link href="/history" className="back"><ArrowLeft size={16}/> History</Link><p className="eyebrow">Completed practice</p><h1>{practice.topic.name}</h1><p className="date">{new Intl.DateTimeFormat("en",{dateStyle:"long"}).format(new Date(practice.date))}</p><div className="stats"><div><strong>10</strong><span>minutes research</span></div><div><strong>1</strong><span>minute speaking</span></div></div><h2>Reflection</h2>{items.map(([label,value])=><section className="answer" key={label}><h3>{label}</h3><p>{value||"No note added."}</p></section>)}</article></Shell>; }
function Empty({title,href,label}:{title:string;href:string;label:string}) { return <div className="empty"><Clock3 size={28}/><h2>{title}</h2><Link className="button primary" href={href}>{label}</Link></div>; }
