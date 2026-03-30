import { useCallback, useEffect, useMemo, useState } from "react";
import { FamilyService } from "@/services/familyService";
import { useFamilyId } from "@/hooks/useFamilyId";
import type { FamilyMemberResponse } from "@/models/FamilyMember";

export interface FamilyTreeState {
  root: FamilyMemberResponse | null;
  members: FamilyMemberResponse[];
  rootMembers: FamilyMemberResponse[];
  selectedRootId: number | null;
  loading: boolean;
  error: string | null;
  setSelectedRootId: (id: number) => void;
  getMemberById: (id: number) => FamilyMemberResponse | undefined;
  getChildren: (member: FamilyMemberResponse) => FamilyMemberResponse[];
  getSpouse: (member: FamilyMemberResponse) => FamilyMemberResponse | undefined;
}

export interface UseFamilyTreeOptions {
  generationLimit?: number;
  hideDau?: boolean;
  hideRe?: boolean;
  hideDaughters?: boolean;
  hideSons?: boolean;
  hideMale?: boolean;
  hideFemale?: boolean;
}

function normalizeMembersMap(
  root: FamilyMemberResponse,
): Map<number, FamilyMemberResponse> {
  const map = new Map<number, FamilyMemberResponse>();
  map.set(root.id, root);

  const list = Array.isArray(root.members)
    ? root.members
    : Object.values(root.members ?? {});

  list.forEach((member) => map.set(member.id, member));
  return map;
}

export function useFamilyTree(
  options: UseFamilyTreeOptions = {},
): FamilyTreeState {
  const familyId = useFamilyId();
  const [root, setRoot] = useState<FamilyMemberResponse | null>(null);
  const [selectedRootId, setSelectedRootIdState] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = Number(familyId);
    if (!Number.isFinite(id) || id <= 0) {
      setSelectedRootIdState(null);
      setRoot(null);
      setError("ID thành viên gốc không hợp lệ.");
      setLoading(false);
      return;
    }
    setSelectedRootIdState(id);
  }, [familyId]);

  useEffect(() => {
    if (!selectedRootId || selectedRootId <= 0) {
      setRoot(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await FamilyService.getTree(selectedRootId);
        if (!cancelled) setRoot(res.data);
      } catch (err) {
        if (!cancelled) {
          const msg =
            err instanceof Error ? err.message : "Không tải được cây gia phả.";
          setRoot(null);
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedRootId]);

  const memberMap = useMemo(
    () =>
      root
        ? normalizeMembersMap(root)
        : new Map<number, FamilyMemberResponse>(),
    [root],
  );

  const members = useMemo(
    () =>
      [...memberMap.values()].sort(
        (a, b) => a.generation - b.generation || a.id - b.id,
      ),
    [memberMap],
  );

  const rootMembers = useMemo(() => (root ? [root] : []), [root]);

  const normalizedGenerationLimit = useMemo(() => {
    if (!Number.isFinite(options.generationLimit))
      return Number.MAX_SAFE_INTEGER;
    return Math.max(1, Math.floor(options.generationLimit ?? 0));
  }, [options.generationLimit]);

  const depthByMemberId = useMemo(() => {
    const depthMap = new Map<number, number>();
    if (!root) return depthMap;

    const queue: Array<{ id: number; depth: number }> = [
      { id: root.id, depth: 1 },
    ];
    depthMap.set(root.id, 1);

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) continue;

      const member = memberMap.get(current.id);
      if (!member) continue;

      for (const childId of member.children ?? []) {
        if (!memberMap.has(childId)) continue;
        const nextDepth = current.depth + 1;
        const knownDepth = depthMap.get(childId);

        if (knownDepth === undefined || nextDepth < knownDepth) {
          depthMap.set(childId, nextDepth);
          queue.push({ id: childId, depth: nextDepth });
        }
      }
    }

    return depthMap;
  }, [memberMap, root]);

  const getMemberById = useCallback(
    (id: number) => memberMap.get(id),
    [memberMap],
  );

  const shouldHideSpouse = useCallback(
    (member: FamilyMemberResponse) => {
      const isMale = member.gender === "male";
      const isFemale = member.gender === "female";

      if (options.hideMale && isMale) return true;
      if (options.hideFemale && isFemale) return true;
      if (options.hideDau && isFemale) return true;
      if (options.hideRe && isMale) return true;

      return false;
    },
    [options.hideDau, options.hideFemale, options.hideMale, options.hideRe],
  );

  const shouldHideChild = useCallback(
    (member: FamilyMemberResponse) => {
      const isMale = member.gender === "male";
      const isFemale = member.gender === "female";

      if (options.hideMale && isMale) return true;
      if (options.hideFemale && isFemale) return true;
      if (options.hideSons && isMale) return true;
      if (options.hideDaughters && isFemale) return true;

      return false;
    },
    [
      options.hideDaughters,
      options.hideFemale,
      options.hideMale,
      options.hideSons,
    ],
  );

  const getChildren = useCallback(
    (member: FamilyMemberResponse) => {
      const currentDepth = depthByMemberId.get(member.id) ?? 1;
      if (currentDepth >= normalizedGenerationLimit) return [];

      return (member.children ?? [])
        .map((id) => memberMap.get(id))
        .filter((m): m is FamilyMemberResponse => {
          if (!m) return false;
          if (shouldHideChild(m)) return false;
          const childDepth = depthByMemberId.get(m.id) ?? currentDepth + 1;
          return childDepth <= normalizedGenerationLimit;
        });
    },
    [depthByMemberId, memberMap, normalizedGenerationLimit, shouldHideChild],
  );

  const getSpouse = useCallback(
    (member: FamilyMemberResponse) => {
      const spouseId = (member.spouses ?? []).find((id) => memberMap.has(id));
      if (!spouseId) return undefined;
      const spouse = memberMap.get(spouseId);
      if (!spouse || shouldHideSpouse(spouse)) return undefined;
      return spouse;
    },
    [memberMap, shouldHideSpouse],
  );

  const setSelectedRootId = useCallback((id: number) => {
    if (Number.isFinite(id) && id > 0) setSelectedRootIdState(id);
  }, []);

  return {
    root,
    members,
    rootMembers,
    selectedRootId,
    loading,
    error,
    setSelectedRootId,
    getMemberById,
    getChildren,
    getSpouse,
  };
}
