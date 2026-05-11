import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { ProjectFacts } from "@/components/ProjectFacts";
import { ProjectGallery } from "@/components/ProjectGallery";
import { ProjectHero } from "@/components/ProjectHero";
import { ProjectMetrics } from "@/components/ProjectMetrics";
import { ProjectNarrative } from "@/components/ProjectNarrative";
import { ProjectScope } from "@/components/ProjectScope";
import { ProjectTestimonial } from "@/components/ProjectTestimonial";
import { QuoteCTA } from "@/components/QuoteCTA";
import { RelatedProjects } from "@/components/RelatedProjects";
import {
  CATEGORY_LABELS,
  DIVISION_LABELS,
  PROJECTS,
  getProject,
  getProjectIndex,
} from "@/lib/projects";
import { SITE } from "@/lib/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  // First sentence of the summary makes a sturdy meta description.
  const description =
    project.summary.split(". ").slice(0, 1).join(". ") + ".";

  return {
    title: `${project.title} — ${SITE.name}`,
    description,
    openGraph: {
      title: `${project.title} — ${SITE.name}`,
      description,
      type: "article",
      images: [
        {
          url: project.hero.src,
          width: 1600,
          height: 900,
          alt: project.hero.alt,
        },
      ],
    },
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = getProjectIndex(slug) + 1;
  const total = PROJECTS.length;
  const primaryDivision = project.scope[0]?.division;

  // schema.org Article — case studies often get cited externally; this
  // gives crawlers structured author / publisher / image data.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title,
    description: project.summary,
    image: [project.hero.src, ...project.gallery.map((g) => g.src)],
    datePublished: project.year,
    articleSection: CATEGORY_LABELS[project.category],
    about: project.scope.map((s) => DIVISION_LABELS[s.division]),
    locationCreated: {
      "@type": "Place",
      name: project.location,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: "https://dunhamprice.com",
    },
    ...(project.client
      ? {
          mainEntityOfPage: project.client,
        }
      : {}),
  };

  return (
    <>
      <Nav />

      <main id="main" tabIndex={-1} className="outline-none">
        <ProjectHero project={project} index={index} total={total} />

        <div id="metrics">
          <ProjectMetrics metrics={project.metrics} />
        </div>

        <ProjectNarrative project={project} />
        <ProjectScope project={project} />
        <ProjectGallery images={project.gallery} />

        {project.testimonial && (
          <ProjectTestimonial testimonial={project.testimonial} />
        )}

        <ProjectFacts project={project} />
        <RelatedProjects project={project} />

        <QuoteCTA
          headline={
            <>
              Have <br className="sm:hidden" /> a project <br className="hidden sm:block" />
              like this?
            </>
          }
          subhead={`Talk to the team that delivered ${project.title.toLowerCase()}. We'll meet you on site, scope it together, and quote it fast.`}
          service={primaryDivision}
        />
      </main>

      <Footer />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
