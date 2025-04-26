import Home from "./pages/Home";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Examination from "./pages/Examination";
import ResetPassword from "./pages/Resetpassword";
import OtpCode from "./pages/OTP";
import Newpassword from "./pages/NewPassword";
import History from "./pages/History";
import Verificationcode from "./pages/verificationCode";
import ExaminationReport from "./pages/ExaminationReport";
import DoctorCard from "./pages/DoctorPage";
import ProfilePage from "./pages/ProfilePage";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Examination" element={<Examination />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="/OtpCode" element={<OtpCode />} />
          <Route path="/NewPassword" element={<Newpassword />} />
          <Route path="/History" element={<History />} />
          <Route path="/Verificationcode" element={<Verificationcode />} />
          <Route path="/ExaminationReport" element={<ExaminationReport />} />
          <Route path="/DoctorCard" element={<DoctorCard />} />
          <Route path="/ProfilePage" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
