import { createBrowserRouter } from "react-router-dom";
import FormGame from "../pages/FormGame";
import SearchDocument from "../pages/SearchDocument";
import { RoutersLink } from "../constants";
import Register from "../pages/Register";

const router = createBrowserRouter([
  {
    path: RoutersLink.INDEX,
    element: <SearchDocument />
  },
  {
    path: RoutersLink.FORM,
    element: <FormGame />
  },
  {
    path: "/registros",
    element: <Register />
  },
]);

export default router;