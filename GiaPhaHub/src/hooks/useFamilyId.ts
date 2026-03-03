import { useParams } from "react-router-dom";
import { DEFAULT_FAMILY_ID } from "@/router/paths";

export function useFamilyId(): string {
  const { familyId } = useParams<{ familyId: string }>();
  return familyId ?? DEFAULT_FAMILY_ID;
}
