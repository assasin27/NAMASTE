import { ConceptMap, CodeSystem, NAMASTECodeSystem, CodeableConcept } from './models';

export class FHIRService {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async createConceptMap(conceptMap: ConceptMap): Promise<ConceptMap> {
    const response = await fetch(`${this.baseUrl}/ConceptMap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/fhir+json',
      },
      body: JSON.stringify(conceptMap),
    });

    if (!response.ok) {
      throw new Error('Failed to create ConceptMap');
    }

    return response.json();
  }

  async createCodeSystem(codeSystem: CodeSystem): Promise<CodeSystem> {
    const response = await fetch(`${this.baseUrl}/CodeSystem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/fhir+json',
      },
      body: JSON.stringify(codeSystem),
    });

    if (!response.ok) {
      throw new Error('Failed to create CodeSystem');
    }

    return response.json();
  }

  async translateCode(conceptMap: string, code: string, system: string): Promise<CodeableConcept[]> {
    const response = await fetch(`${this.baseUrl}/ConceptMap/$translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/fhir+json',
      },
      body: JSON.stringify({
        resourceType: 'Parameters',
        parameter: [
          {
            name: 'url',
            valueUri: conceptMap,
          },
          {
            name: 'code',
            valueCode: code,
          },
          {
            name: 'system',
            valueUri: system,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('Code translation failed');
    }

    const result = await response.json();
    return result.parameter.find(p => p.name === 'match')?.part
      .filter(p => p.name === 'concept')
      .map(p => p.valueCoding);
  }

  async importFromCSV(csvData: string): Promise<{ 
    codeSystem: NAMASTECodeSystem, 
    conceptMap: ConceptMap 
  }> {
    // Parse CSV and create NAMASTE CodeSystem and ConceptMap
    const codes = csvData.split('\\n').slice(1).map(line => {
      const [code, term, system, icdMapping] = line.split(',');
      return {
        code: code.trim(),
        display: term.trim(),
        system: system.trim(),
        icdMapping: icdMapping?.trim(),
      };
    });

    // Create CodeSystem
    const codeSystem: NAMASTECodeSystem = {
      resourceType: 'CodeSystem',
      status: 'active',
      content: 'complete',
      name: 'NAMASTE',
      title: 'NAMASTE Traditional Medicine Coding System',
      concept: codes.map(code => ({
        code: code.code,
        display: code.display,
        property: [
          {
            code: 'system',
            value: code.system,
          },
          {
            code: 'status',
            value: 'active',
          },
          {
            code: 'mappingStatus',
            value: code.icdMapping ? 'mapped' : 'unmapped',
          },
        ],
      })),
    };

    // Create ConceptMap
    const conceptMap: ConceptMap = {
      resourceType: 'ConceptMap',
      status: 'active',
      name: 'NAMASTE-ICD11-Map',
      title: 'NAMASTE to ICD-11 Mapping',
      sourceUri: 'http://namaste.health/codesystem',
      targetUri: 'http://id.who.int/icd11/mms',
      group: [
        {
          source: 'http://namaste.health/codesystem',
          target: 'http://id.who.int/icd11/mms',
          element: codes
            .filter(code => code.icdMapping)
            .map(code => ({
              code: code.code,
              display: code.display,
              target: [
                {
                  code: code.icdMapping,
                  equivalence: 'equivalent',
                },
              ],
            })),
        },
      ],
    };

    const createdCodeSystem = await this.createCodeSystem(codeSystem);
    const createdConceptMap = await this.createConceptMap(conceptMap);

    return {
      codeSystem: createdCodeSystem,
      conceptMap: createdConceptMap,
    };
  }
}