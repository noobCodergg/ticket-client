import Registration from "./Pages/registration";
import Otp from "./Pages/otp";
import Login from "./Pages/login"; // fix import: use your custom Login component

import { Route, Routes } from "react-router-dom";
import UserProvider from "./Context/UserContext";
import ProtectedRoute from "./Routes/protectedRoute";
import BusScheduleUploader from "./Pages/BusScheduleUploader";

import Unauthorized from "./Pages/Unauthorized";
import Navbar from "./Pages/Navbar";
import Home from "./Pages/Home";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Select from "./Pages/Select";
import BusDetails from "./Pages/BusDetails";
import SearchBuses from "./Pages/SearchBuses";

function App() {
  return (
    <UserProvider>
      <Navbar />
      <Routes>
        <Route path="/registration" element={<Registration />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<Home />} />
        <Route path="/select" element={<Select />} />

        <Route
          path="/scheduler"
          element={
            <ProtectedRoute role={["operator","admin"]}>
              <BusScheduleUploader />
            </ProtectedRoute>
          }
        />

          <Route
          path="/details/:id"
          element={
            <ProtectedRoute role={["user","admin"]}>
              <BusDetails/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedRoute role={["user","admin"]}>
              <SearchBuses/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </UserProvider>
  );
}

export default App;
