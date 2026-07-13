import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import WorkDetail from "../pages/WorkDetail";
import Admin from "../pages/Admin";
import CreditScoreDemo from "../pages/CreditScoreDemo";
import MetaPresentation from "../pages/MetaPresentation";
import AdditionalProjectDetail from "../pages/AdditionalProjectDetail";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/work/branch/credit-score",
    Component: CreditScoreDemo,
  },
  {
    path: "/work/meta/presentation",
    Component: MetaPresentation,
  },
  {
    path: "/work/additional-projects/:slug",
    Component: AdditionalProjectDetail,
  },
  {
    path: "/work/:slug",
    Component: WorkDetail,
  },
  {
    path: "/admin",
    Component: Admin,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
