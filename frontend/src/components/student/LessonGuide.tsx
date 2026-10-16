import HowToGuide from "@/components/educational/HowToGuide";

export default function LessonGuide({ moduleId }: { moduleId: string }) {
  return (
    <HowToGuide title="How to use this lesson" storageKey={`lesson:${moduleId}`} steps={[
      "Read what you are expected to learn.",
      "Watch the lesson video if one is available, then read the explanation.",
      "Study the example and complete the assignment.",
      "Answer the checkpoint question, then move to the next lesson.",
    ]} />
  );
}
