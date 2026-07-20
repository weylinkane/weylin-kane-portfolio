import PageHeader from "@/components/ui/PageHeader";

export const metadata = {
  title: "Philosophy — Weylin Kane Portfolio",
};

// Section structure is ready — body copy is intentionally blank for you to fill in.
const sections = [
  { title: "Investment strategy", body: "" },
  { title: "Risk management", body: "" },
  { title: "Long-term goals", body: "" },
  { title: "Favorite principles", body: "" },
  { title: "What I'm reading", body: "" },
];

export default function PhilosophyPage() {
  return (
    <>
      <PageHeader
        title="Philosophy"
        description="How I think about investing — strategy, risk, time horizon, and the principles I return to."
      />

      <div className="space-y-12">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="mb-3 text-lg font-medium text-primary">{s.title}</h2>
            {s.body ? (
              <p className="max-w-2xl text-sm leading-relaxed text-secondary">
                {s.body}
              </p>
            ) : (
              <p className="max-w-2xl text-sm italic text-muted">
                {/* TODO: add your writing for this section */}
                Coming soon.
              </p>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
