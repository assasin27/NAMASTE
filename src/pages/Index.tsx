import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CodeSearchInterface from "@/components/CodeSearchInterface";
import DualCodingDemo from "@/components/DualCodingDemo";
import FHIRResourceViewer from "@/components/FHIRResourceViewer";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
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
