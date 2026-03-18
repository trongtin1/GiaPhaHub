export const DEFAULT_FAMILY_ID = "1";

export const paths = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: (familyId = DEFAULT_FAMILY_ID) =>
    `/family-tree/${familyId}/dashboard`,
  tree: (familyId = DEFAULT_FAMILY_ID) => `/family-tree/${familyId}/tree`,
  grid: (familyId = DEFAULT_FAMILY_ID) => `/family-tree/${familyId}/grid`,
  htree: (familyId = DEFAULT_FAMILY_ID) => `/family-tree/${familyId}/htree`,
  events: (familyId = DEFAULT_FAMILY_ID) => `/family-tree/${familyId}/events`,
  gallery: (familyId = DEFAULT_FAMILY_ID) => `/family-tree/${familyId}/gallery`,
  dnaPrediction: (familyId = DEFAULT_FAMILY_ID) =>
    `/family-tree/${familyId}/dna-prediction`,
  members: (familyId = DEFAULT_FAMILY_ID) => `/family-tree/${familyId}/members`,
  member: (familyId = DEFAULT_FAMILY_ID, memberId: number | string) =>
    `/family-tree/${familyId}/members/${memberId}`,
};
