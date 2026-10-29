import { createFileRoute, Link } from "@tanstack/react-router";
import { project } from "@/lib/project";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Assetz Codename Sublime" },
      { name: "description", content: "Privacy policy for Billionaire Dream Estate Pvt Ltd covering personal information submitted through the Assetz Codename Sublime enquiry form." },
      { property: "og:title", content: "Privacy Policy — Assetz Codename Sublime" },
      { property: "og:description", content: "How Billionaire Dream Estate Pvt Ltd collects, uses and protects your personal information." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});

const sections: [string, string[]][] = [
  ["About this policy", [
    "This privacy policy applies to this website, which is operated and marketed by Billionaire Dream Estate Pvt Ltd (\"we\", \"us\", \"our\") in respect of the project Assetz Codename Sublime at Hoskote, Bangalore. It explains what personal information we collect when you use this website, how we use it, and the choices you have.",
    "This website is an independent marketing website and is not the official website of the project developer. Project details shown here are reproduced from publicly available promotional material for information purposes only.",
  ]],
  ["Information we collect", [
    "Enquiry form details: when you submit the enquiry form we collect the name, email address and phone number you provide, so that our sales team can contact you about the project.",
    "Contact via WhatsApp: if you choose to message us on WhatsApp, we receive your phone number and whatever you choose to share in that conversation.",
    "Usage information: like most websites, our hosting provider may collect standard technical information such as IP address, browser type and pages visited, used only for operating and securing the site.",
    "Advertising measurement: we use Google Ads conversion tracking (Google) to measure whether visitors who arrive from our advertisements submit an enquiry. This may set or read advertising cookies and share page-visit and conversion information with Google for measurement and ad optimization. In regions that require consent for this tracking, it is switched off.",
    "We do not collect payment details, identity documents or sensitive personal information through this website.",
  ]],
  ["How we use your information", [
    "To respond to your enquiry and contact you by phone, email or WhatsApp regarding Assetz Codename Sublime, including sharing pricing, availability, floor plans and site-visit details.",
    "To follow up on your interest in the project unless you ask us not to.",
    "We do not sell or rent your personal information to third parties. We may share it with our sales and channel-partner team members strictly for the purpose of assisting your enquiry.",
  ]],
  ["Retention", [
    "We keep enquiry records only as long as needed to respond to your enquiry and maintain a record of our communication, or until you ask us to delete them, subject to any legal requirement to retain records.",
  ]],
  ["Your choices", [
    "You may ask us at any time to access, correct or delete the personal information we hold about you, or to stop contacting you, by reaching us through the contact details below. We will act on your request promptly.",
  ]],
  ["Contact us", [
    `For any questions about this policy or to exercise your choices, contact Billionaire Dream Estate Pvt Ltd by phone or WhatsApp at +91 ${project.whatsapp.phone.slice(2, 7)} ${project.whatsapp.phone.slice(7)} during business hours.`,
  ]],
];

function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-36">
      <p className="section-label">Billionaire Dream Estate Pvt Ltd</p>
      <h1 className="section-title">Privacy policy</h1>
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
        See also our <Link to="/terms" className="text-primary underline underline-offset-4">Terms &amp; Conditions</Link> and the <Link to="/" className="text-primary underline underline-offset-4">project homepage</Link>.
      </p>
    </main>
  );
}
