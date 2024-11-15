"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Technology {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface TechStackSelectorProps {
  title: string;
  technologies: Technology[];
  selected: string[];
  onSelect: (id: string) => void;
}

export function TechStackSelector({
  title,
  technologies,
  selected,
  onSelect,
}: TechStackSelectorProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {technologies.map((tech) => (
          <Card
            key={tech.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:scale-105",
              selected.includes(tech.id) && "border-primary",
              hoveredId === tech.id && "shadow-lg"
            )}
            onClick={() => onSelect(tech.id)}
            onMouseEnter={() => setHoveredId(tech.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <CardContent className="p-4 text-center space-y-3">
              <div className="relative w-12 h-12 mx-auto">
                <Image src={tech.icon} alt={tech.name} fill className="object-contain" />
              </div>
              <h3 className="font-medium">{tech.name}</h3>
              <p className="text-sm text-muted-foreground">{tech.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
