export type Topic = { id: number; name: string; category: string };
const groups: Record<string, string[]> = {
  "Computer Science": ["CAP Theorem", "Byzantine Fault Tolerance", "Zero-Knowledge Proof", "Consistent Hashing", "Eventual Consistency", "Bloom Filter", "Public-Key Cryptography", "Garbage Collection", "Dynamic Programming", "Finite-State Machine", "Merkle Tree", "Compiler Optimization"],
  Technology: ["Quantum Computing", "Edge Computing", "Digital Twin", "LiDAR", "WebAssembly", "Containerization", "Federated Learning", "Network Effects", "API Gateway", "Content Delivery Network", "Serverless Computing", "Augmented Reality"],
  Business: ["Disruptive Innovation", "Blue Ocean Strategy", "Jobs to Be Done", "Product-Market Fit", "Economies of Scale", "Switching Costs", "Value Chain", "Market Segmentation", "Competitive Moat", "Lean Startup", "Principal-Agent Problem", "Network Business Model"],
  Finance: ["Compound Interest", "Dollar-Cost Averaging", "Yield Curve", "Liquidity Risk", "Diversification", "Price-to-Earnings Ratio", "Index Fund", "Options Contract", "Net Present Value", "Capital Structure", "Efficient Market Hypothesis", "Sharpe Ratio"],
  Economics: ["Opportunity Cost", "Supply Elasticity", "Comparative Advantage", "Moral Hazard", "Tragedy of the Commons", "Gini Coefficient", "Inflation Targeting", "Externality", "Game Theory", "Price Discrimination", "Creative Destruction", "Behavioral Economics"],
  Psychology: ["Cognitive Dissonance", "Confirmation Bias", "Dunning–Kruger Effect", "Sunk Cost Fallacy", "Fundamental Attribution Error", "Availability Heuristic", "Growth Mindset", "Operant Conditioning", "Flow State", "Loss Aversion", "Bystander Effect", "Cognitive Load"],
  Science: ["Entropy", "CRISPR", "Plate Tectonics", "General Relativity", "Natural Selection", "Quantum Entanglement", "Epigenetics", "Dark Matter", "Photosynthesis", "Herd Immunity", "Chaos Theory", "Scientific Falsifiability"],
  Philosophy: ["The Ship of Theseus", "Stoicism", "Utilitarianism", "Existentialism", "Categorical Imperative", "Occam's Razor", "Problem of Induction", "Social Contract", "Mind–Body Problem", "Moral Relativism", "Determinism", "Veil of Ignorance"],
  History: ["The Silk Road", "Magna Carta", "Industrial Revolution", "Printing Revolution", "Treaty of Westphalia", "Meiji Restoration", "The Enlightenment", "Green Revolution", "Bretton Woods System", "The Great Divergence", "Hanseatic League", "Columbian Exchange"],
};
const topicEntries = Object.entries(groups).flatMap(([category, names]) => {
  const comparisons = names.flatMap((name, index) =>
    names.slice(index + 1).map((other) => `${name} vs. ${other}`),
  );
  const applied = names.flatMap((name) => [
    `${name} in Practice`,
    `Limits of ${name}`,
    `Origins of ${name}`,
  ]);
  return [...names, ...comparisons, ...applied].map((name) => ({ name, category }));
});

export const topics: Topic[] = topicEntries.map((topic, index) => ({
  id: index + 1,
  ...topic,
}));
export const categories = ["Random", ...Object.keys(groups)];
