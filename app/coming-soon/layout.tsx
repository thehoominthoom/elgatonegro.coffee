export default function ComingSoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-yellow flex items-center justify-center">
      {children}
    </div>
  );
}
