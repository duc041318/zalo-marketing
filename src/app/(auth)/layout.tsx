"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="w-full max-w-md px-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-2xl shadow-lg">
            Z
          </div>
          <h1 className="mt-3 text-2xl font-bold text-primary">ZaloBot</h1>
          <p className="text-sm text-muted-foreground">Marketing Automation</p>
        </div>
        {children}
      </div>
    </div>
  );
}
