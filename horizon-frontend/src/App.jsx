import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Login from "./Routes/Login";
import Signup from "./Routes/Signup";
import Details from "./Routes/Details";
import SearchResult from "./Routes/SearchResult";
import CategoryFilter from "./Routes/CategoryFilter";
import ScrollToTop from "./Components/ScrollToTop";
import Checkout from "./Routes/Checkout";
import AuthProvider from "./contexts/auth";
import AdminCMS from "./Routes/AdminCMS";
import PainelUser from "./Routes/UserPanel";
import EditarCarro from "./Routes/EditarCarro";


function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/Details/:carName" element={<Details />} />
            <Route path="/Search" element={<SearchResult />} />
            <Route
              path="/CarsByCategory/:categoryID"
              element={<CategoryFilter />}
            />
            <Route path="/Checkout/:carID" element={<Checkout />} />
            <Route path="/AdminCMS" element={<AdminCMS />} />
            <Route path="/minhas-reservas" element={<PainelUser />} />
            <Route path="/editarCarro/:carID" element={<EditarCarro/>}/>
          </Routes>
        </ScrollToTop>
      </Router>
    </AuthProvider>
  );
}

export default App;
