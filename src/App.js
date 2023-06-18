import { Routes, Route } from "react-router-dom";
import { UserAuthContextProvider } from "./context/userAuthContext";

import Home from "./components/Home";
import Login from "./components/Login";
import Ajout from "./pages/Ajout";
import Consulter from "./pages/Consulter";
import Message from "./pages/Message";
import Produit from "./pages/Produit";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js"
import 'react-toastify/dist/ReactToastify.css';

import "./App.css";
import { ToastContainer } from "react-toastify";
import Admins from "./pages/Admins";

function App() {
  return (
    <UserAuthContextProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/ajout" element={<Ajout />} />
        <Route path="/consulter" element={<Consulter />} />
        <Route path="/message" element={<Message />} />
        <Route path="/produit" element={<Produit />} />
        <Route path="/admins" element={<Admins />} />
      </Routes>
    </UserAuthContextProvider>
  );
}

export default App;
