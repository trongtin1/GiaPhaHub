import type { TreeLayoutOptions } from "@/pages/FamilyTree/Tree/useTreeLayout";
import type { UseFamilyTreeOptions } from "@/pages/FamilyTree/useFamilyTree";

export interface DiagramFilters {
  minimalMode: boolean;
  hideCollapseToggle: boolean;
  showMiniMap: boolean;
  showBackground: boolean;
  generationLimit: number | null;
  hideDau: boolean;
  hideRe: boolean;
  hideDaughters: boolean;
  hideSons: boolean;
  hideMale: boolean;
  hideFemale: boolean;
}

export const DEFAULT_DIAGRAM_FILTERS: DiagramFilters = {
  minimalMode: false,
  hideCollapseToggle: false,
  showMiniMap: false,
  showBackground: true,
  generationLimit: null,
  hideDau: false,
  hideRe: false,
  hideDaughters: false,
  hideSons: false,
  hideMale: false,
  hideFemale: false,
};

export function toFamilyTreeDataFilters(
  filters: DiagramFilters,
): UseFamilyTreeOptions {
  return {
    generationLimit: filters.generationLimit ?? undefined,
    hideDau: filters.hideDau,
    hideRe: filters.hideRe,
    hideDaughters: filters.hideDaughters,
    hideSons: filters.hideSons,
    hideMale: filters.hideMale,
    hideFemale: filters.hideFemale,
  };
}

export function toTreeLayoutOptions(
  filters: DiagramFilters,
): TreeLayoutOptions {
  return {
    showHandles: !filters.minimalMode,
    showCollapseToggle: !filters.hideCollapseToggle,
  };
}
