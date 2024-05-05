import Login from "./components/Login/Login";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Navbar from "./components/Navbar/Navbar";
import StudentProfileManagement from "./components/StudentProfileManagement/StudentProfileManagement";
import ClassManagement from "./components/ClassManagement/ClassManagement";
import AttendanceTracking from "./components/AttendanceTracking/AttendanceTracking";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Dashboard />
            </>
          }
        />
        <Route
          path="/SPM"
          element={
            <>
              <Navbar />
              <StudentProfileManagement />
            </>
          }
        />
        <Route
          path="/CM"
          element={
            <>
              <Navbar />
              <ClassManagement />
            </>
          }
        />
        <Route
          path="/AT"
          element={
            <>
              <Navbar />
              <AttendanceTracking />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
