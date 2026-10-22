import { createFileRoute, Link } from "@tanstack/react-router";
import { project } from "@/lib/project";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Assetz Codename Sublime" },
      { name: "description", content: "Terms and conditions for use of this Assetz Codename Sublime marketing website, operated by Billionaire Dream Estate Pvt Ltd." },
      { property: "og:title", content: "Terms & Conditions — Assetz Codename Sublime" },
      { property: "og:description", content: "Terms governing the use of this website and the information published about Assetz Codename Sublime." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://sublime-home-connections.lovable.app/terms" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://sublime-home-connections.lovable.app/terms" }],
  }),
  component: TermsPage,
});

const sections: [string, string[]][] = [
  ["About these terms", [
    "These terms and conditions govern your use of this website, which is operated and marketed by Billionaire Dream Estate Pvt Ltd (\"we\", \"us\", \"our\") in respect of the project Assetz Codename Sublime at Hoskote, Bangalore. By using this website or submitting an enquiry, you agree to these terms.",
    "This website is an independent marketing website and is not the official website of the project developer. We are a real estate agency/agency-marketing entity and are not the developer or promoter of the project.",
  ]],
  ["Information is indicative", [
    "All project details on this website — including prices, sizes, floor plans, amenities, availability and connectivity/drive times — are reproduced from publicly available promotional material and are indicative only. Images are illustrative project renderings and not photographs of the actual site.",
    "Nothing on this website constitutes an offer, contract, commitment or guarantee of any kind. Prices are subject to applicable charges, terms and availability and may change without notice.",
    "The source material lists the project's RERA registration as forthcoming. Before making any purchase decision, please confirm the current RERA registration number, approvals, plans, specifications and cost sheet directly with the project's sales team and verify them independently.",
  ]],
  ["Enquiries and communication", [
    "When you submit the enquiry form or contact us on WhatsApp, you consent to being contacted by our team by phone, email or WhatsApp regarding Assetz Codename Sublime. You can ask us to stop at any time — see our Privacy Policy.",
    "You agree to provide accurate contact details and not to misuse the enquiry form (for example by submitting another person's details or automated/spam submissions).",
  ]],
  ["Intellectual property", [
    "Project names, images, plans and other material on this website are used for marketing reference and remain the property of their respective owners. You may not copy, reproduce or reuse the content of this website for commercial purposes without permission.",
  ]],
  ["Limitation of liability", [
    "To the fullest extent permitted by law, we accept no liability for any loss or inconvenience arising from reliance on the information published on this website, including any inaccuracy, omission or change in project details. Any transaction relating to the project will be governed exclusively by the documents executed directly with the developer/seller.",
  ]],
  ["Governing law", [
    "These terms are governed by the laws of India, and the courts of Bangalore, Karnataka shall have exclusive jurisdiction over any dispute arising from the use of this website.",
  ]],
  ["Contact us", [
    `For questions about these terms, contact Billionaire Dream Estate Pvt Ltd by phone or WhatsApp at +91 ${project.whatsapp.phone.slice(2, 7)} ${project.whatsapp.phone.slice(7)} during business hours.`,
  ]],
];

function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-36">
      <p className="section-label">Billionaire Dream Estate Pvt Ltd</p>
      <h1 className="section-title">Terms &amp; conditions</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated: October 2026</p>
      <div className="mt-10 space-y-10">
        {sections.map(([heading, paragraphs]) => (
          <section key={heading}>
            <h2 className="font-display text-2xl">{heading}</h2>
            {paragraphs.map((p) => <p key={p.slice(0, 24)} className="mt-4 leading-relaxed text-muted-foreground">{p}</p>)}
          </section>
        ))}
      </div>
      <p className="mt-14 border-t border-border pt-6 text-sm text-muted-foreground">
        See also our <Link to="/privacy" className="text-primary underline underline-offset-4">Privacy Policy</Link> and the <Link to="/" className="text-primary underline underline-offset-4">project homepage</Link>.
      </p>
    </main>
  );
}
