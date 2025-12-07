// Types pour les structures géographiques de la Guinée

export interface Region {
  id: string;
  nom: string;
  code: string;
  numero: number;
}

export interface Prefecture {
  id: string;
  nom: string;
  code: string;
  regionId: string;
  regionNom: string;
  numero: number;
  numeroRegion: number;
  dipCode?: string;
  dipNom?: string;
}

export interface Commune {
  id: string;
  nom: string;
  code: string;
  prefectureId: string;
  prefectureNom: string;
  regionId: string;
  regionNom: string;
  numero: number;
  zoneImmo?: string;
}

export interface Quartier {
  id: string;
  nom: string;
  code: string;
  communeId: string;
  communeNom: string;
  prefectureId: string;
  prefectureNom: string;
  regionId: string;
  regionNom: string;
  type: 'Quartier' | 'Urbaine' | 'Rurale';
  numero: number;
  zoneImmo?: string;
}

export interface LocalisationData {
  regions: Region[];
  prefectures: Prefecture[];
  communes: Commune[];
  quartiers: Quartier[];
}

