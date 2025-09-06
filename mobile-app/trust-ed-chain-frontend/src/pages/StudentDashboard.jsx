import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const StudentDashboard = () => {
  const [trustScore, setTrustScore] = useState(0);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        // Get user profile to extract trust score
        const profileResponse = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrustScore(profileResponse.data.trustScore || 0);

        // Get loan details
        const loanResponse = await axios.get("http://localhost:5000/api/loan/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoans(loanResponse.data);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-6 mt-20">Loading student dashboard...</div>;

  const totalLoans = loans.length;
  const activeLoans = loans.filter(
    (loan) => loan.repaymentProgress !== loan.amountRequested
  ).length;
  
  const repaidLoans = loans.filter((loan) => loan.repaymentProgress === loan.amountRequested).length;
  const totalBorrowed = loans
  .filter((loan) => loan.fundedAmount >= loan.amountRequested && loan.repaymentProgress !== loan.amountRequested)
  .reduce((sum, loan) => sum + (loan.amountRequested - loan.repaymentProgress), 0);

  return (
    <div className="p-6 mt-20">
      <h2 className="text-2xl font-bold mb-6">🎓 Student Dashboard</h2>

      {/* Trust Score Circle */}
      <section className="flex justify-center mb-10">
        <div className="flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-b from-indigo-500 to-indigo-700 text-white shadow-md">
          <div className="text-center">
            <p className="text-5xl font-bold">98</p>
            <p className="text-sm text-indigo-200">of 100</p>
            <p className="text-sm text-indigo-200">TrustScore</p>
          </div>
        </div>
      </section>

      {/* Loan Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card title="Total Loans" value={totalLoans} />
        <Card title="Active Loans" value={activeLoans} />
        <Card title="Repaid Loans" value={repaidLoans} />
        <Card title="To Repay" value={`₹${totalBorrowed}`} />
      </div>

      {/* Full-width Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Link to="/request-loan">
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl shadow-md hover:bg-blue-700 transition">
            Request Loan
          </button>
        </Link>
        <Link to="/give-loan">
          <button className="w-full bg-green-600 text-white py-3 rounded-xl shadow-md hover:bg-green-700 transition">
            Give Loan
          </button>
        </Link>
      </div>

    {/* Loan List */}
<div>
  <h3 className="text-xl font-semibold mb-3">Pending Loans</h3>
  <div className="space-y-3 pb-20">
    {loans.length === 0 ? (
      <p>No loans found.</p>
    ) : (
      loans
        .filter((loan) =>
          loan.fundedAmount >= loan.amountRequested &&
          loan.repaymentProgress !== loan.amountRequested
        )
        .map((loan) => (
          <Link to={`/repay-loan/${loan._id}`} key={loan._id}>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 transition duration-200 cursor-pointer border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-indigo-600 font-semibold text-sm">Loan ID</h4>
                <span className="text-gray-600 text-sm">{loan._id}</span>
              </div>
              <div className="mb-2">
                <p className="text-gray-500 text-xs mb-1">Amount Requested</p>
                <p className="text-lg font-bold text-gray-800">₹{loan.amountRequested.toLocaleString()}</p>
              </div>
              <p className="text-sm text-gray-700">
                ₹{loan.repaymentProgress.toLocaleString()} / ₹{loan.amountRequested.toLocaleString()}
              </p>
            </div>
          </Link>
        ))
    )}
  </div>
</div>

    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="p-4 rounded-xl shadow-md bg-indigo-700 text-white">
    <h4 className="text-white text-sm">{title}</h4>
    <p className="text-2xl font-semibold">{value}</p>
  </div>
);

export default StudentDashboard;
