import { redirect } from "next/navigation";

export default async function LegacySampleSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/bookings/confirm/preview/${slug}`);
}
