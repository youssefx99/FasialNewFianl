import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/welcome/Welcome";
import Students from "./pages/allStudents/Students";
import LoginPage from "./pages/login/Login";
import Create from "./pages/create/Create";
import Edit from "./pages/edit/edit";
import ProtectedRoute from "./common/protectRoute"; // Import the Protected Route
import SendContract from "./pages/sendContract/SendContract";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/create" element={<Create />} />
        <Route path="/loginforadmin" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/students" element={<Students />} />
          <Route path="/edit-contract/:id" element={<Edit />} />
          {/* <Route path="/sendcontract/:contractId" element={<SendContract />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
