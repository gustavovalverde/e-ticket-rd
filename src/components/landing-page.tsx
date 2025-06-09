import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#16385d]">
      {/* Header */}
      <header className="py-10">
        <div className="container mx-auto flex flex-col items-center justify-center text-center">
          <Image
            src="/logo.png"
            alt="Dominican Republic E-Ticket System"
            className="w-[200px]"
            width={250}
            height={250}
          />
          <h1 className="mt-4 text-3xl font-bold text-gray-200 md:text-4xl">
            Dominican Republic <br /> E-Ticket System
          </h1>
          <p className="mt-2 font-semibold text-gray-200">
            Electronic Entry/Exit Form for Migration Control
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center text-center">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="grid grid-cols-1 items-center gap-8">
            <div className="flex flex-col items-center justify-center">
              <h2 className="mb-2 text-2xl font-bold text-gray-200 md:text-2xl">
                Welcome
              </h2>
              <p className="mb-8 text-xl leading-relaxed font-normal text-gray-200 md:text-xl">
                Complete your electronic entry or exit form for the Dominican
                Republic. This digital form replaces the traditional paper-based
                process for a faster and more efficient migration experience.
              </p>
              <div className="flex w-full flex-col justify-center gap-4 md:flex-col">
                <Button
                  size="lg"
                  className="w-full bg-blue-600 px-6 py-8 text-lg text-white hover:bg-blue-700 md:w-auto md:text-xl"
                  asChild
                >
                  <Link href="/form">E-Ticket Application</Link>
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full bg-gray-100 px-6 py-8 text-lg text-gray-800 hover:bg-gray-200 md:w-auto md:text-xl"
                  asChild
                >
                  <Link href="#">Consult E-Ticket</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
