import { LearnApp } from "../../learn-app";
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <LearnApp view="detail" detailId={id} />; }
