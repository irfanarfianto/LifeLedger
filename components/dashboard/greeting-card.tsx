"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useState } from "react";

const quotes = [
  "Cara terbaik untuk melakukan pekerjaan hebat adalah dengan mencintai apa yang Anda lakukan.",
  "Segala sesuatu tampak mustahil sampai hal itu selesai.",
  "Jangan melihat jam; lakukan apa yang dilakukannya. Teruslah bergerak.",
  "Masa depan tergantung pada apa yang Anda lakukan hari ini.",
  "Percayalah Anda bisa dan Anda sudah setengah jalan.",
  "Sukses bukanlah akhir, kegagalan bukanlah fatal: keberanian untuk melanjutkan yang penting.",
  "Waktu Anda terbatas, jadi jangan sia-siakan dengan menjalani hidup orang lain.",
];

interface GreetingCardProps {
  userName?: string;
}

export function GreetingCard({ userName }: GreetingCardProps) {
  const [quote, setQuote] = useState("");
  const [greeting, setGreeting] = useState("");
  // 1. Tambahkan state untuk tanggal
  const [dateString, setDateString] = useState("");

  useEffect(() => {
    // Set random quote
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    // Set greeting based on time
    const now = new Date(); // Ambil waktu sekali saja biar konsisten
    const hour = now.getHours();
    
    if (hour < 11) setGreeting("Selamat Pagi");
    else if (hour < 15) setGreeting("Selamat Siang");
    else if (hour < 18) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");

    // 2. Set tanggal hanya di dalam useEffect (Client Side)
    setDateString(now.toLocaleDateString("id-ID", { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  }, []);

  // Get first name only
  const firstName = userName?.split(' ')[0] || '';
  const displayName = firstName ? `, ${firstName}` : '';

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl md:text-2xl font-bold">
          {greeting}{displayName}! 👋
        </CardTitle>
        <CardDescription className="text-blue-100 text-sm md:text-base">
          {quote}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xs md:text-sm text-blue-200 font-medium">
          {/* 3. Render state variable, bukan new Date() langsung */}
          {dateString}
        </p>
      </CardContent>
    </Card>
  );
}