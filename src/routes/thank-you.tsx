import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Download } from "lucide-react";

const validateSearch = (search: Record<string, unknown>): { plan?: string; label?: string } => ({
  plan: typeof search["plan"] === "string" ? search["plan"] : undefined,
  label: typeof search["label"] === "string" ? search["label"] : undefined,
});

export const Route = createFileRoute("/thank-you")({
  validateSearch,
  head: () => ({
    meta: [
      { title: "Thank You — Assetz Codename Sublime" },
      { name: "description", content: "Thank you for your enquiry about Assetz Codename Sublime. Our team will be in touch soon." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Thank You — Assetz Codename Sublime" },
      { property: "og:description", content: "Thank you for your enquiry. Our team will be in touch soon." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  const { plan, label } = Route.useSearch();

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="section-label">Assetz Codename Sublime</p>
        <h1 className="mt-3 font-display text-5xl font-light">Thank you</h1>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          We've received your details. Our team will contact you shortly with pricing, availability and site-visit details.
        </p>
        {plan && (
          <Button asChild className="mt-8 h-12 w-full text-sm font-semibold">
            <a href={plan} target="_blank" rel="noopener noreferrer" download>
              <Download /> Download {label ?? "plan"}
            </a>
          </Button>
        )}
        <div className="mt-6">
          <Button asChild variant="outline" className="h-12 w-full border-foreground/40 bg-transparent text-sm font-semibold text-foreground hover:bg-foreground/10 hover:text-foreground">
            <Link to="/">Back to homepage <ArrowUpRight /></Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
