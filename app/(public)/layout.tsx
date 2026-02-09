export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center py-10 px-4 dark:bg-neutral-950">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Compact.io</h1>
        <p className="text-sm text-muted-foreground">Compartilhamento seguro de imagens</p>
      </header>
      <main className="w-full max-w-5xl">
        {children}
      </main>
    </div>
  );
}