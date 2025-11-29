import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Ready to Take Control?
        </h2>
        <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Join LifeLedger today and start managing your money and time like a pro.
        </p>
        <div className="flex flex-col gap-2 min-[400px]:flex-row mt-8">
          <Link href="/auth/login">
            <Button variant="secondary" size="lg" className="h-12 px-8">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
