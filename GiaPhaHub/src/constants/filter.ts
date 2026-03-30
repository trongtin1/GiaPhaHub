type DisplayFilterKey =
  | "minimalMode"
  | "hideCollapseToggle"
  | "showMiniMap"
  | "showBackground";

type DataFilterKey =
  | "hideDau"
  | "hideRe"
  | "hideDaughters"
  | "hideSons"
  | "hideMale"
  | "hideFemale";

export const DISPLAY_FILTER_ITEMS: Array<{
  key: DisplayFilterKey;
  label: string;
}> = [
  { key: "minimalMode", label: "Tối giản" },
  { key: "hideCollapseToggle", label: "Ẩn nút đóng/mở" },
  { key: "showMiniMap", label: "Hiện bản đồ thu nhỏ" },
  { key: "showBackground", label: "Hiện nền chấm" },
];

export const DATA_FILTER_ITEMS: Array<{ key: DataFilterKey; label: string }> = [
  { key: "hideDau", label: "Ẩn dâu" },
  { key: "hideRe", label: "Ẩn rể" },
  { key: "hideDaughters", label: "Ẩn con gái" },
  { key: "hideSons", label: "Ẩn con trai" },
  { key: "hideMale", label: "Ẩn nam" },
  { key: "hideFemale", label: "Ẩn nữ" },
];
