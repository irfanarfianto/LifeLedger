"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorCode = searchParams.get("error_code");
  const errorDescription = searchParams.get("error_description");

  useEffect(() => {
    console.error("Auth Error Details:", {
      error,
      errorCode,
      errorDescription,
      fullUrl: window.location.href
    });
  }, [error, errorCode, errorDescription]);

  return (
    <Card className="w-full max-w-md mx-auto mt-20 border-destructive/50">
      <CardHeader className="text-center">
        <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-4">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <CardTitle className="text-destructive">Login Gagal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-md text-sm font-mono break-words">
          <p><strong>Error:</strong> {error || "Unknown"}</p>
          {errorCode && <p><strong>Code:</strong> {errorCode}</p>}
          {errorDescription && (
            <p className="mt-2 text-muted-foreground">{errorDescription}</p>
          )}
        </div>
        
        <p className="text-center text-sm text-muted-foreground">
          Silakan cek console browser (F12) untuk detail lebih lanjut.
        </p>

        <div className="flex justify-center pt-4">
          <Button asChild variant="outline">
            <Link href="/">Kembali ke Halaman Utama</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="container px-4">
      <Suspense fallback={<div>Loading error details...</div>}>
        <ErrorContent />
      </Suspense>
    </div>
  );
}
