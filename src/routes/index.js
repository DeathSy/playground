import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ActiveLivenessEkyc } from "../pages/ActiveLivenessEkyc";

import { InsuranceMock } from "../pages/InsuranceMock";

const routes = () => {
  return (
    <Router basename="/playground">
      <Routes>
        <Route path="/" element={<InsuranceMock />} />
        <Route path="active-ekyc" element={<ActiveLivenessEkyc />} />
      </Routes>
    </Router>
  );
};

export default routes;
