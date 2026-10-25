import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { z } from "zod";
import { leadsClient, LEADS_TABLE, LEAD_PROJECT, LEAD_SOURCE } from "@/integrations/leads/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowDown, ArrowUpRight, Download, MapPin, Waves, Dumbbell, Trees, Users, Footprints, ShieldCheck, Building2, Menu, X } from "lucide-react";
import heroAsset from "@/assets/sublime-Gallery-1.webp.asset.json";
import gallery2Asset from "@/assets/sublime-Gallery-2.webp.asset.json";
import gallery3Asset from "@/assets/sublime-Gallery-3.webp.asset.json";
import masterplanAsset from "@/assets/sublime-Masterplan.webp.asset.json";
import floorplanAsset from "@/assets/sublime-3bhk_1735.webp.asset.json";
import floorplan1926Asset from "@/assets/sublime-3bhk_1926.webp.asset.json";
import floorplan1945Asset from "@/assets/sublime-3bhk_1945.webp.asset.json";
import { hostedAsset } from "@/lib/assets";
import { project } from "@/lib/project";
import { leadErrorMessage } from "@/lib/lead-errors";

const hero = hostedAsset(heroAsset);
const gallery2 = hostedAsset(gallery2Asset);
const gallery3 = hostedAsset(gallery3Asset);
const masterplan = hostedAsset(masterplanAsset);
const floorplan = hostedAsset(floorplanAsset);
const floorplan1926 = hostedAsset(floorplan1926Asset);
const floorplan1945 = hostedAsset(floorplan1945Asset);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Assetz Codename Sublime — 3 BHK Apartments in Hoskote" },
      { name: "description", content: "Explore Assetz Codename Sublime in Hoskote, Bangalore. Premium 3 BHK apartments from ₹1.73 Cr onwards, 11 acres and a 62,000+ sq. ft. clubhouse." },
      { property: "og:title", content: "Assetz Codename Sublime — Hoskote, Bangalore" },
      { property: "og:description", content: "Premium 3 BHK residences from ₹1.73 Cr onwards. Discover plans, amenities and connectivity, and register your interest." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: hero.url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: hero.url },
    ],
  }),
  component: Index,
});

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().regex(/^[0-9+ ()-]{7,20}$/, "Enter a valid phone number"),
});

const whatsappUrl = `https://wa.me/${project.whatsapp.phone}?text=${encodeURIComponent(project.whatsapp.message)}`;

const navLinks = [
  ["Overview", "#top"],
  ["Amenities", "#amenities"],
  ["Plans", "#plans"],
  ["Gallery", "#gallery"],
  ["Location", "#location"],
] as const;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

type Errors = Partial<Record<"name" | "email" | "phone", string>>;

function Index() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [submissionError, setSubmissionError] = useState("");
  const [selectedImage, setSelectedImage] = useState<{ url: string; label: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [downloadPlan, setDownloadPlan] = useState<{ url: string; label: string } | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Errors = {};
      for (const i of parsed.error.issues) errs[i.path[0] as keyof Errors] = i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmissionError("");
    setStatus("sending");
    try {
      const { error } = await leadsClient()
        .from(LEADS_TABLE)
        .insert({ ...parsed.data, project: LEAD_PROJECT, source: LEAD_SOURCE });
      if (error) {
        setSubmissionError(leadErrorMessage(error));
        console.error("Enquiry save failed", { code: error.code });
      }
      setStatus(error ? "error" : "done");
    } catch {
      setSubmissionError(leadErrorMessage(null));
      setStatus("error");
    }
  }

  const field = "w-full border-b border-border bg-transparent py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";

  const enquiryForm = (prefix: string) => (
              <form onSubmit={onSubmit} noValidate className="mt-8 space-y-6">
                {([
                  ["name", "Full name", "text", "name"],
                  ["email", "Email address", "email", "email"],
                  ["phone", "Phone number", "tel", "tel"],
                ] as const).map(([n, label, type, ac]) => (
                  <div key={n}>
                    <label htmlFor={`${prefix}-${n}`} className="sr-only">{label}</label>
                    <input id={`${prefix}-${n}`} name={n} type={type} autoComplete={ac} placeholder={label} maxLength={n === "phone" ? 20 : 255} className={field} />
                    {errors[n] && <p className="mt-1 text-sm text-destructive">{errors[n]}</p>}
                  </div>
                ))}
                {status === "error" && <p role="alert" className="text-sm text-destructive">{submissionError}</p>}
                 <Button type="submit" disabled={status === "sending"} className="h-12 w-full text-sm font-semibold">
                  {status === "sending" ? "Sending…" : "Submit enquiry"}
                   <ArrowUpRight />
                 </Button>
              </form>
  );

  function openPlanEnquiry(plan: { url: string; label: string }) {
    setErrors({});
    setSubmissionError("");
    setStatus("idle");
    setDownloadPlan(plan);
  }

  return (
    <main>
      <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 lg:px-8">
        <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl border border-border bg-background/80 px-4 py-3 shadow-lg shadow-black/20 backdrop-blur-md lg:px-6">
          <a href="#top" className="text-xl font-semibold">Assetz<span className="text-primary">.</span></a>
          <div className="hidden items-center gap-7 text-sm md:flex">
            {navLinks.map(([label, href]) => <a key={href} href={href} className="text-muted-foreground transition-colors hover:text-foreground">{label}</a>)}
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="hidden border-foreground/40 bg-transparent text-foreground hover:bg-foreground/10 hover:text-foreground sm:inline-flex"><a href="#enquire">Enquire now <ArrowUpRight /></a></Button>
            <Button variant="outline" size="icon" className="border-foreground/40 bg-transparent text-foreground hover:bg-foreground/10 hover:text-foreground md:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
              {menuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </nav>
      </header>
      <section id="top" className="relative min-h-[640px] h-[82svh] max-h-[900px]">
        <img src={hero.url} alt="Assetz Codename Sublime residential towers and swimming pool — project rendering" className="absolute inset-0 h-full w-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-10 pt-28 lg:px-12 lg:pb-14">
          <div>
            <p className="mb-4 flex items-center gap-2 text-sm"><MapPin className="size-4 text-primary" /> At {project.location}</p>
            <h1 className="max-w-3xl font-display text-5xl font-light leading-[1.05] sm:text-7xl lg:text-8xl">Assetz Codename<br />Sublime</h1>
            <p className="mt-5 text-lg">Luxurious 3 BHK Apartments</p>
            <p className="mt-2 text-xl text-primary">Starting Price {project.startingPrice}</p>
            <Button asChild className="mt-7 h-12 px-6"><a href="#enquire">Request more information <ArrowUpRight /></a></Button>
          </div>
        </div>
      </section>
      <section className="bg-card text-card-foreground">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-8 lg:grid-cols-4 lg:px-12">
          {[[`${project.acres} acres`, "Premium development"], ["62,000+ sq. ft.", "Grand clubhouse"], ["2B + G + 36", "Floors"], ["30+", "Premium amenities"]].map(([value, label]) => <div key={label} className="border-l border-card-foreground/20 pl-4"><p className="font-display text-3xl">{value}</p><p className="mt-1 text-xs text-card-foreground/65">{label}</p></div>)}
        </div>
      </section>
      <section id="enquire" className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24 lg:px-12 lg:py-24">
        <div>
          <p className="section-label">Premium apartment living</p>
          <h2 className="section-title">Welcome to<br />Assetz Codename Sublime</h2>
          <p className="mt-6 leading-relaxed text-muted-foreground">A newly launched premium residential development off Madras Road in Hoskote, Bangalore. Three elegant residential towers offer premium 3 BHK apartments with luxurious terrace balconies, thoughtfully designed for space, natural ventilation and open-sky views.</p>
          <p className="mt-5 leading-relaxed text-muted-foreground">With 70% carpet area efficiency, 81% open green spaces, five lifts per floor and 22,500 sq. ft. of retail space, the gated community brings together spacious homes and contemporary urban living.</p>
          <div className="mt-8 flex items-center gap-3 text-primary"><ArrowDown className="size-4" /><a href="#plans" className="text-sm underline underline-offset-4">Explore master & floor plans</a></div>
        </div>
        <div className="border-t border-primary/40 pt-7">
          {status === "done" ? (
            <div className="py-10 text-center">
              <h2 className="font-display text-4xl">Thank you</h2>
               <p className="mt-3 text-muted-foreground">We've received your details and will be in touch soon.</p>
            </div>
          ) : (
            <>
              <p className="text-xs uppercase tracking-[0.3em] text-gold">Register interest</p>
               <h2 className="mt-2 font-display text-4xl">Request more information</h2>
              {enquiryForm("page")}
            </>
          )}
        </div>
      </section>
      <section id="amenities" className="bg-card text-card-foreground">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-20">
          <p className="section-label">A considered lifestyle</p><h2 className="section-title">Project amenities</h2>
          <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-7 md:grid-cols-4">
            {[[Building2, "Parthenon-Inspired Clubhouse"], [Waves, "Swimming Pool"], [Dumbbell, "Fitness Centre"], [Trees, "Landscaped Gardens"], [Users, "Community Spaces"], [Footprints, "Children’s Play Area"], [Footprints, "Jogging Track"], [ShieldCheck, "24/7 Security"]].map(([Icon, label]) => { const AmenityIcon = Icon as typeof Building2; return <div key={String(label)} className="border-t border-card-foreground/20 pt-5"><AmenityIcon className="mb-4 size-6 text-gold" /><p className="text-sm">{String(label)}</p></div>; })}
          </div>
          <p className="mt-9 max-w-3xl text-sm leading-relaxed text-card-foreground/65">Also featuring a half-basketball court, cricket pitch, outdoor fitness area, bicycle track, pet park, skating rink, meditation deck, half-Olympic-sized swimming pool and high-street retail.</p>
        </div>
      </section>
      <section id="plans" className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
        <p className="section-label">Space to call your own</p><h2 className="section-title">Master & floor plans</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {[{ url: masterplan.url, label: "Master plan" }, { url: floorplan.url, label: "3 BHK · 1,735 sq. ft." }, { url: floorplan1926.url, label: "3 BHK · 1,926 sq. ft." }, { url: floorplan1945.url, label: "3 BHK · 1,945 sq. ft." }].map((plan) => <div key={plan.label}><Button variant="ghost" className="h-auto w-full overflow-hidden rounded-none bg-card p-0 hover:bg-card" onClick={() => openPlanEnquiry(plan)} aria-label={`Request ${plan.label}`}><img src={plan.url} alt={plan.label} loading="lazy" className="aspect-[4/3] w-full object-contain p-3 blur-[1.5px]" /></Button><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="text-sm">{plan.label}</p><Button variant="outline" size="sm" onClick={() => openPlanEnquiry(plan)} aria-label={`Download ${plan.label}`}><Download className="size-4" />Download</Button></div></div>)}
        </div>
        <h3 className="mt-14 font-display text-3xl">Apartment price</h3>
        <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[540px] text-left text-sm"><thead className="border-b border-primary/40 text-primary"><tr><th className="py-4 font-medium">Configuration</th><th className="py-4 font-medium">Saleable area</th><th className="py-4 font-medium">Indicative price</th></tr></thead><tbody>{project.homes.map((home) => <tr key={home.area} className="border-b border-border"><td className="py-5 pr-4">3 BHK + 3T</td><td className="py-5 pr-4">{home.area.toLocaleString("en-IN")} Sq. Ft.</td><td className="py-5">{home.price}</td></tr>)}</tbody></table></div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">*Prices are indicative and subject to applicable charges, terms and availability. Please enquire for the latest pricing and cost sheet.</p>
        <Button asChild className="mt-6"><a href="#enquire">Request latest pricing <ArrowUpRight /></a></Button>
      </section>
      <section id="gallery" className="bg-secondary">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-20"><p className="section-label">A closer look</p><h2 className="section-title">Project gallery</h2><div className="mt-9 grid gap-4 md:grid-cols-3">{[hero, gallery2, gallery3].map((image, i) => <Button key={image.url} variant="ghost" className="h-auto overflow-hidden rounded-none p-0" onClick={() => setSelectedImage({ url: image.url, label: `Assetz Codename Sublime — project view ${i + 1}` })} aria-label={`View project gallery image ${i + 1}`}><img src={image.url} loading="lazy" alt={`Assetz Codename Sublime project rendering ${i + 1}`} className="aspect-[4/3] w-full object-cover" /></Button>)}</div><p className="mt-4 text-xs text-muted-foreground">Project images and details from the supplied reference website. Images are illustrative project renderings.</p></div>
      </section>
      <section id="location" className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:gap-24 lg:px-12 lg:py-24">
        <div><p className="section-label">Everything within reach</p><h2 className="section-title">Location & connectivity</h2><p className="mt-6 flex items-center gap-2 text-primary"><MapPin className="size-5 shrink-0" /> Off Old Madras Road, Hoskote, East Bangalore</p><p className="mt-6 leading-relaxed text-muted-foreground">Convenient access to schools, healthcare, shopping destinations and employment hubs. Connected via Old Madras Road, Bengaluru–Tirupati Highway, Satellite Town Ring Road (STRR) and Kadapa–Bengaluru Highway.</p><p className="mt-5 leading-relaxed text-muted-foreground">Whitefield Railway Station and Whitefield (Kadugodi) Metro Station offer additional travel convenience.</p></div>
        <div><table className="w-full text-left text-sm"><thead className="border-b border-border text-primary"><tr><th className="pb-4 font-medium">Destination</th><th className="pb-4 text-right font-medium">Approx. drive time</th></tr></thead><tbody>{project.destinations.map(([name, time]) => <tr key={name} className="border-b border-border"><td className="py-3 pr-4">{name}</td><td className="whitespace-nowrap py-3 text-right text-muted-foreground">{time}</td></tr>)}</tbody></table><p className="mt-4 text-xs leading-relaxed text-muted-foreground">*Drive times are indicative and may vary with traffic conditions, route and time of day.</p></div>
      </section>
      <footer className="border-t border-border px-6 py-8"><div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-center justify-between gap-4 text-sm"><p className="font-display text-2xl">Assetz Codename Sublime</p><div className="flex flex-wrap items-center gap-5"><Button asChild variant="link"><a href="#enquire">Register your interest <ArrowUpRight /></a></Button><Link to="/privacy" className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">Privacy Policy</Link><Link to="/terms" className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">Terms &amp; Conditions</Link></div></div><div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-xs text-muted-foreground"><p>Project RERA: <span className="font-medium text-foreground">{project.rera.project}</span></p><p>Agent RERA: <span className="font-medium text-foreground">{project.rera.agent}</span></p></div><p className="mt-3 text-xs leading-relaxed text-muted-foreground">{project.disclaimer}</p></div></footer>
      {selectedImage && <div role="dialog" aria-modal="true" aria-label={selectedImage.label} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 p-6" onClick={() => setSelectedImage(null)}><Button variant="outline" size="icon" aria-label="Close image" autoFocus className="absolute right-5 top-5" onClick={() => setSelectedImage(null)} onKeyDown={(e) => { if (e.key === "Escape") setSelectedImage(null); }}><X /></Button><img src={selectedImage.url} alt={selectedImage.label} className="max-h-[80svh] max-w-full object-contain" /><p className="mt-4 text-sm">{selectedImage.label}</p></div>}
      <Dialog open={Boolean(downloadPlan)} onOpenChange={(open) => { if (!open) setDownloadPlan(null); }}>
        <DialogContent className="max-h-[90svh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg">
          <DialogHeader>
            <DialogTitle className="pr-6 font-display text-3xl font-normal tracking-normal">{status === "done" ? "Thank you" : "Request your plan"}</DialogTitle>
            <DialogDescription>{downloadPlan?.label}</DialogDescription>
          </DialogHeader>
          {status === "done" ? (
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground">We've received your details.</p>
              {downloadPlan && <Button asChild className="w-full"><a href={downloadPlan.url} target="_blank" rel="noopener noreferrer" download><Download />Download plan</a></Button>}
            </div>
          ) : enquiryForm("plan")}
        </DialogContent>
      </Dialog>
      {menuOpen && (
        <div role="dialog" aria-modal="true" aria-label="Site menu" className="fixed inset-0 z-50 flex flex-col bg-background/95 p-6 backdrop-blur-md" onClick={() => setMenuOpen(false)}>
          <div className="flex items-center justify-between">
            <p className="text-xl font-semibold">Assetz<span className="text-primary">.</span></p>
            <Button variant="outline" size="icon" className="border-foreground/40 bg-transparent text-foreground hover:bg-foreground/10 hover:text-foreground" aria-label="Close menu" autoFocus onClick={() => setMenuOpen(false)}><X /></Button>
          </div>
          <nav aria-label="Mobile navigation" className="mt-12 flex flex-col gap-6">
            {navLinks.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="font-display text-4xl text-foreground">{label}</a>)}
          </nav>
          <div className="mt-auto space-y-3 pb-2">
            <Button asChild className="h-12 w-full text-sm font-semibold"><a href="#enquire" onClick={() => setMenuOpen(false)}>Enquire now <ArrowUpRight /></a></Button>
            <Button asChild variant="outline" className="h-12 w-full border-foreground/40 bg-transparent text-sm font-semibold text-foreground hover:bg-foreground/10 hover:text-foreground"><a href={whatsappUrl} target="_blank" rel="noopener noreferrer"><WhatsAppIcon className="size-5" /> WhatsApp us</a></Button>
          </div>
        </div>
      )}
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp" className="fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg transition-transform hover:scale-105">
        <WhatsAppIcon className="size-7" />
      </a>
    </main>
  );
}
