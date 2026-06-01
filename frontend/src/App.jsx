import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./Login";
import Register from "./Register";
import Main from "./Main";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element = {<Main />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App