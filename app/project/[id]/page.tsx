import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import ProjectClient from "./ProjectClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const { data: project } = await supabase
    .from("projects")
    .select("title_en, description_en, image_url")
    .eq("id", id)
    .single();

  if (!project) {
    return {
      title: "Project Not Found | ABCE-S Portfolio",
    };
  }

  return {
    title: `${project.title_en} | ABCE-S Portfolio`,
    description: project.description_en,
    openGraph: {
      title: project.title_en,
      description: project.description_en,
      images: [
        {
          url: project.image_url,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ProjectClient id={id} />;
}
