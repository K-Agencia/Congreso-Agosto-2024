import { createBrowserRouter } from "react-router-dom";
import FormGame from "../pages/FormGame";
import SearchDocument from "../pages/SearchDocument";
import { RoutersLink } from "../constants";
import Games from "../pages/Games";
import Register from "../pages/Register";

const router = createBrowserRouter([
  {
    path: RoutersLink.INDEX,
    children: [
      {
        path: RoutersLink.FIRST_GAME,
        element: <SearchDocument />
      },
      {
        path: RoutersLink.SECOND_GAME,
        element: <SearchDocument />
      },
      {
        path: RoutersLink.QR_CODE,
        element: <SearchDocument />
      },
    ]
  },
  {
    path: RoutersLink.GAME,
    element: <Games />
  },
  {
    path: RoutersLink.FORMGAME,
    element: <FormGame />
  },
  {
    path: "/registros",
    element: <Register />
  },
]);

export default router;