import {
  CATEGORY_LABELS,
  DIVISION_LABELS,
  type Project,
} from "@/lib/projects";

interface ProjectFactsProps {
  project: Project;
}

/**
 * Tabular project metadata. Two columns on desktop, one on mobile.
 * Yellow mono labels, primary text values, hairline rules between rows.
 *
 * Server component — no interactivity required.
 */
export function ProjectFacts({ project }: ProjectFactsProps) {
  // Compose derived values once so the JSX stays clean.
  const divisions = project.scope
    .map((s) => DIVISION_LABELS[s.division])
    .join(", ");
  const products = project.scope.flatMap((s) => s.products).join(" · ");
  const headlineMetric = project.metrics[0];

  const facts: { label: string; value: string }[] = [
    { label: "Client", value: project.client ?? "—" },
    { label: "Location", value: project.location },
    { label: "Year", value: project.year },
    { label: "Duration", value: project.duration ?? "—" },
    { label: "Category", value: CATEGORY_LABELS[project.category] },
    { label: "Division(s)", value: divisions },
    { label: "Products supplied", value: products },
    {
      label: "Scale",
      value: headlineMetric
        ? `${headlineMetric.value}${
            headlineMetric.unit ? ` ${headlineMetric.unit}` : ""
          } ${headlineMetric.label.toLowerCase()}`
        : "—",
    },
  ];

  return (
    <section
      aria-labelledby="facts-heading"
      className="relative bg-base py-16 text-primary sm:py-24"
    >
      <div className="mx-auto max-w-[1480px] px-6 sm:px-10">
        <div className="mb-10 grid gap-6 lg:mb-14 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-5 text-accent">Project Facts</p>
            <h2
              id="facts-heading"
              className="display-section max-w-[18ch] text-primary"
            >
              The record.
            </h2>
          </div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted lg:col-span-4">
            Document ID — {project.slug.toUpperCase()}-{project.year}
          </p>
        </div>

        <dl className="grid grid-cols-1 border-t border-line lg:grid-cols-2 lg:divide-x lg:divide-line">
          {facts.map((f, i) => (
            <div
              key={f.label}
              className={`grid grid-cols-[minmax(8rem,12rem)_1fr] gap-6 border-b border-line py-5 lg:px-8 lg:py-6 ${
                i === 0 ? "lg:pl-0" : ""
              }`}
              data-print-row
            >
              <dt className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-accent">
                {f.label}
              </dt>
              <dd className="font-mono text-sm uppercase tracking-[0.08em] text-primary sm:text-base">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
