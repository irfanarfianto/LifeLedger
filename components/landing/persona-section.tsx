"use client";

import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Laptop } from "lucide-react";
import { Card } from "@/components/ui/card";

const personas = [
  {
    icon: GraduationCap,
    title: "Mahasiswa",
    description: "Kelola budget semester dan lacak pengeluaran kuliah dengan efektif.",
    features: ["Budget Semester", "Tracking Pengeluaran", "Savings Goals"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Briefcase,
    title: "Pekerja",
    description: "Hitung gaji bersih, kelola potongan, dan optimalkan keuangan bulanan Anda.",
    features: ["Kalkulasi Gaji", "Manajemen Potongan", "Financial Planning"],
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Laptop,
    title: "Freelancer",
    description: "Lacak income dari berbagai sumber dan hitung nilai waktu Anda.",
    features: ["Income Tracking", "Time Value Calculator", "Multi-Income"],
    color: "from-orange-500 to-red-500"
  }
];

export function PersonaSection() {
  return (
    <section className="w-full py-24 md:py-32 bg-gradient-to-b from-background to-primary/5 relative overflow-hidden">
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
            Disesuaikan dengan{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Kebutuhan Anda
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Fitur yang beradaptasi dengan gaya hidup Anda
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {personas.map((persona, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group relative overflow-hidden p-8 h-full border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${persona.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative z-10 space-y-6">
                  {/* Icon */}
                  <div className="flex justify-center">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${persona.color} shadow-xl`}>
                      <persona.icon className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="text-center space-y-3">
                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                      {persona.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {persona.description}
                    </p>
                  </div>

                  {/* Features list */}
                  <div className="space-y-2 pt-4 border-t border-primary/10">
                    {persona.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${persona.color}`} />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
