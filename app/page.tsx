"use client";

import { motion } from "framer-motion";
import { GeneratorForm } from "@/components/generator-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { Code2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <ThemeToggle />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-16"
      >
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center mb-6"
          >
            <Code2 className="h-16 w-16 text-primary" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4 tracking-tight"
          >
            Universal Boilerplate Generator
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Create production-ready project templates with your favorite tech stack.
            Choose from a wide range of frameworks, languages, and tools to kickstart
            your development.
          </motion.p>
        </div>

        <GeneratorForm />
      </motion.div>
    </div>
  );
}