import PageIntro from "@/components/educational/PageIntro";

type Props = {
  title: string;
  moduleId: string;
  tier: string;
  position: number | null;
  tierTotal: number | null;
  estimatedMinutes: number | null;
};

export default function LessonHeader({ title, moduleId, tier, position, tierTotal, estimatedMinutes }: Props) {
  return (
    <header className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
        {position !== null && tierTotal !== null && <span>Lesson {position} of {tierTotal} in {tier}</span>}
        <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-semibold text-cyan-200">{tier}</span>
        <span className="font-mono">{moduleId}</span>
        {estimatedMinutes !== null && <span>~{estimatedMinutes} min read</span>}
      </div>
      <PageIntro title={title} description="This lesson explains the ideas in this topic and helps you check your understanding before moving forward." />
    </header>
  );
}
