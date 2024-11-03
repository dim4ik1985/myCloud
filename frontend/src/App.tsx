import "./App.css";
import { Route, Routes } from "react-router-dom";

import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { PrivateRoute } from "./utils/PrivateRoute.tsx";
import { ProfileScreen } from "./pages/ProfileScreen";
import { Admin } from "./pages/Admin";
import { UserFiles } from "./components/Admin/UserFiles/UserFiles.tsx";
import { NotFound } from "./pages/NotFound";

function App() {
  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/:id" element={<UserFiles />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
