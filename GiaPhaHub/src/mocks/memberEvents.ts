export type MemberEventType =
  | "birth"
  | "marriage"
  | "education"
  | "career"
  | "achievement"
  | "memorial";

export interface MemberEventMock {
  id: number;
  memberId: number;
  type: MemberEventType;
  title: string;
  date: string;
  location?: string;
  note?: string;
  image?: string;
}

export const memberEventMocks: MemberEventMock[] = [
  {
    id: 1,
    memberId: 1,
    type: "birth",
    title: "Chao doi",
    date: "1948-06-15",
    location: "Nam Dinh",
    note: "Truong nam dong ho",
    image:
      "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    memberId: 1,
    type: "marriage",
    title: "Ket hon",
    date: "1970-10-22",
    location: "Nam Dinh",
  },
  {
    id: 3,
    memberId: 2,
    type: "birth",
    title: "Chao doi",
    date: "1950-04-03",
    location: "Ha Nam",
  },
  {
    id: 4,
    memberId: 3,
    type: "education",
    title: "Tot nghiep Dai hoc",
    date: "1995-07-08",
    location: "Ha Noi",
    note: "Chuyen nganh Cong nghe thong tin",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    memberId: 3,
    type: "career",
    title: "Nhan chuc truong phong",
    date: "2008-09-01",
    location: "Ha Noi",
  },
  {
    id: 6,
    memberId: 4,
    type: "marriage",
    title: "Le thanh hon",
    date: "2012-11-18",
    location: "Thai Binh",
  },
  {
    id: 7,
    memberId: 5,
    type: "achievement",
    title: "Nhan bang khen cap tinh",
    date: "2019-05-21",
    location: "Hai Phong",
    image:
      "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 8,
    memberId: 6,
    type: "education",
    title: "Bao ve luan van Thac si",
    date: "2021-12-11",
    location: "TP. Ho Chi Minh",
  },
  {
    id: 9,
    memberId: 7,
    type: "career",
    title: "Mo doanh nghiep gia dinh",
    date: "2023-03-15",
    location: "Da Nang",
  },
  {
    id: 10,
    memberId: 2,
    type: "memorial",
    title: "Ngay gio 10 nam",
    date: "2025-08-09",
    location: "Nha tho ho",
    note: "To chuc cung con chau day du",
    image:
      "https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 11,
    memberId: 4,
    type: "achievement",
    title: "Nhan danh hieu gia dinh van hoa",
    date: "2026-03-22",
    location: "Thai Binh",
  },
  {
    id: 12,
    memberId: 6,
    type: "career",
    title: "Khai truong chi nhanh moi",
    date: "2026-04-02",
    location: "TP. Ho Chi Minh",
  },
  {
    id: 13,
    memberId: 7,
    type: "education",
    title: "Nhan hoc bong nghien cuu",
    date: "2026-04-10",
    location: "Da Nang",
  },
];
