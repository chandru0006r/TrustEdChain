import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const InvestorDashboard = () => {
  const [stats, setStats] = useState({
    totalFunded: 0,
    activeLoans: 0,
    totalAmountFunded: 0,
    repaidLoans: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchStats = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/dashboard/investor-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Received investor data:", data);
        setStats(data);
      } catch (err) {
        console.error("Investor stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-6 mt-20">Loading investor dashboard...</div>;

  return (
    <div className="p-6 mt-20"> {/* Push below navbar */}
      <h2 className="text-2xl font-bold mb-6">💼 Investor Dashboard</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* <Card title="Total Loans Funded" value="12" />
        <Card title="Active Investments" value="5" />
        <Card title="Total Amount Funded" value="₹12000" />
        <Card title="Repaid Loans" value="4" /> */}
        <Card title="Total Loans Funded" value={stats.totalFunded} />
        <Card title="Active Investments" value={stats.activeLoans} />
        <Card title="Total Amount Funded" value={`₹${stats.totalAmountFunded}`} />
        <Card title="Repaid Loans" value={stats.repaidLoans} />
      </div>
      <div className="grid grid-cols gap-4 mb-6">
              <Link to="/give-loan">
                <button className="w-full bg-green-600 text-white py-3 rounded-xl shadow-md hover:bg-green-700 transition">
                  Give Loan
                </button>
              </Link>
        </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div
    className="p-4 rounded-xl shadow-md"
    style={{ backgroundColor: "#3836bd", color: "white" }}
  >
    <h4 className="text-white text-sm">{title}</h4>
    <p className="text-2xl font-semibold">{value}</p>
  </div>
);

export default InvestorDashboard;
