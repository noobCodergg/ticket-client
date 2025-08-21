import Registration from "./Pages/registration";
import Otp from "./Pages/otp";
import Login from "./Pages/login"; // fix import: use your custom Login component
import PublicRoute from "./Routes/publicRoute";
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
import MyTickets from "./Pages/MyTickets";
import CancelReuest from "./Pages/CancelReuest";

function App() {
  return (
    <UserProvider>
      <Navbar />
      <Routes>
          <Route
    path="/registration"
    element={
      <PublicRoute>
        <Registration/>
      </PublicRoute>
    }
  />
        <Route path="/otp" element={<Otp />} />
         <Route
    path="/login"
    element={
      <PublicRoute>
        <Login />
      </PublicRoute>
    }
  />
        <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
    path="/"
    element={
      <ProtectedRoute>
        <Home/>
      </ProtectedRoute>
    }
  />
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


        <Route
          path="/my-tickets"
          element={
            <ProtectedRoute role={["user"]}>
              <MyTickets/>
            </ProtectedRoute>
          }
        />


         <Route
          path="/cancel-request"
          element={
            <ProtectedRoute role={["admin","user"]}>
              <CancelReuest/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </UserProvider>
  );
}

export default App;
