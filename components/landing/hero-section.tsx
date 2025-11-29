import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex flex-col items-center text-center px-4 md:px-6">
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
          Where Money Meets Time
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Master your finances and productivity in one seamless experience. 
          Track expenses, manage tasks, and realize the true value of your time.
        </p>
      </div>
      <div className="flex flex-col gap-2 min-[400px]:flex-row mt-8">
        <Link href="/auth/login">
          <Button size="lg" className="h-12 px-8">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link href="#features">
          <Button variant="outline" size="lg" className="h-12 px-8">
            Learn More
          </Button>
        </Link>
      </div>
    </section>
  );
}
