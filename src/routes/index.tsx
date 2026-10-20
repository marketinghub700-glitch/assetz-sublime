import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Assetz Sublime — Register Your Interest" },
      { name: "description", content: "Discover Assetz Sublime luxury residences. Share your details to receive pricing, floor plans and a site visit." },
      { property: "og:title", content: "Assetz Sublime — Register Your Interest" },
      { property: "og:description", content: "Luxury residences by Assetz. Enquire for pricing and floor plans." },
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
    const { error } = await supabase.from("enquiries").insert(parsed.data);
    setStatus(error ? "error" : "done");
  }

  const field = "w-full border-b border-input bg-transparent py-3 text-card-foreground outline-none transition-colors placeholder:text-card-foreground/40 focus:border-primary";

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-2">
      <section className="relative min-h-[70vh] lg:min-h-screen">
        <img src={hero} alt="Assetz Sublime towers at sunset" width={1280} height={1600} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-overlay)" }} />
        <div className="relative flex h-full min-h-[70vh] flex-col justify-between p-8 lg:min-h-screen lg:p-14">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">Assetz</p>
          <div>
            <h1 className="font-display text-6xl font-light leading-none lg:text-8xl">
              Sublime
            </h1>
            <p className="mt-4 max-w-sm text-muted-foreground">
              Elevated residences framed by gardens, light and quiet luxury.
            </p>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center p-6 lg:p-14">
        <div className="w-full max-w-md rounded-lg bg-card p-8 text-card-foreground shadow-2xl lg:p-10">
          {status === "done" ? (
            <div className="py-10 text-center">
              <h2 className="font-display text-4xl">Thank you</h2>
              <p className="mt-3 text-card-foreground/70">We've received your details and will be in touch soon.</p>
            </div>
          ) : (
            <>
              <p className="text-xs uppercase tracking-[0.3em] text-gold">Register interest</p>
              <h2 className="mt-2 font-display text-4xl">Get pricing & floor plans</h2>
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
                <button type="submit" disabled={status === "sending"} className="w-full rounded-md bg-primary py-4 text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60">
                  {status === "sending" ? "Sending…" : "Submit enquiry"}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
