import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import WorkDetail from "../pages/WorkDetail";
import Admin from "../pages/Admin";
import CreditScoreDemo from "../pages/CreditScoreDemo";
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
