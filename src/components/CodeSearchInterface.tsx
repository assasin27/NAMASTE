import { useState } from "react";
// import { fetchICD11Codes } from "@/lib/icd11Api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Copy, ExternalLink, ArrowRight } from "lucide-react";
import ICD11Browser from "./ICD11Browser";

// Mock data for demonstration
const mockNamasteResults = [
  {
    code: "NAM001.25",
    term: "Vata Dosha Imbalance",
    system: "Ayurveda",
    description: "Imbalance in Vata dosha causing digestive and nervous system disorders",
    icdMapping: "TM26.2Z",
    status: "active"
  },
  {
    code: "NAM002.48",
    term: "Pitta Vikara",
    system: "Ayurveda", 
    description: "Pitta constitution disorders affecting metabolism and inflammation",
    icdMapping: "TM26.1Z",
    status: "active"
  },
  {
    code: "NAM003.67",
    term: "Kapha Dosha Excess",
    system: "Ayurveda",
    description: "Excessive Kapha leading to respiratory and metabolic issues",
    icdMapping: "TM26.3Z",
    status: "active"
  }
];

const mockIcdResults = [
  {
    code: "TM26.2Z",
    term: "Traditional medicine disorders of Vata",
    system: "ICD-11 TM2",
    description: "Disorders related to Vata dosha in traditional medicine classification",
    namasteMapping: "NAM001.25",
    status: "current"
  },
  {
    code: "26.A1.2",
    term: "Functional dyspepsia",
    system: "ICD-11 Biomedicine",
    description: "Chronic or recurrent pain in the upper abdomen",
    namasteMapping: "NAM004.12",
    status: "current"
  }
];

const CodeSearchInterface = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("namaste");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setResults(mockNamasteResults.filter(item => 
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      setIsSearching(false);
    }, 800);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <section id="search" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Medical Code Search & Lookup
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Search through NAMASTE terminologies and ICD-11 codes with real-time auto-complete and dual-coding mapping
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 shadow-strong">
            {/* Search Interface */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search medical terms, codes, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-lg"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  size="lg"
                  className="medical-gradient shadow-medical"
                >
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>

              {/* Search Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="namaste">NAMASTE Codes</TabsTrigger>
                  <TabsTrigger value="icd11">ICD-11 Codes</TabsTrigger>
                </TabsList>

                <TabsContent value="namaste" className="mt-6">
                  <div className="space-y-4">
                    {results.length > 0 ? (
                      results.map((item, index) => (
                        <Card key={index} className="p-6 hover:shadow-medical transition-medical">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <Badge className="namaste-code font-mono">
                                  {item.code}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {item.system}
                                </Badge>
                                <Badge variant="secondary" className={`status-${item.status === 'active' ? 'active' : 'pending'}`}>
                                  {item.status}
                                </Badge>
                              </div>
                              <h3 className="text-lg font-semibold text-foreground mb-2">
                                {item.term}
                              </h3>
                              <p className="text-muted-foreground mb-4">
                                {item.description}
                              </p>
                              {item.icdMapping && (
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-muted-foreground">Maps to ICD-11:</span>
                                  <Badge className="icd-code font-mono">
                                    {item.icdMapping}
                                  </Badge>
                                  <Button variant="ghost" size="sm">
                                    <ArrowRight className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(item.code)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : searchTerm && !isSearching ? (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">No results found for "{searchTerm}"</p>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">Search for NAMASTE codes and terminologies</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="icd11" className="mt-6">
                  <ICD11Browser />
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CodeSearchInterface;