import { useEffect, useMemo, useState } from "react";
import { FamilyService } from "@/services/familyService";
import { useFamilyId } from "@/hooks/useFamilyId";
import type { FamilyMemberResponse } from "@/models/FamilyMember";

interface FamilyTreeState {
  root: FamilyMemberResponse | null;
  members: FamilyMemberResponse[];
  selectedRootId: number | null;
  loading: boolean;
  error: string | null;
  setSelectedRootId: (id: number) => void;
  getMemberById: (id: number) => FamilyMemberResponse | undefined;
  getChildren: (member: FamilyMemberResponse) => FamilyMemberResponse[];
  getSpouse: (member: FamilyMemberResponse) => FamilyMemberResponse | undefined;
  getRootMembers: () => FamilyMemberResponse[];
}

function normalizeMembersMap(
  root: FamilyMemberResponse,
): Map<number, FamilyMemberResponse> {
  const map = new Map<number, FamilyMemberResponse>();
  map.set(root.id, root);

  if (Array.isArray(root.members)) {
    root.members.forEach((member) => map.set(member.id, member));
    return map;
  }

  Object.values(root.members ?? {}).forEach((member) => {
    map.set(member.id, member);
  });

  return map;
}

export function useFamilyTree(): FamilyTreeState {
  const familyId = useFamilyId();
  const [root, setRoot] = useState<FamilyMemberResponse | null>(null);
  const [selectedRootId, setSelectedRootIdState] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const routeRootId = Number(familyId);

    if (!Number.isFinite(routeRootId) || routeRootId <= 0) {
      setSelectedRootIdState(null);
      setRoot(null);
      setError("ID thành viên gốc không hợp lệ.");
      setLoading(false);
      return;
    }

    setSelectedRootIdState(routeRootId);
  }, [familyId]);

  useEffect(() => {
    const rootId = selectedRootId;

    if (!rootId || rootId <= 0) {
      setRoot(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadTree = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await FamilyService.getTree(rootId);

        if (!cancelled) {
          setRoot(res.data);
        }
      } catch (err) {
        if (!cancelled) {
          const fallback = "Không tải được cây gia phả.";
          const message =
            typeof err === "object" &&
            err !== null &&
            "message" in err &&
            typeof (err as { message?: unknown }).message === "string"
              ? (err as { message: string }).message
              : fallback;

          setRoot(null);
          setError(message || fallback);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadTree();

    return () => {
      cancelled = true;
    };
  }, [selectedRootId]);

  const memberMap = useMemo(() => {
    if (!root) {
      return new Map<number, FamilyMemberResponse>();
    }

    return normalizeMembersMap(root);
  }, [root]);

  const members = useMemo(() => {
    return [...memberMap.values()].sort((a, b) => {
      if (a.generation !== b.generation) {
        return a.generation - b.generation;
      }

      return a.id - b.id;
    });
  }, [memberMap]);

  const getMemberById = (id: number) => memberMap.get(id);

  const getChildren = (member: FamilyMemberResponse) =>
    (member.children ?? [])
      .map((childId) => memberMap.get(childId))
      .filter((item): item is FamilyMemberResponse => !!item);

  const getSpouse = (member: FamilyMemberResponse) => {
    const spouseId = (member.spouses ?? []).find((id) => memberMap.has(id));
    if (!spouseId) {
      return undefined;
    }

    return memberMap.get(spouseId);
  };

  const getRootMembers = () => (root ? [root] : []);

  const setSelectedRootId = (id: number) => {
    if (!Number.isFinite(id) || id <= 0) {
      return;
    }

    setSelectedRootIdState(id);
  };

  return {
    root,
    members,
    selectedRootId,
    loading,
    error,
    setSelectedRootId,
    getMemberById,
    getChildren,
    getSpouse,
    getRootMembers,
  };
}
