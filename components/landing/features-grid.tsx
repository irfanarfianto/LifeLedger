"use client";

import { motion } from "framer-motion";
import { Wallet, Calendar, BarChart3, Settings, Target, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Wallet,
    title: "Manajemen Keuangan",
    description: "Lacak pemasukan, pengeluaran, dan kelola berbagai dompet dalam satu tempat.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Calendar,
    title: "Perencana & Tugas",
    description: "Rencanakan hari Anda dengan kalender dan Eisenhower Matrix yang powerful.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: BarChart3,
    title: "Analitik Mendalam",
    description: "Dapatkan insight tentang pola keuangan dan produktivitas Anda.",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: Target,
    title: "Wishlist & Goals",
    description: "Catat keinginan dan lacak progress menabung untuk mencapai target.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: TrendingUp,
    title: "Pomodoro Timer",
    description: "Tingkatkan fokus dengan teknik Pomodoro yang terbukti efektif.",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    icon: Settings,
    title: "Persona Adaptif",
    description: "Fitur yang menyesuaikan dengan role Anda: Mahasiswa, Pekerja, atau Freelancer.",
    gradient: "from-indigo-500 to-purple-500"
  }
];

export function FeaturesGrid() {
  return (
    <section className="w-full py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold">
            Fitur{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Lengkap
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Semua yang Anda butuhkan dalam satu aplikasi
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group relative overflow-hidden p-6 h-full border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 space-y-4">
                  {/* Icon with gradient */}
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
