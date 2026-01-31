import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ImageUpload";
import { DiagnosisReport } from "@/components/DiagnosisReport";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Loader2, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-plants.jpg";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedFile(file);
    setSelectedImage(preview);
    setDiagnosis(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please select an image first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setDiagnosis(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Server error");

      const finalText = `
Disease: ${data.prediction}
Confidence: ${(data.confidence * 100).toFixed(2)}%
      `.trim();

      setDiagnosis(finalText);

      toast({
        title: "Analysis Complete",
        description: "Your plant health report is ready",
      });

    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">

      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 opacity-10">
          <img
            src={heroImage}
            alt="Healthy plants"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">
              AI-Powered Plant Care
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Plant Disease Detection
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Upload an image of your plant and get instant AI-powered diagnosis.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <ImageUpload
            onImageSelect={handleImageSelect}
            selectedImage={selectedImage}
          />

          {selectedImage && !diagnosis && (
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-gradient-primary shadow-soft hover:shadow-medium transition-all px-8"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Plant...
                  </>
                ) : (
                  <>
                    <Leaf className="mr-2 h-5 w-5" />
                    Analyze Image
                  </>
                )}
              </Button>
            </div>
          )}

          {diagnosis && selectedImage && (
            <DiagnosisReport diagnosis={diagnosis} image={selectedImage} />
          )}
        </div>
      </section>

      <FeaturesSection />

      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>
            Plant Disease Detection © 2025 | Powered by Advanced AI Technology
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
