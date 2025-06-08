import Image from "next/image";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#16385d]">
      <header className="">
        <div className="container mx-auto flex flex-col items-center justify-center py-10 text-center">
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
          <h1 className="mt-2 font-semibold text-gray-200">
            Electronic Entry/Exit Form for Migration Control
          </h1>
        </div>
      </header>

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
                  className="w-full cursor-pointer bg-blue-600 px-6 py-8 text-lg text-white hover:bg-blue-700 md:w-auto md:text-xl"
                  variant="secondary"
                >
                  E-Ticket Application
                </Button>
                <Button
                  className="w-full cursor-pointer bg-gray-100 px-6 py-8 text-lg text-gray-800 hover:bg-gray-200 md:w-auto md:text-xl"
                  variant="secondary"
                >
                  Consult E-Ticket
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
