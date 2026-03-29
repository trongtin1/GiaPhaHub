import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import Layout from "@/components/layout";
import LazyComponent from "./LazyComponent";
import ProtectedRoute from "./ProtectedRoute";
import { FamilyProvider } from "@/context/FamilyContext";

const Homepage = lazy(() => import("@/pages/Homepage"));
const LoginPage = lazy(() => import("@/pages/Auth/Login"));
const RegisterPage = lazy(() => import("@/pages/Auth/Register"));
const Members = lazy(() => import("@/pages/Member"));
const FamilyTree = lazy(() => import("@/pages/FamilyTree/Tree"));
const FamilyGrid = lazy(() => import("@/pages/FamilyTree/Grid/Vertical"));
const HorizontalFamilyTree = lazy(
  () => import("@/pages/FamilyTree/Grid/Horizontal"),
);
const EventsPage = lazy(() => import("@/pages/Event"));
const PhotoLibraryPage = lazy(() => import("@/pages/Gallery"));
const MemberDetail = lazy(
  () => import("@/pages/Member/MemberDetail/MemberDetail"),
);
const DnaPredictionPage = lazy(() => import("@/pages/DnaPrediction"));
export const clientRoutes: RouteObject[] = [
  { path: "/", element: <Homepage /> },
  { path: "/login", element: <LazyComponent component={LoginPage} /> },
  { path: "/register", element: <LazyComponent component={RegisterPage} /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/family-tree/:familyId",
        element: (
          <FamilyProvider>
            <Layout />
          </FamilyProvider>
        ),
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
          { path: "events", element: <LazyComponent component={EventsPage} /> },
          {
            path: "dna-prediction",
            element: <LazyComponent component={DnaPredictionPage} />,
          },
          {
            path: "gallery",
            element: <LazyComponent component={PhotoLibraryPage} />,
          },
        ],
      },
    ],
  },
];
