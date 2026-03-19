export interface FamilyPhotoItem {
  id: number;
  title: string;
  url: string;
  capturedAt: string;
  location?: string;
  memberIds: number[];
  tags: string[];
  description?: string;
}

export const familyPhotoMocks: FamilyPhotoItem[] = [
  {
    id: 1,
    title: "Anh dai gia dinh ngay Tet",
    url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80",
    capturedAt: "2024-02-10",
    location: "Ha Noi",
    memberIds: [1, 2, 3, 4, 6, 7],
    tags: ["tet", "sum-vay", "gia-dinh"],
    description: "Buc anh chung dau nam tai nha ong ba.",
  },
  {
    id: 2,
    title: "Le ky niem ngay cuoi ong ba",
    url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
    capturedAt: "2010-05-10",
    location: "TP Ho Chi Minh",
    memberIds: [1, 2, 3, 5],
    tags: ["ky-niem", "ong-ba"],
  },
  {
    id: 3,
    title: "Ngay gop mat nha tho ho",
    url: "https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&w=1200&q=80",
    capturedAt: "2025-08-09",
    location: "Nam Dinh",
    memberIds: [1, 2, 3, 5, 6, 7],
    tags: ["nha-tho", "gio-to", "truyen-thong"],
  },
  {
    id: 4,
    title: "Anh bao ve luan van",
    url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    capturedAt: "2021-12-11",
    location: "TP Ho Chi Minh",
    memberIds: [6],
    tags: ["hoc-tap", "thanh-tich"],
  },
  {
    id: 5,
    title: "Du lich gia dinh mua he",
    url: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=1200&q=80",
    capturedAt: "2022-06-18",
    location: "Vung Tau",
    memberIds: [3, 4, 7],
    tags: ["du-lich", "mua-he"],
  },
  {
    id: 6,
    title: "Sinh nhat chi Giang",
    url: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1200&q=80",
    capturedAt: "2024-09-25",
    location: "TP Ho Chi Minh",
    memberIds: [3, 4, 6, 7],
    tags: ["sinh-nhat", "gia-dinh"],
  },
];
