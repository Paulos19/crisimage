export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen items-center justify-center bg-neutral-100 dark:bg-neutral-900">
      <div className="w-full max-w-md px-4">
        {children}
      </div>
    </div>
  );
}