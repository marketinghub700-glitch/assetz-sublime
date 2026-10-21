import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUpRight, MapPin, Waves, Dumbbell, Trees, Users, Footprints, ShieldCheck, Building2, X } from "lucide-react";
import hero from "@/assets/sublime-Gallery-1.webp.asset.json";
import gallery2 from "@/assets/sublime-Gallery-2.webp.asset.json";
import gallery3 from "@/assets/sublime-Gallery-3.webp.asset.json";
import masterplan from "@/assets/sublime-Masterplan.webp.asset.json";
import floorplan from "@/assets/sublime-3bhk_1735.webp.asset.json";
import { project } from "@/lib/project";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Assetz Codename Sublime — 3 BHK Apartments in Hoskote" },
      { name: "description", content: "Explore Assetz Codename Sublime in Hoskote, Bangalore. Premium 3 BHK apartments from ₹1.84 Cr onwards, 11 acres and a 62,000+ sq. ft. clubhouse." },
      { property: "og:title", content: "Assetz Codename Sublime — Hoskote, Bangalore" },
      { property: "og:description", content: "Premium 3 BHK residences from ₹1.84 Cr onwards. Discover plans, amenities and connectivity, and register your interest." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().regex(/^[0-9+ ()-]{7,20}$/, "Enter a valid phone number"),
});

type Errors = Partial<Record<"name" | "email" | "phone", string>>;

function Index() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [selectedImage, setSelectedImage] = useState<{ url: string; label: string } | null>(null);

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
    setStatus("sending");
    try {
      const { error } = await supabase.from("enquiries").insert(parsed.data);
      setStatus(error ? "error" : "done");
    } catch {
      setStatus("error");
    }
  }

  const field = "w-full border-b border-input bg-transparent py-3 text-card-foreground outline-none transition-colors placeholder:text-card-foreground/40 focus:border-primary";

  return (
    <main>
      <section className="relative min-h-[640px] h-[82svh] max-h-[900px]">
        <img src={hero.url} alt="Assetz Codename Sublime residential towers and swimming pool — project rendering" className="absolute inset-0 h-full w-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-between px-6 py-7 lg:px-12 lg:py-9">
          <header className="flex items-center justify-between gap-4">
            <p className="text-xl font-semibold">assetz<span className="text-primary">.</span></p>
            <Button asChild variant="outline" className="border-foreground/40 bg-transparent text-foreground hover:bg-foreground/10 hover:text-foreground"><a href="#enquire">Enquire now <ArrowUpRight /></a></Button>
          </header>
          <div className="pb-8 lg:pb-12">
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
              <p className="mt-3 text-card-foreground/70">We've received your details and will be in touch soon.</p>
            </div>
          ) : (
            <>
              <p className="text-xs uppercase tracking-[0.3em] text-gold">Register interest</p>
               <h2 className="mt-2 font-display text-4xl">Request more information</h2>
              <form onSubmit={onSubmit} noValidate className="mt-8 space-y-6">
                {([
                  ["name", "Full name", "text", "name"],
                  ["email", "Email address", "email", "email"],
                  ["phone", "Phone number", "tel", "tel"],
                ] as const).map(([n, label, type, ac]) => (
                  <div key={n}>
                    <label htmlFor={n} className="sr-only">{label}</label>
                    <input id={n} name={n} type={type} autoComplete={ac} placeholder={label} maxLength={n === "phone" ? 20 : 255} className={field} />
                    {errors[n] && <p className="mt-1 text-sm text-destructive">{errors[n]}</p>}
                  </div>
                ))}
                {status === "error" && <p className="text-sm text-destructive">Something went wrong. Please try again.</p>}
                 <Button type="submit" disabled={status === "sending"} className="h-12 w-full text-sm font-semibold">
                  {status === "sending" ? "Sending…" : "Submit enquiry"}
                   <ArrowUpRight />
                 </Button>
              </form>
            </>
          )}
        </div>
      </section>
      <section className="bg-card text-card-foreground">
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
          {[{ url: masterplan.url, label: "Master plan" }, { url: floorplan.url, label: "3 BHK · 1,735 sq. ft." }].map((plan) => <div key={plan.label}><Button variant="ghost" className="h-auto w-full overflow-hidden rounded-none bg-card p-0 hover:bg-card" onClick={() => setSelectedImage(plan)} aria-label={`View ${plan.label}`}><img src={plan.url} alt={plan.label} loading="lazy" className="aspect-[4/3] w-full object-contain p-3" /></Button><p className="mt-4 flex justify-between text-sm">{plan.label}<ArrowUpRight className="size-4 text-primary" /></p></div>)}
        </div>
        <h3 className="mt-14 font-display text-3xl">Apartment price</h3>
        <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[540px] text-left text-sm"><thead className="border-b border-primary/40 text-primary"><tr><th className="py-4 font-medium">Configuration</th><th className="py-4 font-medium">Saleable area</th><th className="py-4 font-medium">Indicative price</th></tr></thead><tbody>{project.homes.map((home) => <tr key={home.area} className="border-b border-border"><td className="py-5 pr-4">3 BHK + 3T</td><td className="py-5 pr-4">{home.area.toLocaleString("en-IN")} Sq. Ft.</td><td className="py-5">{home.price}</td></tr>)}</tbody></table></div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">*Prices are indicative and subject to applicable charges, terms and availability. Please enquire for the latest pricing and cost sheet.</p>
        <Button asChild className="mt-6"><a href="#enquire">Request latest pricing <ArrowUpRight /></a></Button>
      </section>
      <section className="bg-secondary">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-20"><p className="section-label">A closer look</p><h2 className="section-title">Project gallery</h2><div className="mt-9 grid gap-4 md:grid-cols-3">{[hero, gallery2, gallery3].map((image, i) => <Button key={image.url} variant="ghost" className="h-auto overflow-hidden rounded-none p-0" onClick={() => setSelectedImage({ url: image.url, label: `Assetz Codename Sublime — project view ${i + 1}` })} aria-label={`View project gallery image ${i + 1}`}><img src={image.url} loading="lazy" alt={`Assetz Codename Sublime project rendering ${i + 1}`} className="aspect-[4/3] w-full object-cover" /></Button>)}</div><p className="mt-4 text-xs text-muted-foreground">Project images and details from the supplied reference website. Images are illustrative project renderings.</p></div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:gap-24 lg:px-12 lg:py-24">
        <div><p className="section-label">Everything within reach</p><h2 className="section-title">Location & connectivity</h2><p className="mt-6 flex items-center gap-2 text-primary"><MapPin className="size-5 shrink-0" /> Off Old Madras Road, Hoskote, East Bangalore</p><p className="mt-6 leading-relaxed text-muted-foreground">Convenient access to schools, healthcare, shopping destinations and employment hubs. Connected via Old Madras Road, Bengaluru–Tirupati Highway, Satellite Town Ring Road (STRR) and Kadapa–Bengaluru Highway.</p><p className="mt-5 leading-relaxed text-muted-foreground">Whitefield Railway Station and Whitefield (Kadugodi) Metro Station offer additional travel convenience.</p></div>
        <div><table className="w-full text-left text-sm"><thead className="border-b border-border text-primary"><tr><th className="pb-4 font-medium">Destination</th><th className="pb-4 text-right font-medium">Approx. drive time</th></tr></thead><tbody>{project.destinations.map(([name, time]) => <tr key={name} className="border-b border-border"><td className="py-3 pr-4">{name}</td><td className="whitespace-nowrap py-3 text-right text-muted-foreground">{time}</td></tr>)}</tbody></table><p className="mt-4 text-xs leading-relaxed text-muted-foreground">*Drive times are indicative and may vary with traffic conditions, route and time of day.</p></div>
      </section>
      <footer className="border-t border-border px-6 py-8"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-sm"><p className="font-display text-2xl">Assetz Codename Sublime</p><Button asChild variant="link"><a href="#enquire">Register your interest <ArrowUpRight /></a></Button></div></footer>
      {selectedImage && <div role="dialog" aria-modal="true" aria-label={selectedImage.label} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 p-6" onClick={() => setSelectedImage(null)}><Button variant="outline" size="icon" aria-label="Close image" autoFocus className="absolute right-5 top-5" onClick={() => setSelectedImage(null)} onKeyDown={(e) => { if (e.key === "Escape") setSelectedImage(null); }}><X /></Button><img src={selectedImage.url} alt={selectedImage.label} className="max-h-[80svh] max-w-full object-contain" /><p className="mt-4 text-sm">{selectedImage.label}</p></div>}
    </main>
  );
}
