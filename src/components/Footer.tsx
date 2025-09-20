import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Github, ExternalLink, Heart, Shield, Database, Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 medical-gradient rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">N</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">NAMASTE EMR</h3>
                <p className="text-xs text-muted-foreground">ICD-11 Integration</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Bridging traditional medicine with global healthcare standards through FHIR R4 compliant dual-coding systems.
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Key Features</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-primary" />
                <span>4,500+ NAMASTE Codes</span>
              </li>
              <li className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-accent" />
                <span>FHIR R4 Compliance</span>
              </li>
              <li className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-warning" />
                <span>Real-time API Integration</span>
              </li>
              <li className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-success" />
                <span>Traditional Medicine Support</span>
              </li>
            </ul>
          </div>

          {/* Technical Standards */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Standards</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• FHIR R4 Resources</li>
              <li>• ICD-11 TM2 Module</li>
              <li>• OAuth 2.0 Security</li>
              <li>• ABHA Integration</li>
              <li>• ISO 22600 Compliance</li>
              <li>• SNOMED CT Support</li>
            </ul>
          </div>

          {/* SIH Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">SIH 2025</h4>
            <div className="space-y-3">
              <div className="bg-primary/10 p-3 rounded-lg">
                <p className="text-sm font-medium text-primary">Problem Statement #25026</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Ministry of Ayush - Traditional Medicine EMR Integration
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>All India Institute of Ayurveda (AIIA)</p>
                <p>Category: MedTech / HealthTech</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © NAMASTE EMR Integration Platform. Built for Smart India Hackathon.
          </div>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">API Documentation</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;