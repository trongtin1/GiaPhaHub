export const DEFAULT_FAMILY_ID = "1";

export const paths = {
  home: "/",
  dashboard: (familyId = DEFAULT_FAMILY_ID) => `/family-tree/${familyId}/dashboard`,
  tree:      (familyId = DEFAULT_FAMILY_ID) => `/family-tree/${familyId}/tree`,
  grid:      (familyId = DEFAULT_FAMILY_ID) => `/family-tree/${familyId}/grid`,
  htree:     (familyId = DEFAULT_FAMILY_ID) => `/family-tree/${familyId}/htree`,
  members:   (familyId = DEFAULT_FAMILY_ID) => `/family-tree/${familyId}/members`,
  member:    (familyId = DEFAULT_FAMILY_ID, memberId: string) =>
    `/family-tree/${familyId}/members/${memberId}`,
};
