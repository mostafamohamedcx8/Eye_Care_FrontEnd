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
import DetailsExam from "./pages/DetailsExam";
import Verificationcode from "./pages/verificationCode";
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
          <Route path="/Details" element={<DetailsExam />} />
          <Route path="/Verificationcode" element={<Verificationcode />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
