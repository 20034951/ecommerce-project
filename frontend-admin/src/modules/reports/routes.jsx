import React from "react";
import { Navigate } from "react-router-dom";
import ReportsPage from "./pages/ReportsPage";

export const reportsRoutes = [
  {
    path: "/reports",
    element: <ReportsPage />,
  },
];

export default reportsRoutes;
