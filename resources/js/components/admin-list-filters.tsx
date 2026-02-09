import { router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterSelectConfig {
  type: 'select';
  name: string;
  label: string;
  placeholder?: string;
  options: FilterOption[];
}

export interface FilterSearchConfig {
  type: 'search';
  name: string;
  placeholder?: string;
}

export type FilterConfig = FilterSearchConfig | FilterSelectConfig;

export interface AdminListFiltersProps {
  /** URL de la page (sans query string) */
  baseUrl: string;
  /** Valeurs actuelles des filtres (venues du contrôleur) */
  filters: Record<string, string | undefined>;
  /** Configuration des champs (recherche + selects) */
  config: FilterConfig[];
  /** Délai en ms avant d'envoyer la recherche (debounce) */
  searchDebounceMs?: number;
  className?: string;
}

function isSearchConfig(c: FilterConfig): c is FilterSearchConfig {
  return c.type === 'search';
}

function isSelectConfig(c: FilterConfig): c is FilterSelectConfig {
  return c.type === 'select';
}

/**
 * Composant réutilisable : barre de recherche + filtres (select) pour les listes admin.
 * Envoie les paramètres au serveur via router.get (rechargement depuis le contrôleur).
 */
export function AdminListFilters({
  baseUrl,
  filters,
  config,
  searchDebounceMs = 300,
  className = '',
}: AdminListFiltersProps) {
  const searchConfig = config.find(isSearchConfig);
  const searchKey = searchConfig?.name ?? 'search';

  const serverSearch = filters[searchKey] ?? '';
  const [searchInput, setSearchInput] = useState(serverSearch);

  // Resync local search when filters from server change (e.g. after reset)
  useEffect(() => {
    const id = requestAnimationFrame(() => setSearchInput(serverSearch));
    return () => cancelAnimationFrame(id);
  }, [serverSearch]);

  const buildParams = useCallback(
    (overrides: Record<string, string | undefined>) => {
      const next: Record<string, string> = {};
      for (const key of Object.keys({ ...filters, ...overrides })) {
        const v = overrides[key] !== undefined ? overrides[key] : filters[key];
        if (v !== undefined && v !== '' && v !== 'all') {
          next[key] = v;
        }
      }
      return next;
    },
    [filters]
  );

  const applyFilters = useCallback(
    (overrides: Record<string, string | undefined>) => {
      const params = buildParams(overrides);
      router.get(baseUrl, params, {
        preserveState: true,
        preserveScroll: true,
      });
    },
    [baseUrl, buildParams]
  );

  const isMounted = useRef(false);
  // Debounced search (skip first mount to avoid duplicate request)
  useEffect(() => {
    if (!searchConfig) return;
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const t = setTimeout(() => {
      applyFilters({ [searchKey]: searchInput.trim() || undefined });
    }, searchDebounceMs);
    return () => clearTimeout(t);
  }, [searchInput, searchDebounceMs, searchKey, applyFilters, searchConfig]);

  const handleSelectChange = useCallback(
    (name: string, value: string) => {
      applyFilters({ [name]: value === 'all' ? undefined : value });
    },
    [applyFilters]
  );

  const hasActiveFilters =
    (searchInput?.trim()?.length ?? 0) > 0 ||
    Object.entries(filters).some(([k, v]) => k !== searchKey && v && v !== 'all');

  const handleReset = useCallback(() => {
    setSearchInput('');
    router.get(baseUrl, {}, { preserveState: true, preserveScroll: true });
  }, [baseUrl]);

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {searchConfig && (
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={searchConfig.placeholder ?? 'Rechercher…'}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
            autoComplete="off"
          />
        </div>
      )}
      {config.filter(isSelectConfig).map((select) => (
        <Select
          key={select.name}
          value={filters[select.name] ?? 'all'}
          onValueChange={(value) => handleSelectChange(select.name, value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={select.placeholder ?? select.label} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{select.placeholder ?? `Tous`}</SelectItem>
            {select.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
      {hasActiveFilters && (
        <Button type="button" variant="ghost" size="sm" onClick={handleReset} className="shrink-0">
          <X className="mr-1 h-4 w-4" />
          Réinitialiser
        </Button>
      )}
    </div>
  );
}
