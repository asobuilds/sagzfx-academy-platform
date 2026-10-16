import Markdown from "@/components/Markdown";

export default function LessonReader({ content }: { content: string | null }) {
  return (
    <article id="lesson-reading" aria-label="Written lesson" className="glass rounded-2xl px-5 py-6 sm:px-8 sm:py-9">
      <div className="mx-auto max-w-[72ch] text-base leading-8 text-slate-200 [&_.lesson-prose>p]:my-5 [&_.lesson-prose>ul]:my-5 [&_.lesson-prose>h2]:mt-10 [&_.lesson-prose>h3]:mt-8">
        {content ? <Markdown content={content} /> : (
          <p className="text-sm leading-relaxed text-slate-300">The written explanation is not available for this lesson. You can return to your learning path to choose another available lesson.</p>
        )}
      </div>
    </article>
  );
}
