export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center py-10 px-4 selection:bg-emerald-500/30">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-black tracking-tight uppercase">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-600">★</span>{" "}
          LetImage
        </h1>
        <p className="text-xs text-zinc-600 font-bold uppercase tracking-[0.3em] mt-1">
          Compartilhamento seguro de imagens
        </p>
      </header>
      <main className="w-full max-w-5xl">
        {children}
      </main>
    </div>
  );
}