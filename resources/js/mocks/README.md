# Mocks des données géographiques de la Guinée

Ce dossier contient les données mockées pour les structures géographiques administratives de la Guinée : régions, préfectures, communes et quartiers.

## Structure

- `regions.ts` - Liste des 8 régions administratives
- `prefectures.ts` - Liste des 35 préfectures
- `communes-quartiers.ts` - Liste des communes et quartiers (avec focus sur Conakry)
- `index.ts` - Point d'entrée centralisé avec fonctions utilitaires

## Utilisation

### Import des données

```typescript
import {
  getAllRegions,
  getPrefecturesByRegion,
  getCommunesByPrefecture,
  getQuartiersByCommune,
  localisationData,
} from '@/data/mocks';
```

### Exemples d'utilisation

#### Obtenir toutes les régions

```typescript
const regions = getAllRegions();
// Retourne: Array<Region>
```

#### Obtenir les préfectures d'une région

```typescript
const prefectures = getPrefecturesByRegion('1'); // Région de Conakry
// Retourne: Array<Prefecture>
```

#### Obtenir les communes d'une préfecture

```typescript
const communes = getCommunesByPrefecture('10'); // Conakry
// Retourne: Array<Commune>
```

#### Obtenir les quartiers d'une commune

```typescript
const quartiers = getQuartiersByCommune('100'); // Dixinn
// Retourne: Array<Quartier>
```

#### Obtenir une structure complète de localisation

```typescript
import { getLocalisationByRegion } from '@/data/mocks';

const localisation = getLocalisationByRegion('1');
// Retourne: {
//   region: Region,
//   prefectures: Prefecture[],
//   communes: Commune[],
//   quartiers: Quartier[]
// }
```

#### Recherche par nom

```typescript
import { searchRegionByName, searchPrefectureByName } from '@/data/mocks';

const region = searchRegionByName('Conakry');
const prefecture = searchPrefectureByName('Kindia');
```

## Types

Tous les types sont définis dans `@/types/geographie`:

- `Region` - Région administrative
- `Prefecture` - Préfecture
- `Commune` - Commune
- `Quartier` - Quartier/Secteur

## Données disponibles

### Régions (8)
- Région de Conakry
- Région de Boké
- Région de Faranah
- Région de Kankan
- Région de Kindia
- Région de Labé
- Région de Mamou
- Région de Nzérékoré

### Préfectures (35)
Toutes les préfectures des 8 régions sont incluses.

### Communes et Quartiers
Les données sont complètes pour Conakry (10 communes, nombreux quartiers).
Pour les autres régions, les principales communes et quartiers urbains sont inclus.

## Notes

- Les données sont basées sur les fichiers CSV fournis dans le dossier `data/`
- Les identifiants suivent la structure hiérarchique (région → préfecture → commune → quartier)
- Les codes sont normalisés en majuscules
- Les zones immobilières (ZoneImmo) sont incluses pour Conakry

