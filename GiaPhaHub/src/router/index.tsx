import React from "react";
import { useRoutes } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { clientRoutes } from "./clientRoutes";
import NotFound from "@/pages/NotFound";

const AppRoutes: React.FC = () => {
  return useRoutes([
    ...clientRoutes,
    {
      path: "*",
      element: <NotFound />,
    },
  ] as RouteObject[]);
};

export default AppRoutes;
