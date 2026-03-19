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
    date: "1940-05-10",
    location: "TP Ho Chi Minh",
    note: "Nguoi sang lap gia pha",
    image:
      "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    memberId: 1,
    type: "marriage",
    title: "Ket hon",
    date: "1964-08-20",
    location: "TP Ho Chi Minh",
  },
  {
    id: 3,
    memberId: 2,
    type: "birth",
    title: "Chao doi",
    date: "1943-08-15",
    location: "TP Ho Chi Minh",
  },
  {
    id: 4,
    memberId: 3,
    type: "education",
    title: "Hoan thanh chung chi su pham",
    date: "1988-07-08",
    location: "TP Ho Chi Minh",
    note: "Nang cao ky nang giang day va quan ly",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    memberId: 3,
    type: "career",
    title: "Moc nghe nghiep quan trong",
    date: "2008-09-01",
    location: "TP Ho Chi Minh",
  },
  {
    id: 6,
    memberId: 4,
    type: "marriage",
    title: "Le thanh hon",
    date: "1989-11-18",
    location: "TP Ho Chi Minh",
  },
  {
    id: 7,
    memberId: 5,
    type: "achievement",
    title: "Thanh tich cong tac noi bat",
    date: "2019-05-21",
    location: "TP Ho Chi Minh",
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
    title: "Bat dau cong viec chuyen mon",
    date: "2023-03-15",
    location: "TP Ho Chi Minh",
  },
  {
    id: 10,
    memberId: 1,
    type: "memorial",
    title: "Ngay gio ong An",
    date: "2025-03-20",
    location: "Nha tho ho",
    note: "Con chau sum hop tuong nho",
    image:
      "https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 11,
    memberId: 4,
    type: "achievement",
    title: "Hoat dong gia dinh noi bat",
    date: "2026-03-22",
    location: "TP Ho Chi Minh",
  },
  {
    id: 12,
    memberId: 6,
    type: "career",
    title: "Dam nhiem vai tro moi",
    date: "2026-04-02",
    location: "TP. Ho Chi Minh",
  },
  {
    id: 13,
    memberId: 7,
    type: "education",
    title: "Hoan thanh khoa hoc nang cao",
    date: "2026-04-10",
    location: "TP Ho Chi Minh",
  },
];
