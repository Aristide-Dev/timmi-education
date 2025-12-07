// Point d'entrée centralisé pour accéder aux données géographiques de la Guinée
import type { Commune, LocalisationData, Prefecture, Quartier, Region } from '@/types';
import {
    communes,
    getAllCommunes,
    getAllQuartiers,
    getCommuneById,
    getCommunesByPrefecture,
    getCommunesByRegion,
    getQuartierById,
    getQuartiersByCommune,
    getQuartiersByPrefecture,
    quartiers,
} from './communes-quartiers';
import { getAllPrefectures, getPrefectureById, getPrefecturesByRegion, prefectures } from './prefectures';
import { getAllRegions, getRegionByCode, getRegionById, regions } from './regions';

// Export de toutes les données
export const localisationData: LocalisationData = {
  regions,
  prefectures,
  communes,
  quartiers,
};

// Fonctions utilitaires pour obtenir des données hiérarchiques

/**
 * Obtient toutes les préfectures d'une région
 */
export function getPrefecturesForRegion(regionId: string): Prefecture[] {
  return getPrefecturesByRegion(regionId);
}

/**
 * Obtient toutes les communes d'une préfecture
 */
export function getCommunesForPrefecture(prefectureId: string): Commune[] {
  return getCommunesByPrefecture(prefectureId);
}

/**
 * Obtient toutes les communes d'une région
 */
export function getCommunesForRegion(regionId: string): Commune[] {
  return getCommunesByRegion(regionId);
}

/**
 * Obtient tous les quartiers d'une commune
 */
export function getQuartiersForCommune(communeId: string): Quartier[] {
  return getQuartiersByCommune(communeId);
}

/**
 * Obtient tous les quartiers d'une préfecture
 */
export function getQuartiersForPrefecture(prefectureId: string): Quartier[] {
  return getQuartiersByPrefecture(prefectureId);
}

/**
 * Obtient une structure complète de localisation à partir d'une région
 */
export function getLocalisationByRegion(regionId: string) {
  const region = getRegionById(regionId);
  if (!region) return null;

  const prefectures = getPrefecturesForRegion(regionId);
  const communes = prefectures.flatMap(p => getCommunesForPrefecture(p.id));
  const quartiers = communes.flatMap(c => getQuartiersForCommune(c.id));

  return {
    region,
    prefectures,
    communes,
    quartiers,
  };
}

/**
 * Obtient une structure complète de localisation à partir d'une préfecture
 */
export function getLocalisationByPrefecture(prefectureId: string) {
  const prefecture = getPrefectureById(prefectureId);
  if (!prefecture) return null;

  const region = getRegionById(prefecture.regionId);
  const communes = getCommunesForPrefecture(prefectureId);
  const quartiers = communes.flatMap(c => getQuartiersForCommune(c.id));

  return {
    region,
    prefecture,
    communes,
    quartiers,
  };
}

/**
 * Obtient une structure complète de localisation à partir d'une commune
 */
export function getLocalisationByCommune(communeId: string) {
  const commune = getCommuneById(communeId);
  if (!commune) return null;

  const prefecture = getPrefectureById(commune.prefectureId);
  const region = prefecture ? getRegionById(prefecture.regionId) : undefined;
  const quartiers = getQuartiersForCommune(communeId);

  return {
    region,
    prefecture,
    commune,
    quartiers,
  };
}

/**
 * Recherche une région par nom (insensible à la casse)
 */
export function searchRegionByName(nom: string): Region | undefined {
  const searchTerm = nom.toLowerCase().trim();
  return regions.find(r => r.nom.toLowerCase().includes(searchTerm));
}

/**
 * Recherche une préfecture par nom (insensible à la casse)
 */
export function searchPrefectureByName(nom: string): Prefecture | undefined {
  const searchTerm = nom.toLowerCase().trim();
  return prefectures.find(p => p.nom.toLowerCase().includes(searchTerm));
}

/**
 * Recherche une commune par nom (insensible à la casse)
 */
export function searchCommuneByName(nom: string): Commune | undefined {
  const searchTerm = nom.toLowerCase().trim();
  return communes.find(c => c.nom.toLowerCase().includes(searchTerm));
}

/**
 * Recherche un quartier par nom (insensible à la casse)
 */
export function searchQuartierByName(nom: string): Quartier | undefined {
  const searchTerm = nom.toLowerCase().trim();
  return quartiers.find(q => q.nom.toLowerCase().includes(searchTerm));
}

// Exports de toutes les fonctions utilitaires
export {

    // Communes
    getAllCommunes,
    // Préfectures
    getAllPrefectures,
    // Quartiers
    getAllQuartiers,
    // Régions
    getAllRegions, getCommuneById,
    getCommunesByPrefecture, getCommunesByRegion,
    getPrefectureById,
    getPrefecturesByRegion, getQuartierById,
    getQuartiersByCommune,
    getQuartiersByPrefecture, getRegionByCode, getRegionById
};

// Exports des types
    export type { Commune, LocalisationData, Prefecture, Quartier, Region };

