import Link from "next/link";

type Props = {
  firstLessonId: string | null;
  isRegistered: boolean;
};

export default function PrimaryLearningAction({ firstLessonId, isRegistered }: Props) {
  const href = isRegistered || !firstLessonId ? "/pricing" : `/module/${encodeURIComponent(firstLessonId)}`;
  const heading = isRegistered ? "Choose your learning plan" : firstLessonId ? "Start your next lesson" : "Explore learning plans";
  const description = isRegistered
    ? "Your free account is ready. Choose a learning plan to unlock paid lessons."
    : firstLessonId
      ? "Start here — this is the first lesson in your current plan."
      : "There are no available lessons in your current catalog. Check your learning plan.";
  const label = isRegistered || !firstLessonId ? "Explore learning plans →" : "Open your first available lesson →";
  return (
    <section className="w-full min-w-0 rounded-3xl bg-gradient-to-br from-blue-800 via-blue-700 to-cyan-700 p-6 text-white shadow-xl shadow-blue-950/20 sm:p-8 lg:w-2/3" aria-labelledby="primary-learning-title">
      <p className="text-xs font-semibold uppercase tracking-widest text-cyan-100">Your next learning step</p>
      <h2 id="primary-learning-title" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{heading}</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-blue-50">{description}</p>
      <Link href={href} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-white px-5 py-3 text-center text-sm font-bold text-blue-900 transition hover:bg-cyan-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:w-auto">{label}</Link>
    </section>
  );
}
