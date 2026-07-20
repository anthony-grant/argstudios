import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { homeHero } from "./data";

export default function App() {
  useEffect(() => {
    if (homeHero.siteTitle) document.title = homeHero.siteTitle;
  }, []);

  return <RouterProvider router={router} />;
}
