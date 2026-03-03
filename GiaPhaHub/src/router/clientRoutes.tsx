import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import Layout from "@/components/layout";
import LazyComponent from "./LazyComponent";

const Homepage = lazy(() => import("@/pages/Homepage"));
const Members = lazy(() => import("@/pages/Member"));
const FamilyTree = lazy(() => import("@/pages/FamilyTree/Tree"));
const FamilyGrid = lazy(() => import("@/pages/FamilyTree/Grid"));
const HorizontalFamilyTree = lazy(
  () => import("@/pages/FamilyTree/HorizontalTree"),
);
const MemberDetail = lazy(() => import("@/pages/Member/MemberDetail"));
export const clientRoutes: RouteObject[] = [
  { path: "/", element: <LazyComponent component={Homepage} /> },
  {
    path: "/family-tree/:familyId",
    element: <Layout />,
    children: [
      { path: "members", element: <LazyComponent component={Members} /> },
      {
        path: "members/:id",
        element: <LazyComponent component={MemberDetail} />,
      },
      { path: "tree", element: <LazyComponent component={FamilyTree} /> },
      { path: "grid", element: <LazyComponent component={FamilyGrid} /> },
      {
        path: "htree",
        element: <LazyComponent component={HorizontalFamilyTree} />,
      },
    ],
  },
];
