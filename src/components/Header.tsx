import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, User } from "lucide-react";

interface HeaderProps {
  onLoginClick: () => void;
}

const Header = ({ onLoginClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-card shadow-medical border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Logo & Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 medical-gradient rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">N</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">NAMASTE EMR</h1>
                <p className="text-xs text-muted-foreground">ICD-11 Integration Platform</p>
              </div>
            </div>
          </div>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#search" className="text-foreground hover:text-primary transition-colors">
              Code Search
            </a>
            <a href="#mapping" className="text-foreground hover:text-primary transition-colors">
              Dual Coding
            </a>
            <a href="#fhir" className="text-foreground hover:text-primary transition-colors">
              FHIR Resources
            </a>
            <a href="#analytics" className="text-foreground hover:text-primary transition-colors">
              Analytics
            </a>
          </nav>

          {/* Status Badges */}
          <div className="hidden lg:flex items-center space-x-3">
            <Badge variant="secondary" className="status-active">
              API Connected
            </Badge>
            <Badge variant="outline" className="text-xs">
              FHIR R4 Compliant
            </Badge>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onLoginClick}
              title="Sign In"
            >
              <User className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <div className="px-4 py-4 space-y-3">
              <a href="#search" className="block text-foreground hover:text-primary">
                Code Search
              </a>
              <a href="#mapping" className="block text-foreground hover:text-primary">
                Dual Coding
              </a>
              <a href="#fhir" className="block text-foreground hover:text-primary">
                FHIR Resources
              </a>
              <a href="#analytics" className="block text-foreground hover:text-primary">
                Analytics
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;