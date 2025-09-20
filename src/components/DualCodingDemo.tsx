import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Link2, CheckCircle, RefreshCw } from "lucide-react";

// Mock patient data for demonstration
const mockPatientData = {
  id: "PAT-2025-001",
  name: "Rajesh Kumar",
  age: 45,
  gender: "Male",
  encounter: "ENC-2025-001"
};

const mockMappings = [
  {
    id: 1,
    namasteCode: "NAM001.25",
    namasteTerm: "Vata Dosha Imbalance with Digestive Disorders",
    icdTM2Code: "TM26.2Z",
    icdTM2Term: "Traditional medicine disorders of Vata",
    icdBioCode: "11.D2.Y",
    icdBioTerm: "Functional dyspepsia, unspecified",
    confidence: 95,
    status: "mapped"
  },
  {
    id: 2,
    namasteCode: "NAM003.67",
    namasteTerm: "Kapha Dosha Excess causing Respiratory Issues",
    icdTM2Code: "TM26.3Z", 
    icdTM2Term: "Traditional medicine disorders of Kapha",
    icdBioCode: "CA25.Z",
    icdBioTerm: "Chronic obstructive pulmonary disease, unspecified",
    confidence: 87,
    status: "mapped"
  }
];

const DualCodingDemo = () => {
  const [selectedMapping, setSelectedMapping] = useState(mockMappings[0]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMapCodes = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <section id="mapping" className="py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Dual-Coding Demonstration
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how NAMASTE codes are automatically mapped to ICD-11 TM2 and Biomedicine classifications
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Patient Context */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-medical">
              <h3 className="text-lg font-semibold text-foreground mb-4">Patient Context</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Patient ID</label>
                  <p className="font-mono text-sm">{mockPatientData.id}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Name</label>
                  <p className="font-semibold">{mockPatientData.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Age</label>
                    <p>{mockPatientData.age}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Gender</label>
                    <p>{mockPatientData.gender}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Encounter ID</label>
                  <p className="font-mono text-sm">{mockPatientData.encounter}</p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Available Mappings</h4>
                {mockMappings.map((mapping) => (
                  <Card 
                    key={mapping.id}
                    className={`p-3 cursor-pointer transition-medical ${
                      selectedMapping.id === mapping.id ? 'ring-2 ring-primary shadow-medical' : 'hover:shadow-soft'
                    }`}
                    onClick={() => setSelectedMapping(mapping)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge className="namaste-code text-xs font-mono mb-1">
                          {mapping.namasteCode}
                        </Badge>
                        <p className="text-sm text-foreground font-medium">
                          {mapping.namasteTerm.split(' ').slice(0, 4).join(' ')}...
                        </p>
                      </div>
                      <Badge variant="secondary" className="status-active">
                        {mapping.confidence}%
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>

          {/* Dual Coding Visualization */}
          <div className="lg:col-span-2">
            <Card className="p-8 shadow-strong">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">Code Mapping Visualization</h3>
                <Button 
                  onClick={handleMapCodes}
                  disabled={isProcessing}
                  className="medical-gradient"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Link2 className="mr-2 h-4 w-4" />
                      Remap Codes
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-8">
                {/* NAMASTE Code */}
                <div className="relative">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">1</span>
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">NAMASTE Code (Traditional Medicine)</h4>
                  </div>
                  
                  <Card className="p-6 bg-primary/5 border-primary/20">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Badge className="namaste-code mb-3">
                          {selectedMapping.namasteCode}
                        </Badge>
                        <h5 className="text-lg font-semibold text-foreground mb-2">
                          {selectedMapping.namasteTerm}
                        </h5>
                        <p className="text-muted-foreground text-sm">
                          Traditional Ayurveda diagnosis based on dosha imbalance theory
                        </p>
                      </div>
                      <Badge variant="secondary" className="status-active">
                        Source
                      </Badge>
                    </div>
                  </Card>
                </div>

                {/* Mapping Arrow */}
                <div className="flex items-center justify-center">
                  <div className="flex items-center space-x-4">
                    <div className="h-px bg-border w-16"></div>
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                      <ArrowRight className="h-5 w-5 text-accent" />
                    </div>
                    <div className="h-px bg-border w-16"></div>
                  </div>
                </div>

                {/* ICD-11 Dual Codes */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* TM2 Code */}
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                        <span className="text-accent font-bold text-sm">2</span>
                      </div>
                      <h4 className="text-lg font-semibold text-foreground">ICD-11 TM2</h4>
                    </div>
                    
                    <Card className="p-4 bg-accent/5 border-accent/20">
                      <Badge className="icd-code mb-2">
                        {selectedMapping.icdTM2Code}
                      </Badge>
                      <h5 className="font-semibold text-foreground mb-2">
                        {selectedMapping.icdTM2Term}
                      </h5>
                      <p className="text-muted-foreground text-sm">
                        WHO Traditional Medicine Module classification
                      </p>
                      <div className="flex items-center space-x-2 mt-3">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-success text-sm font-medium">Mapped</span>
                      </div>
                    </Card>
                  </div>

                  {/* Biomedicine Code */}
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                        <span className="text-warning font-bold text-sm">3</span>
                      </div>
                      <h4 className="text-lg font-semibold text-foreground">ICD-11 Biomedicine</h4>
                    </div>
                    
                    <Card className="p-4 bg-warning/5 border-warning/20">
                      <Badge className="code-display bg-warning/10 text-warning border-warning/20 mb-2">
                        {selectedMapping.icdBioCode}
                      </Badge>
                      <h5 className="font-semibold text-foreground mb-2">
                        {selectedMapping.icdBioTerm}
                      </h5>
                      <p className="text-muted-foreground text-sm">
                        Standard biomedical classification for insurance and reporting
                      </p>
                      <div className="flex items-center space-x-2 mt-3">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-success text-sm font-medium">Mapped</span>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Confidence & Metadata */}
                <Card className="p-4 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Mapping Confidence</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-success transition-all duration-1000"
                              style={{ width: `${selectedMapping.confidence}%` }}
                            ></div>
                          </div>
                          <span className="text-success font-semibold">{selectedMapping.confidence}%</span>
                        </div>
                      </div>
                      <Separator orientation="vertical" className="h-8" />
                      <div>
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge variant="secondary" className="status-active ml-2">
                          {selectedMapping.status}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Export to FHIR
                    </Button>
                  </div>
                </Card>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DualCodingDemo;