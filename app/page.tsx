import { createClient } from "./utils/supabase/server";
import Link from "next/link";
import Hero from "./components/Hero";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import Footer from "./components/Footer";
import Testimonials from "./components/Testimonials";

export default async function Home() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .limit(3)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen">
      <Hero />

      <AboutSection />
      <ServicesSection />
      <Testimonials />

      <Footer />
    </main>
  );
}
