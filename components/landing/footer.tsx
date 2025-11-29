"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-6 bg-background border-t">
      <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} LifeLedger. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="#" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:underline">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
