export interface FHIRResource {
  resourceType: string;
  id?: string;
  meta?: {
    versionId?: string;
    lastUpdated?: string;
    profile?: string[];
  };
}

export interface CodeableConcept {
  coding: Array<{
    system: string;
    code: string;
    display?: string;
    version?: string;
  }>;
  text?: string;
}

export interface ConceptMap extends FHIRResource {
  resourceType: 'ConceptMap';
  url?: string;
  version?: string;
  name?: string;
  title?: string;
  status: 'draft' | 'active' | 'retired' | 'unknown';
  experimental?: boolean;
  date?: string;
  publisher?: string;
  contact?: Array<{
    name?: string;
    telecom?: Array<{
      system?: string;
      value?: string;
      use?: string;
    }>;
  }>;
  description?: string;
  useContext?: Array<{
    code: CodeableConcept;
    valueCodeableConcept?: CodeableConcept;
  }>;
  jurisdiction?: Array<CodeableConcept>;
  purpose?: string;
  copyright?: string;
  sourceUri?: string;
  sourceCanonical?: string;
  targetUri?: string;
  targetCanonical?: string;
  group: Array<{
    source?: string;
    sourceVersion?: string;
    target?: string;
    targetVersion?: string;
    element: Array<{
      code?: string;
      display?: string;
      target?: Array<{
        code?: string;
        display?: string;
        equivalence: 'equal' | 'equivalent' | 'wider' | 'subsumes' | 'narrower' | 'specializes' | 'inexact' | 'unmatched' | 'disjoint';
        comment?: string;
      }>;
    }>;
  }>;
}

export interface CodeSystem extends FHIRResource {
  resourceType: 'CodeSystem';
  url?: string;
  version?: string;
  name?: string;
  title?: string;
  status: 'draft' | 'active' | 'retired' | 'unknown';
  experimental?: boolean;
  date?: string;
  publisher?: string;
  description?: string;
  useContext?: Array<{
    code: CodeableConcept;
    valueCodeableConcept?: CodeableConcept;
  }>;
  jurisdiction?: Array<CodeableConcept>;
  purpose?: string;
  copyright?: string;
  caseSensitive?: boolean;
  valueSet?: string;
  hierarchyMeaning?: 'grouped-by' | 'is-a' | 'part-of' | 'classified-with';
  compositional?: boolean;
  versionNeeded?: boolean;
  content: 'not-present' | 'example' | 'fragment' | 'complete' | 'supplement';
  count?: number;
  concept?: Array<{
    code: string;
    display?: string;
    definition?: string;
    designation?: Array<{
      language?: string;
      use?: CodeableConcept;
      value: string;
    }>;
    property?: Array<{
      code: string;
      value: string | boolean | number | CodeableConcept;
    }>;
  }>;
}

export interface NAMASTECodeSystem extends CodeSystem {
  concept: Array<{
    code: string;
    display: string;
    definition?: string;
    designation?: Array<{
      language?: string;
      use?: CodeableConcept;
      value: string;
    }>;
    property: Array<{
      code: 'system' | 'status' | 'mappingStatus';
      value: string | boolean;
    }>;
  }>;
}