"use client";

import { useRef, useState } from "react";
import { Download, ArrowLeft, ArrowRight, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TechStackSelector } from "@/components/tech-stack-selector";
import { StepIndicator } from "@/components/step-indicator";
import {
  frontendTechnologies,
  backendFrameworks,
  databaseTechnologies,
  devOpsTechnologies,
  toolingTechnologies,
  mobileTechnologies,
} from "@/lib/tech-stacks";
import { FORM_FIELDS } from "@/lib/form-fields";
import Formfield from "./Formfield";

interface FormData {
  name: string;
  description: string;
  frontend: string;
  backend: string;
  database: string;
  mobile: string;
  devops: string[];
  tooling: string[];
}

const steps = [
  { id: "frontend", title: "Frontend" },
  { id: "backend", title: "Backend" },
  { id: "mobile", title: "Mobile" },
  { id: "database", title: "Database" },
  { id: "devops", title: "DevOps" },
  { id: "tooling", title: "Development Tools" },
];

export function GeneratorForm() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const downloadBlob = useRef<Blob | null>(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    frontend: "",
    backend: "",
    database: "",
    mobile: "",
    devops: [],
    tooling: [],
  });

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSkip = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleGenerate = async () => {
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Please enter a project name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = "/api/generate";

      const response = await fetch(endpoint, {
        cache: "no-cache",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        downloadBlob.current = await response.blob();
        setIsGenerated(true);
        toast({
          title: "Success!",
          description: "Your boilerplate has been generated successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate boilerplate.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      if (downloadBlob.current) {
        const url = window.URL.createObjectURL(downloadBlob.current);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${formData.name}.zip`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download boilerplate.",
        variant: "destructive",
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <TechStackSelector
            title="Frontend Framework"
            technologies={frontendTechnologies}
            selected={[formData.frontend]}
            onSelect={(id) => setFormData({ ...formData, frontend: id })}
          />
        );
      case 2:
        return (
          <TechStackSelector
            title="Backend Framework"
            technologies={backendFrameworks}
            selected={[formData.backend]}
            onSelect={(id) => setFormData({ ...formData, backend: id })}
          />
        );
      case 3:
        return (
          <TechStackSelector
            title="Mobile Framework"
            technologies={mobileTechnologies}
            selected={[formData.mobile]}
            onSelect={(id) => setFormData({ ...formData, mobile: id })}
          />
        );
      case 4:
        return (
          <TechStackSelector
            title="Database"
            technologies={databaseTechnologies}
            selected={[formData.database]}
            onSelect={(id) => setFormData({ ...formData, database: id })}
          />
        );
      case 5:
        return (
          <TechStackSelector
            title="DevOps Tools"
            technologies={devOpsTechnologies}
            selected={formData.devops}
            onSelect={(id) =>
              setFormData({
                ...formData,
                devops: formData.devops.includes(id)
                  ? formData.devops.filter((item) => item !== id)
                  : [...formData.devops, id],
              })
            }
          />
        );
      case 6:
        return (
          <TechStackSelector
            title="Development Tools"
            technologies={toolingTechnologies}
            selected={formData.tooling}
            onSelect={(id) =>
              setFormData({
                ...formData,
                tooling: formData.tooling.includes(id)
                  ? formData.tooling.filter((item) => item !== id)
                  : [...formData.tooling, id],
              })
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="max-w-5xl mx-auto border-2">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Configure Your Project</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid gap-4">
          {FORM_FIELDS.map((field) => (
            <Formfield
              key={field.name}
              type={field.type}
              label={field.label}
              onChange={(value) => setFormData((prev) => ({ ...prev, [field.name]: value }))}
              // options={field.options}
              placeholder={field.placeholder}
              value={formData[field.name]}
            />
          ))}
        </div>
        <StepIndicator steps={steps} currentStep={currentStep} />

        <div className="min-h-[400px]">{renderStepContent()}</div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={handleSkip}
              disabled={currentStep === steps.length}
              className="flex gap-2"
            >
              Skip
              <SkipForward className="w-4 h-4" />
            </Button>

            {currentStep === steps.length ? (
              <div className="flex gap-4">
                <Button onClick={handleGenerate} disabled={isLoading} className="flex gap-2">
                  {isLoading ? "Generating..." : "Generate"}
                </Button>
                {isGenerated && (
                  <Button onClick={handleDownload} variant="outline" className="flex gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                )}
              </div>
            ) : (
              <Button onClick={handleNext} className="flex gap-2">
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
