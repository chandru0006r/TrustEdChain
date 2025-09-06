import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Downbar from "../components/Downbar";

const RepayLoan = () => {
  const { loanId } = useParams();
  const [loan, setLoan] = useState(null);
  const [amountToRepay, setAmountToRepay] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchLoan = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/loan/${loanId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoan(response.data);
      } catch (err) {
        console.error("Error fetching loan details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoan();
  }, [loanId]);

  const handleRepay = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:5000/api/transactions/repay/${loanId}`,
        { amount: Number(amountToRepay) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Repayment successful!");
      navigate("/dashboard");
    } catch (err) {
      alert("Repayment failed. Try again.");
      console.error(err);
    }
  };

  if (loading) return <div className="p-6 mt-20">Loading repayment page...</div>;

  if (!loan) return <div className="p-6 mt-20 text-red-600">Loan not found.</div>;

  return (
    <>
      <Navbar />
      <div className="p-6 mt-20 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">💸 Repay Loan</h2>

        <div className="bg-white p-4 rounded-xl shadow-md mb-6">
          <p><b>Loan ID:</b> {loan._id}</p>
          <p><b>Amount Requested:</b> ₹{loan.amountRequested}</p>
          <p><b>Repayment Progress:</b> ₹{loan.repaymentProgress} / ₹{loan.amountRequested}</p>
        </div>

        <input
          type="number"
          placeholder="Enter amount to repay"
          value={amountToRepay}
          onChange={(e) => setAmountToRepay(e.target.value)}
          className="w-full border px-4 py-2 rounded-md mb-4"
        />

        <button
          onClick={handleRepay}
          className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
        >
          Make Repayment
        </button>
      </div>
      <Downbar />
    </>
  );
};

export default RepayLoan;
