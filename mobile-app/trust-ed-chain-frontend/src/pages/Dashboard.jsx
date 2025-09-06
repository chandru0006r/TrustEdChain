import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StudentDashboard from "./StudentDashboard";
import InvestorDashboard from "./InvestorDashboard";
import Navbar from "../components/Navbar";
import DownBar from "../components/Downbar";

const Dashboard = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const { data } = await axios.get("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(data);
        setRole(data.role);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        navigate("/login");
      }
    };

    fetchRole();
  }, [navigate]);

  if (loading) return <div className="p-4 text-lg">Loading Dashboard...</div>;

  return (
    <>
    <Navbar/>
      {role === "user" && <StudentDashboard />}
      {role === "lender" && <InvestorDashboard />}
      {role === "admin" && (
        <div className="p-4 text-lg text-red-500 font-bold">
          Redirecting to Admin Page...
        </div>
      )}
      <DownBar />
    </>
  );
};

export default Dashboard;
