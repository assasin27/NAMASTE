import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Copy, Download, Eye, Code2 } from "lucide-react";

// Mock FHIR resources for demonstration
const mockFHIRBundle = {
  resourceType: "Bundle",
  id: "namaste-icd11-mapping-bundle",
  timestamp: "2024-01-15T10:30:00Z",
  entry: [
    {
      resource: {
        resourceType: "Patient",
        id: "patient-001",
        identifier: [
          {
            system: "https://abha.gov.in",
            value: "12-3456-7890-1234"
          }
        ],
        name: [
          {
            family: "Kumar",
            given: ["Rajesh"]
          }
        ],
        gender: "male",
        birthDate: "1979-01-15"
      }
    },
    {
      resource: {
        resourceType: "Encounter",
        id: "encounter-001",
        status: "finished",
        class: {
          system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
          code: "AMB",
          display: "ambulatory"
        },
        subject: {
          reference: "Patient/patient-001"
        },
        period: {
          start: "2025-01-15T10:00:00Z",
          end: "2025-01-15T11:00:00Z"
        }
      }
    }
  ]
};

const mockCondition = {
  resourceType: "Condition",
  id: "condition-vata-imbalance",
  clinicalStatus: {
    coding: [
      {
        system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
        code: "active",
        display: "Active"
      }
    ]
  },
  code: {
    coding: [
      {
        system: "https://namaste.gov.in/codes",
        code: "NAM001.25",
        display: "Vata Dosha Imbalance with Digestive Disorders"
      },
      {
        system: "https://icd.who.int/browse11/l-m/en#/http%3a%2f%2fid.who.int%2ficd%2fentity%2f1920852263",
        code: "TM26.2Z",
        display: "Traditional medicine disorders of Vata"
      },
      {
        system: "https://icd.who.int/browse11/l-m/en",
        code: "11.D2.Y",
        display: "Functional dyspepsia, unspecified"
      }
    ]
  },
  subject: {
    reference: "Patient/patient-001"
  },
  encounter: {
    reference: "Encounter/encounter-001"
  },
  recordedDate: "2024-01-15T10:30:00Z"
};

const mockCodeSystem = {
  resourceType: "CodeSystem",
  id: "namaste-codes",
  url: "https://namaste.gov.in/codes",
  version: "2024.1",
  name: "NAMASTECodes",
  title: "NAMASTE - National AYUSH Morbidity & Standardized Terminologies Electronic",
  status: "active",
  experimental: false,
  publisher: "Ministry of AYUSH, Government of India",
  description: "Standardized terminologies for Ayurveda, Siddha and Unani disorders",
  content: "complete",
  count: 4500,
  concept: [
    {
      code: "NAM001.25",
      display: "Vata Dosha Imbalance with Digestive Disorders",
      definition: "Imbalance in Vata dosha causing digestive and nervous system disorders"
    }
  ]
};

const FHIRResourceViewer = () => {
  const [activeResource, setActiveResource] = useState("condition");
  const [viewMode, setViewMode] = useState("formatted");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadResource = (resource: any, filename: string) => {
    const blob = new Blob([JSON.stringify(resource, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderFormattedView = (resource: any) => {
    if (resource.resourceType === "Condition") {
      return (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h4 className="font-semibold text-foreground mb-3">Resource Metadata</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resource Type:</span>
                  <Badge variant="outline">{resource.resourceType}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID:</span>
                  <code className="text-sm">{resource.id}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className="status-active">
                    {resource.clinicalStatus.coding[0].display}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recorded:</span>
                  <span className="text-sm">{new Date(resource.recordedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold text-foreground mb-3">References</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-muted-foreground text-sm">Patient:</span>
                  <p className="font-mono text-sm">{resource.subject.reference}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">Encounter:</span>
                  <p className="font-mono text-sm">{resource.encounter.reference}</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h4 className="font-semibold text-foreground mb-4">Dual Coding Implementation</h4>
            <div className="space-y-4">
              {resource.code.coding.map((coding: any, index: number) => (
                <Card key={index} className="p-4 bg-muted/30">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge 
                          className={
                            coding.system.includes('namaste') ? 'namaste-code' :
                            coding.system.includes('icd') && coding.code.startsWith('TM') ? 'icd-code' :
                            'code-display bg-warning/10 text-warning border-warning/20'
                          }
                        >
                          {coding.code}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {coding.system.includes('namaste') ? 'NAMASTE' :
                           coding.system.includes('icd') && coding.code.startsWith('TM') ? 'ICD-11 TM2' :
                           'ICD-11 Biomedicine'}
                        </Badge>
                      </div>
                      <h5 className="font-semibold text-foreground mb-1">{coding.display}</h5>
                      <p className="text-sm text-muted-foreground">{coding.system}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(coding.code)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="fhir" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            FHIR Resource Viewer
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore FHIR R4 compliant resources with dual-coded medical conditions following India's EHR standards
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="shadow-strong">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h3 className="text-xl font-semibold text-foreground">FHIR Resources</h3>
                  <Badge variant="secondary" className="status-active">
                    FHIR R4 Compliant
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'formatted' ? 'json' : 'formatted')}>
                    {viewMode === 'formatted' ? <Code2 className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    {viewMode === 'formatted' ? 'JSON View' : 'Formatted View'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadResource(
                      activeResource === 'condition' ? mockCondition : 
                      activeResource === 'bundle' ? mockFHIRBundle : mockCodeSystem,
                      `${activeResource}.json`
                    )}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <Tabs value={activeResource} onValueChange={setActiveResource}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="condition">Condition Resource</TabsTrigger>
                  <TabsTrigger value="bundle">FHIR Bundle</TabsTrigger>
                  <TabsTrigger value="codesystem">CodeSystem</TabsTrigger>
                </TabsList>

                <TabsContent value="condition" className="mt-6">
                  {viewMode === 'formatted' ? (
                    renderFormattedView(mockCondition)
                  ) : (
                    <Card className="p-4 bg-muted/20">
                      <pre className="text-sm overflow-x-auto">
                        <code>{JSON.stringify(mockCondition, null, 2)}</code>
                      </pre>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="bundle" className="mt-6">
                  <Card className="p-4 bg-muted/20">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-foreground">FHIR Bundle</h4>
                        <p className="text-muted-foreground text-sm">Complete patient encounter with dual-coded conditions</p>
                      </div>
                      <Badge variant="outline">{mockFHIRBundle.entry.length} Resources</Badge>
                    </div>
                    <pre className="text-sm overflow-x-auto">
                      <code>{JSON.stringify(mockFHIRBundle, null, 2)}</code>
                    </pre>
                  </Card>
                </TabsContent>

                <TabsContent value="codesystem" className="mt-6">
                  <Card className="p-4 bg-muted/20">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-foreground">NAMASTE CodeSystem</h4>
                        <p className="text-muted-foreground text-sm">FHIR CodeSystem resource for NAMASTE terminologies</p>
                      </div>
                      <Badge variant="outline">{mockCodeSystem.count?.toLocaleString()} Concepts</Badge>
                    </div>
                    <pre className="text-sm overflow-x-auto">
                      <code>{JSON.stringify(mockCodeSystem, null, 2)}</code>
                    </pre>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </Card>

          {/* Implementation Notes */}
          <Card className="mt-8 p-6 bg-primary/5 border-primary/20">
            <h4 className="font-semibold text-foreground mb-3 flex items-center">
              <Code2 className="h-5 w-5 mr-2 text-primary" />
              Implementation Features
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-foreground mb-2">FHIR R4 Compliance</h5>
                <ul className="text-muted-foreground text-sm space-y-1">
                  <li>• Complete FHIR resource structures</li>
                  <li>• Proper referencing between resources</li>
                  <li>• Standardized coding systems</li>
                  <li>• Metadata and provenance tracking</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-foreground mb-2">India EHR Standards</h5>
                <ul className="text-muted-foreground text-sm space-y-1">
                  <li>• OAuth 2.0 with ABHA integration</li>
                  <li>• ISO 22600 access control</li>
                  <li>• Audit trail compliance</li>
                  <li>• Consent management support</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FHIRResourceViewer;