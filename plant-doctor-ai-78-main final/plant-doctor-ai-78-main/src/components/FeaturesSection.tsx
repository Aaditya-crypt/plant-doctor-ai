import { Card } from "@/components/ui/card";
import { Microscope, Zap, Shield, Globe } from "lucide-react";

const features = [
  {
    icon: Microscope,
    title: "AI-Powered Analysis",
    description: "Advanced computer vision technology analyzes your plant images with expert-level accuracy"
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get comprehensive disease diagnosis reports in seconds, not days"
  },
  {
    icon: Shield,
    title: "Expert Guidance",
    description: "Receive detailed treatment recommendations and prevention tips from our AI expert"
  },
  {
    icon: Globe,
    title: "Accessible Anywhere",
    description: "No login required. Upload and analyze plant health from any device, anywhere"
  }
];

export const FeaturesSection = () => {
  return (
    <section className="py-16 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional-grade plant disease detection powered by cutting-edge AI technology, 
            making expert diagnostics accessible to everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-6 text-center hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
              >
                <div className="inline-flex rounded-full bg-gradient-primary p-3 mb-4">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
