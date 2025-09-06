import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DownBar from "../components/Downbar";
import Navbar from "../components/Navbar";

const LoanRequest = () => {
  const [amountRequested, setAmountRequested] = useState("");
  const [purpose, setPurpose] = useState("");
  const [durationMonths, setDurationMonths] = useState("");
  const [interestRate, setInterestRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [hasActiveLoan, setHasActiveLoan] = useState(false);  // New state to track loan status

  const navigate = useNavigate();

  // Check authentication and loan status on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");

    if (!user?.isLoggedIn || !storedToken) {
      alert("You must be logged in to request a loan.");
      navigate("/login");
    } else {
      setToken(storedToken);
    }
  }, [navigate]);

  // Fetch interest rate
  useEffect(() => {
    if (!token) return;

    const fetchInterestRate = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/interest-rate", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok && data?.interestRate) {
          setInterestRate(data.interestRate);
        } else {
          alert("Failed to fetch interest rate");
        }
      } catch (error) {
        alert("Error fetching interest rate: " + error.message);
      }
    };

    fetchInterestRate();
  }, [token]);

  // Check if the user already has an active or funded loan
  useEffect(() => {
    if (!token) return;

    const checkExistingLoan = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/loan/my-loan", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("Loan status fetched:", data);

        if (res.ok && data?.loan?.status) {
          const activeStatuses = ["approved", "funded", "pending"];
          if (activeStatuses.includes(data.loan.status.toLowerCase())) {
            setHasActiveLoan(true);
          }
        }
      } catch (error) {
        console.error("Error checking loan status:", error);
      }
    };

    checkExistingLoan();
  }, [token]);

  // Handle loan request submission
  const handleLoanRequest = async (e) => {
    e.preventDefault();

    if (hasActiveLoan) {
      alert("You already have an active loan request or funded loan.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/loan/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amountRequested,
          purpose,
          durationMonths,
          interestRate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Loan request submitted successfully!");
        navigate("/dashboard");
      } else {
        alert("Loan request failed: " + data.message);
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // If user already has an active or funded loan, show a different view
  if (hasActiveLoan) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Navbar />
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
          <h2 className="text-xl font-semibold mb-4">Loan Request Unavailable</h2>
          <p>You already have an active or funded loan. Please wait until it's resolved before requesting a new one.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl"
          >
            Go to Dashboard
          </button>
        </div>
        <DownBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <Navbar />
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-secondary mb-6">
          Request a Loan
        </h1>

        <form onSubmit={handleLoanRequest} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount Requested (₹)
            </label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={amountRequested || ""}
              onChange={(e) => setAmountRequested(Number(e.target.value))}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purpose
            </label>
            <input
              type="text"
              placeholder="e.g. Home renovation"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (Months)
            </label>
            <input
              type="number"
              placeholder="e.g. 12"
              value={durationMonths || ""}
              onChange={(e) => setDurationMonths(Number(e.target.value))}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interest Rate (%)
            </label>
            <input
              type="number"
              value={interestRate ?? ""}
              placeholder="Fetching from API..."
              disabled
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl text-gray-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading || interestRate === null}
            className="w-full bg-secondary text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
          >
            {loading ? "Submitting..." : "Submit Loan Request"}
          </button>
        </form>
      </div>
      <DownBar />
    </div>
  );
};

export default LoanRequest;
