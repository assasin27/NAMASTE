import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Copy, ExternalLink, ArrowRight } from "lucide-react";
import { Command, CommandInput, CommandList, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import debounce from 'lodash/debounce';
import { CodeMappingService } from "@/lib/services/codeMappingService";
import CSVImport from "./CSVImport";

// Mock data for demonstration
interface NAMASTECode {
  code: string;
  term: string;
  system: string;
  description: string;
  icdMapping: string;
  status: string;
}

interface ICD11Code {
  code: string;
  term: string;
  system: string;
  description: string;
  namasteMapping: string;
  status: string;
}

const mockNamasteResults: NAMASTECode[] = [
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
  },
  {
    code: "NAM004.12",
    term: "Agnimandya",
    system: "Ayurveda",
    description: "Digestive impairment leading to metabolic disorders",
    icdMapping: "26.A1.2",
    status: "active"
  },
  {
    code: "NAM005.34",
    term: "Ama Condition",
    system: "Ayurveda",
    description: "Accumulation of toxins due to improper digestion",
    icdMapping: "26.A1.3",
    status: "active"
  },
  {
    code: "NAM006.89",
    term: "Majja Kshaya",
    system: "Ayurveda",
    description: "Neurological condition affecting bone marrow and nervous system",
    icdMapping: "8D43.0Z",
    status: "active"
  },
  {
    code: "NAM007.45",
    term: "Pranavahasrotas Disorder",
    system: "Ayurveda",
    description: "Respiratory channel dysfunction affecting breathing",
    icdMapping: "CA20.Z",
    status: "active"
  },
  {
    code: "NAM008.56",
    term: "Rakta Dusti",
    system: "Ayurveda",
    description: "Blood tissue impurity leading to skin and circulatory disorders",
    icdMapping: "BD90.0",
    status: "active"
  },
  {
    code: "NAM009.23",
    term: "Manas Roga",
    system: "Ayurveda",
    description: "Mental health conditions in Ayurvedic classification",
    icdMapping: "6A80.Z",
    status: "active"
  },
  {
    code: "NAM010.78",
    term: "Asthi Kshaya",
    system: "Ayurveda",
    description: "Bone tissue depletion and skeletal disorders",
    icdMapping: "FB83.Z",
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
    code: "TM26.1Z",
    term: "Traditional medicine disorders of Pitta",
    system: "ICD-11 TM2",
    description: "Disorders related to Pitta dosha in traditional medicine",
    namasteMapping: "NAM002.48",
    status: "current"
  },
  {
    code: "TM26.3Z",
    term: "Traditional medicine disorders of Kapha",
    system: "ICD-11 TM2",
    description: "Disorders related to Kapha dosha in traditional medicine",
    namasteMapping: "NAM003.67",
    status: "current"
  },
  {
    code: "26.A1.2",
    term: "Functional dyspepsia",
    system: "ICD-11 Biomedicine",
    description: "Chronic or recurrent pain in the upper abdomen",
    namasteMapping: "NAM004.12",
    status: "current"
  },
  {
    code: "26.A1.3",
    term: "Gastric motility disorders",
    system: "ICD-11 Biomedicine",
    description: "Disorders affecting stomach movement and digestion",
    namasteMapping: "NAM005.34",
    status: "current"
  },
  {
    code: "8D43.0Z",
    term: "Diseases of the nervous system",
    system: "ICD-11 Biomedicine",
    description: "Disorders affecting the central and peripheral nervous system",
    namasteMapping: "NAM006.89",
    status: "current"
  },
  {
    code: "CA20.Z",
    term: "Respiratory disorders",
    system: "ICD-11 Biomedicine",
    description: "Conditions affecting the respiratory system",
    namasteMapping: "NAM007.45",
    status: "current"
  },
  {
    code: "BD90.0",
    term: "Diseases of the circulatory system",
    system: "ICD-11 Biomedicine",
    description: "Disorders affecting blood circulation and vessels",
    namasteMapping: "NAM008.56",
    status: "current"
  },
  {
    code: "6A80.Z",
    term: "Mental and behavioural disorders",
    system: "ICD-11 Biomedicine",
    description: "Conditions affecting mental health and behavior",
    namasteMapping: "NAM009.23",
    status: "current"
  },
  {
    code: "FB83.Z",
    term: "Diseases of the musculoskeletal system",
    system: "ICD-11 Biomedicine",
    description: "Disorders affecting bones and skeletal structure",
    namasteMapping: "NAM010.78",
    status: "current"
  }
];

const CodeSearchInterface = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("namaste");
  const [namasteResults, setNamasteResults] = useState<NAMASTECode[]>([]);
  const [icdResults, setIcdResults] = useState<ICD11Code[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<(NAMASTECode | ICD11Code)[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const codeMappingService = CodeMappingService.getInstance();

  const searchMockData = <T extends NAMASTECode | ICD11Code>(query: string, dataSource: T[]) => {
    const searchTerm = query.toLowerCase();
    return dataSource.filter(item => 
      item.term.toLowerCase().includes(searchTerm) || 
      item.code.toLowerCase().includes(searchTerm) || 
      item.description.toLowerCase().includes(searchTerm)
    );
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      const searchResults = activeTab === "namaste"
        ? searchMockData(query, mockNamasteResults)
        : searchMockData(query, mockIcdResults);
      
      setSuggestions(searchResults.slice(0, 5));
    }, 300),
    [activeTab]
  );

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);

    try {
      const namasteMatches = searchMockData(searchTerm, mockNamasteResults);
      const icdMatches = searchMockData(searchTerm, mockIcdResults);
      
      setNamasteResults(namasteMatches);
      setIcdResults(icdMatches);

      if (activeTab === "namaste" && namasteMatches.length === 0) {
        toast({
          title: "No NAMASTE Results",
          description: `No NAMASTE codes found matching "${searchTerm}"`,
          variant: "default",
        });
      } else if (activeTab === "icd11" && icdMatches.length === 0) {
        toast({
          title: "No ICD-11 Results",
          description: `No ICD-11 codes found matching "${searchTerm}"`,
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search codes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
      setShowSuggestions(false);
    }
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
              <div className="flex flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Command className="rounded-lg border shadow-md">
                      <div className="flex items-center border-b px-3">
                        <Input
                          placeholder="Search medical terms, codes, or descriptions..."
                          value={searchTerm}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSearchTerm(value);
                            debouncedSearch(value);
                            setShowSuggestions(true);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSearch();
                              setShowSuggestions(false);
                            }
                            if (e.key === 'Escape') {
                              setShowSuggestions(false);
                            }
                          }}
                          className="pl-10 h-12 text-lg w-full border-0 bg-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute left-0 right-0 top-[calc(100%+8px)] bg-popover rounded-md border shadow-md z-50">
                          <CommandList>
                            <CommandGroup>
                              {suggestions.map((item) => (
                                <CommandItem
                                  key={item.code}
                                  onSelect={() => {
                                    setSearchTerm(item.term);
                                    setShowSuggestions(false);
                                    handleSearch();
                                  }}
                                  className="flex items-center px-4 py-2 hover:bg-accent cursor-pointer"
                                >
                                  <div className="flex items-center">
                                    <Badge className="mr-2">{item.code}</Badge>
                                    <span className="truncate">{item.term}</span>
                                    <span className="ml-2 text-xs text-muted-foreground">{item.system}</span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </div>
                      )}
                    </Command>
                  </div>
                </div>
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  size="lg"
                  className="medical-gradient shadow-medical whitespace-nowrap"
                >
                  {isSearching ? "Searching..." : "Search"}
                </Button>
                <CSVImport />
              </div>

              {/* Search Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="namaste">NAMASTE Codes</TabsTrigger>
                  <TabsTrigger value="icd11">ICD-11 Codes</TabsTrigger>
                </TabsList>

                <TabsContent value="namaste" className="mt-6">
                  <div className="space-y-4">
                    {namasteResults.length > 0 ? (
                      namasteResults.map((item, index) => (
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
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setActiveTab("icd11")}
                                  >
                                    <ArrowRight className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  copyToClipboard(item.code);
                                  toast({
                                    description: `Copied ${item.code} to clipboard`,
                                  });
                                }}
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
                        <p className="text-muted-foreground">No NAMASTE codes found for "{searchTerm}"</p>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">Search for NAMASTE codes and terminologies</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="icd11" className="mt-6">
                  <div className="space-y-4">
                    {icdResults.length > 0 ? (
                      icdResults.map((item, index) => (
                        <Card key={index} className="p-6 hover:shadow-medical transition-medical">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <Badge className="icd-code font-mono">
                                  {item.code}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {item.system}
                                </Badge>
                                <Badge variant="secondary" className={`status-${item.status === 'current' ? 'active' : 'pending'}`}>
                                  {item.status}
                                </Badge>
                              </div>
                              <h3 className="text-lg font-semibold text-foreground mb-2">
                                {item.term}
                              </h3>
                              <p className="text-muted-foreground mb-4">
                                {item.description}
                              </p>
                              {item.namasteMapping && (
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-muted-foreground">Maps to NAMASTE:</span>
                                  <Badge className="namaste-code font-mono">
                                    {item.namasteMapping}
                                  </Badge>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setActiveTab("namaste")}
                                  >
                                    <ArrowRight className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  copyToClipboard(item.code);
                                  toast({
                                    description: `Copied ${item.code} to clipboard`,
                                  });
                                }}
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
                        <p className="text-muted-foreground">No ICD-11 codes found for "{searchTerm}"</p>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">Search for ICD-11 codes and terminologies</p>
                      </div>
                    )}
                  </div>
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