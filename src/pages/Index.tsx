import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CodeSearchInterface from "@/components/CodeSearchInterface";
import DualCodingDemo from "@/components/DualCodingDemo";
import FHIRResourceViewer from "@/components/FHIRResourceViewer";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import Footer from "@/components/Footer";
import Login from "@/components/Login";

const Index = () => {
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleBackToHome = () => {
    setShowLogin(false);
  };

  if (showLogin) {
    return <Login onBack={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onLoginClick={handleLoginClick} />
      <main>
        <HeroSection />
        <CodeSearchInterface />
        <DualCodingDemo />
        <FHIRResourceViewer />
        <AnalyticsDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
