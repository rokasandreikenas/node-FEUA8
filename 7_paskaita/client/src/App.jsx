import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Pet from "./pages/Pet";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pets/:id" element={<Pet />} />
    </Routes>
  );
};

export default App;
