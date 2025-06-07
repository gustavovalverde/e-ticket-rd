export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-foreground text-2xl font-bold">
            Dominican Republic E-Ticket System
          </h1>
          <p className="text-muted-foreground mt-2">
            Electronic Entry/Exit Form for Migration Control
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl">
          <h2 className="mb-4 text-xl font-semibold">Welcome</h2>
          <p className="text-muted-foreground leading-relaxed">
            Complete your electronic entry or exit form for the Dominican
            Republic. This digital form replaces the traditional paper-based
            process for a faster and more efficient migration experience.
          </p>
        </div>
      </main>
    </div>
  );
}
