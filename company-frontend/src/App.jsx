import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Registration from "./Registration";
import CompanyRegistration from "./CompanyRegistration";


function App() {
  return (
    <Router>
      <Routes>
        {/* Default Home */}
        <Route path="/" element={<Home/>} />

        {/* Signup / Signin */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        {/* Student Flow */}
        <Route path="/registration" element={<Registration />} />

        {/* Company Flow */}
        <Route path="/companyRegistration" element={<CompanyRegistration />} />
        

        {/* fallback */}
        <Route path="*" element={<h1>404 Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
