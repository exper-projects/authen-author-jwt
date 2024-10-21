import * as React from "react";

import { Toast } from "@usy-ui/base";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@usy-ui/base/dist/styles.css";

import { Dashboard } from "./pages/dashboard";
import { SignIn } from "./pages/sign-in";
import { SignUp } from "./pages/sign-up";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "*",
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toast />
    <RouterProvider router={router} />
  </React.StrictMode>
);
