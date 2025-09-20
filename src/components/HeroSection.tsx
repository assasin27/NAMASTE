import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Database, Shield, Zap } from "lucide-react";
import heroImage from "@/assets/hero-medical.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Modern healthcare EMR dashboard" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 lg:px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="inline-flex items-center space-x-2">
                <Shield className="h-3 w-3" />
                <span>SIH 2025 Solution</span>
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                NAMASTE & ICD-11
                <span className="block text-primary">Integration Platform</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Seamlessly integrate traditional medicine coding with global healthcare standards. 
                FHIR R4 compliant dual-coding system for Ayurveda, Siddha, and Unani practices.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="medical-gradient shadow-glow transition-medical"
                onClick={() => {
                  const searchSection = document.getElementById('search');
                  if (searchSection) {
                    searchSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Explore Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Key Features */}
            <div className="grid sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">4,500+</h3>
                  <p className="text-sm text-muted-foreground">NAMASTE Codes</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">FHIR R4</h3>
                  <p className="text-sm text-muted-foreground">Compliant</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Real-time</h3>
                  <p className="text-sm text-muted-foreground">API Integration</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="lg:justify-self-end">
            <Card className="p-8 card-gradient shadow-strong">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Traditional Medicine Meets Digital Standards
                  </h3>
                  <p className="text-muted-foreground">
                    Bridging Ayush healthcare with global ICD-11 classification
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">529</div>
                    <div className="text-sm text-muted-foreground">ICD-11 TM2 Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent">196</div>
                    <div className="text-sm text-muted-foreground">Pattern Codes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success">100%</div>
                    <div className="text-sm text-muted-foreground">EHR Standards</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warning">24/7</div>
                    <div className="text-sm text-muted-foreground">API Availability</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;