import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import IdentityVerification from "./pages/IdentityVerification";
import Dashboard from "./pages/Dashboard";
import LoanRequest from "./pages/LoanRequest"
import GiveLoanPage from "./pages/GiveLoan"
import FundLoanDetails from './pages/FundLoanDetails';
import RepayLoan from "./pages/RepayLoan";
import MyLoans from "./pages/MyLoans";
import MyInvestments from "./pages/MyInvestments";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<IdentityVerification />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/request-loan" element={<LoanRequest />} />
        <Route path="/give-loan" element={<GiveLoanPage />} />
        <Route path="/fund-loan/:id" element={<FundLoanDetails />} />
        <Route path="/repay-loan/:loanId" element={<RepayLoan />} />
        <Route path="/my-loans" element={<MyLoans />} />
        <Route path="/my-investments" element={<MyInvestments />} />
      </Routes>
    </Router>
  );
}

export default App;
