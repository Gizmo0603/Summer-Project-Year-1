import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./Login";
import Register from "./Register";
import Layout from "./Layout";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App