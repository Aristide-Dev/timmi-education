// Mocks pour les régions administratives de la Guinée
import type { Region } from '@/types';

export const regions: Region[] = [
  {
    id: '1',
    nom: 'Région de Conakry',
    code: 'GN-C',
    numero: 1,
  },
  {
    id: '2',
    nom: 'Région de Boké',
    code: 'GN-B',
    numero: 2,
  },
  {
    id: '3',
    nom: 'Région de Faranah',
    code: 'GN-F',
    numero: 3,
  },
  {
    id: '4',
    nom: 'Région de Kankan',
    code: 'GN-K',
    numero: 4,
  },
  {
    id: '5',
    nom: 'Région de Kindia',
    code: 'GN-D',
    numero: 5,
  },
  {
    id: '6',
    nom: 'Région de Labé',
    code: 'GN-L',
    numero: 6,
  },
  {
    id: '7',
    nom: 'Région de Mamou',
    code: 'GN-M',
    numero: 7,
  },
  {
    id: '8',
    nom: 'Région de Nzérékoré',
    code: 'GN-N',
    numero: 8,
  },
];

// Fonction utilitaire pour obtenir une région par son ID
export function getRegionById(id: string): Region | undefined {
  return regions.find(r => r.id === id);
}

// Fonction utilitaire pour obtenir une région par son code
export function getRegionByCode(code: string): Region | undefined {
  return regions.find(r => r.code === code);
}

// Fonction utilitaire pour obtenir toutes les régions
export function getAllRegions(): Region[] {
  return regions;
}

