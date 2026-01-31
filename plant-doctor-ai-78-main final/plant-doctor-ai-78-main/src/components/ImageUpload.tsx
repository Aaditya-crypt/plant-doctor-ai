import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string, result: any) => void;
  selectedImage: string | null;
}

export const ImageUpload = ({ onImageSelect, selectedImage }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // --- 👍 MAIN FUNCTION: PREVIEW + UPLOAD TO BACKEND ---
  const processFile = async (file: File) => {
    // Preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      const preview = e.target?.result as string;

      // SEND TO BACKEND
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch("http://127.0.0.1:5000/predict", {
          method: "POST",
          body: formData,
        });

        const result = await res.json();
        console.log("SERVER RESULT:", result);

        onImageSelect(file, preview, result);
      } catch (err) {
        console.error("UPLOAD ERROR:", err);
        alert("Failed to connect to backend. Make sure Flask is running.");
      }

      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        isDragging && "border-primary scale-105 shadow-medium"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {selectedImage ? (
        <div className="relative">
          <img
            src={selectedImage}
            alt="Selected plant"
            className="w-full h-[400px] object-cover rounded-lg"
          />

          {loading && (
            <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-xl font-bold">
              Processing...
            </div>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <Button
              variant="secondary"
              onClick={handleButtonClick}
              className="shadow-medium"
            >
              <Upload className="mr-2 h-4 w-4" />
              Select Different Image
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-4 rounded-full bg-gradient-primary p-4">
            <ImageIcon className="h-12 w-12 text-primary-foreground" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">Upload Plant Image</h3>
          <p className="mb-6 text-muted-foreground max-w-md">
            Drag and drop your plant image here, or click the button below to
            select a file
          </p>

          <Button
            onClick={handleButtonClick}
            size="lg"
            className="bg-gradient-primary shadow-soft hover:shadow-medium transition-all"
          >
            <Upload className="mr-2 h-5 w-5" />
            Select Image
          </Button>

          <p className="mt-4 text-sm text-muted-foreground">
            Supports: JPG, PNG, WEBP
          </p>
        </div>
      )}
    </Card>
  );
};
