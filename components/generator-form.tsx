"use client";

import { useState } from "react";
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

interface FormData {
  name: string;
  frontend: string;
  backend: string;
  database: string;
  mobile: string;
  devops: string[];
  tooling: string[];
}

const steps = [
  { id: 'project', title: 'Project Details' },
  { id: 'frontend', title: 'Frontend' },
  { id: 'backend', title: 'Backend' },
  { id: 'mobile', title: 'Mobile' },
  { id: 'database', title: 'Database' },
  { id: 'devops', title: 'DevOps' },
  { id: 'tooling', title: 'Development Tools' },
];

export function GeneratorForm() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    frontend: "",
    backend: "",
    database: "",
    mobile: "",
    devops: [],
    tooling: [],
  });

  const handleNext = () => {
    if (currentStep === 0 && !formData.name) {
      toast({
        title: "Error",
        description: "Please enter a project name",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSkip = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsGenerated(true);
      toast({
        title: "Success!",
        description: "Your boilerplate has been generated successfully.",
      });
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Success",
        description: "Your boilerplate has been downloaded.",
      });
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
      case 0:
        return (
          <div className="grid gap-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="my-awesome-project"
              className="border-2"
            />
          </div>
        );
      case 1:
        return (
          <TechStackSelector
            title="Frontend Framework"
            technologies={frontendTechnologies}
            selected={formData.frontend}
            onSelect={(id) => setFormData({ ...formData, frontend: id })}
          />
        );
      case 2:
        return (
          <TechStackSelector
            title="Backend Framework"
            technologies={backendFrameworks}
            selected={formData.backend}
            onSelect={(id) => setFormData({ ...formData, backend: id })}
          />
        );
      case 3:
        return (
          <TechStackSelector
            title="Mobile Framework"
            technologies={mobileTechnologies}
            selected={formData.mobile}
            onSelect={(id) => setFormData({ ...formData, mobile: id })}
          />
        );
      case 4:
        return (
          <TechStackSelector
            title="Database"
            technologies={databaseTechnologies}
            selected={formData.database}
            onSelect={(id) => setFormData({ ...formData, database: id })}
          />
        );
      case 5:
        return (
          <TechStackSelector
            title="DevOps Tools"
            technologies={devOpsTechnologies}
            selected={formData.devops[0] || ""}
            onSelect={(id) => 
              setFormData({ 
                ...formData, 
                devops: formData.devops.includes(id)
                  ? formData.devops.filter(item => item !== id)
                  : [...formData.devops, id]
              })
            }
          />
        );
      case 6:
        return (
          <TechStackSelector
            title="Development Tools"
            technologies={toolingTechnologies}
            selected={formData.tooling[0] || ""}
            onSelect={(id) =>
              setFormData({
                ...formData,
                tooling: formData.tooling.includes(id)
                  ? formData.tooling.filter(item => item !== id)
                  : [...formData.tooling, id]
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
        <CardTitle className="text-center text-2xl font-bold">
          Configure Your Project
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <StepIndicator steps={steps} currentStep={currentStep} />
        
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <Button
            variant="ghost"
            onClick={handleSkip}
            disabled={currentStep === steps.length - 1}
            className="flex gap-2"
          >
            Skip
            <SkipForward className="w-4 h-4" />
          </Button>

          {currentStep === steps.length - 1 ? (
            <div className="flex gap-4">
              <Button 
                onClick={handleGenerate} 
                disabled={isLoading}
                className="flex gap-2"
              >
                {isLoading ? "Generating..." : "Generate"}
              </Button>
              {isGenerated && (
                <Button 
                  onClick={handleDownload}
                  variant="outline"
                  className="flex gap-2"
                >
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
      </CardContent>
    </Card>
  );
}