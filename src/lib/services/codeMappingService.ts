// Service for managing code mappings and searches
import { FHIRService } from '@/lib/fhir/service';
import { ICD11API } from '@/lib/icd11/api';
import { ConceptMap, CodeSystem } from '@/lib/fhir/models';

export class CodeMappingService {
  private static instance: CodeMappingService;
  private fhirService: FHIRService;
  private icd11Api: ICD11API;
  private conceptMap: ConceptMap | null = null;
  private codeSystem: CodeSystem | null = null;

  private constructor() {
    this.fhirService = new FHIRService('http://localhost:5000/api/fhir');
    this.icd11Api = new ICD11API();
  }

  static getInstance(): CodeMappingService {
    if (!CodeMappingService.instance) {
      CodeMappingService.instance = new CodeMappingService();
    }
    return CodeMappingService.instance;
  }

  async searchNAMASTECodes(query: string): Promise<any[]> {
    // Search in local CodeSystem first
    if (this.codeSystem) {
      const results = this.codeSystem.concept?.filter(concept => 
        concept.code.toLowerCase().includes(query.toLowerCase()) ||
        concept.display?.toLowerCase().includes(query.toLowerCase())
      ) || [];

      return results.map(concept => ({
        code: concept.code,
        term: concept.display,
        system: 'NAMASTE',
        description: concept.definition,
        status: concept.property?.find(p => p.code === 'status')?.value || 'active',
      }));
    }

    return [];
  }

  async searchICD11Codes(query: string): Promise<any[]> {
    try {
      const results = await this.icd11Api.searchTerm(query);
      return results.map(result => ({
        code: result.id,
        term: result.title['@value'],
        system: 'ICD-11',
        description: result.definition?.['@value'],
        status: 'active',
      }));
    } catch (error) {
      console.error('ICD-11 search error:', error);
      return [];
    }
  }

  async getMappedCode(code: string, sourceSystem: string): Promise<any | null> {
    if (!this.conceptMap) {
      return null;
    }

    try {
      const mappings = await this.fhirService.translateCode(
        this.conceptMap.url || '',
        code,
        sourceSystem === 'NAMASTE' ? 'http://namaste.health/codesystem' : 'http://id.who.int/icd11/mms'
      );

      return mappings[0];
    } catch (error) {
      console.error('Code mapping error:', error);
      return null;
    }
  }

  async importCodes(csvData: string): Promise<void> {
    const { codeSystem, conceptMap } = await this.fhirService.importFromCSV(csvData);
    this.codeSystem = codeSystem;
    this.conceptMap = conceptMap;
  }
}