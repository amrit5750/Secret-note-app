import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatsPanel from "@/components/StatsPanel";
import NoteCreatedClient from "./NoteCreatedClient";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0B1220] text-white flex flex-col bg-[radial-gradient(1200px_500px_at_50%_-200px,rgba(59,130,246,0.08),transparent)]">
        <main className="flex-1">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
            <NoteCreatedClient id={id} />
          </div>
        </main>
      </div>
      <Footer />
      <div className="w-full bg-[#0D1220] px-4 pb-16">
        <StatsPanel dense className="w-full" />
      </div>
    </>
  );
}
