const ideas = [
  { title: "Start where you are", body: "You do not need to know anything about forex to begin. Every plan starts with the same foundations." },
  { title: "Learn at a pace that fits", body: "Your class period is one month. Study as much as your time allows. Modules you open during class remain available to you afterwards." },
  { title: "Practise without risking real money", body: "Every student — free or paid — gets the SAGZFX Practice Trading environment with virtual funds. Practise as often as you like." },
];
export default function MotivationSection() {
  return <section aria-labelledby="motivation-heading" className="glass rounded-2xl p-5 sm:p-7">
    <h2 id="motivation-heading" className="text-2xl font-bold">A learning plan for your next step</h2>
    <div className="mt-6 grid gap-6 md:grid-cols-3">{ideas.map((idea) => <div key={idea.title} className="space-y-2"><h3 className="font-semibold text-cyan-200">{idea.title}</h3><p className="text-sm leading-relaxed text-slate-300">{idea.body}</p></div>)}</div>
    <p className="mt-6 border-t border-white/10 pt-5 text-sm leading-relaxed text-slate-200">Learning forex takes time. Pick the plan that matches where you are today, and start. A trading setup can fail.</p>
  </section>;
}
