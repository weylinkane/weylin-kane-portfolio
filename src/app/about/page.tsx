import PageHeader from "@/components/ui/PageHeader";
import { Linkedin, Github, FileText } from "lucide-react";

export const metadata = {
  title: "About — Weylin Kane Portfolio",
};

// Update these placeholder hrefs with your real URLs.
const links = {
  resume: "#", // e.g. "/resume.pdf"
  linkedin: "#", // e.g. "https://linkedin.com/in/your-handle"
  github: "#", // e.g. "https://github.com/your-handle"
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About"
        description="Background, goals, and how to get in touch."
      />

      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        {/* Photo placeholder */}
        <div className="md:col-span-1">
          <div className="aspect-square w-full max-w-xs rounded-lg border border-border bg-surface" />
          <p className="mt-2 text-xs text-muted">Photo</p>
        </div>

        {/* Bio + links */}
        <div className="space-y-10 md:col-span-2">
          <section>
            <h2 className="mb-3 text-lg font-medium text-primary">Biography</h2>
            <p className="max-w-2xl text-sm italic text-muted">
              {/* TODO: write a short bio here */}
              Coming soon.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-primary">
              Career goals
            </h2>
            <p className="max-w-2xl text-sm italic text-muted">
              {/* TODO: write a short note on career direction */}
              Coming soon.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-medium text-primary">Links</h2>
            <div className="flex flex-wrap gap-3">
              <a
                href={links.resume}
                className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-surface px-4 py-2 text-sm text-primary transition-colors hover:bg-surface-2"
              >
                <FileText className="h-4 w-4" /> Resume
              </a>
              <a
                href={links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-surface px-4 py-2 text-sm text-primary transition-colors hover:bg-surface-2"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-surface px-4 py-2 text-sm text-primary transition-colors hover:bg-surface-2"
              >
                <Github className="h-4 w-4" /> GitHub
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
