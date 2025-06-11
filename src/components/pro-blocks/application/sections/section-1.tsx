"use client";

export function Section1() {
  return (
    <div className="bg-background">
      {" "}
      {/* Add border border-border shadow-sm and rounded-lg class to make this section look like a card */}
      {/* Section header */}
      <div className="pt-4 md:pt-6">
        <div className="container mx-auto flex flex-col gap-6 px-4 lg:px-6">
          {/* Main content */}
          <div className="border-border bg-muted text-muted-foreground w-full rounded-md border border-dashed p-6 text-center">
            Replace this div with your content
          </div>
        </div>
      </div>
      {/* Section body */}
      <div className="container mx-auto px-4 py-6 lg:px-6">
        <div className="border-border bg-muted text-muted-foreground w-full rounded-md border border-dashed p-6 text-center">
          Replace this div with your content
        </div>
      </div>
      {/* Section footer */}
      <div className="border-border border-t py-4">
        <div className="container mx-auto flex flex-col gap-6 px-4 lg:px-6">
          <div className="border-border bg-muted text-muted-foreground w-full rounded-md border border-dashed p-6 text-center">
            Replace this div with your content
          </div>
        </div>
      </div>
    </div>
  );
}
