import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [aadhaarUploaded, setAadhaarUploaded] = useState(false);
  const [clgIdUploaded, setClgIdUploaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
  
    if (user?.isLoggedIn && token) {
      setIsLoggedIn(true);
  
      fetch("http://localhost:5000/api/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setAadhaarUploaded(!!data.aadhaar?.url);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching profile:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);
  
  const handleNavigate = () => {
    if (aadhaarUploaded) {
      navigate("/dashboard");
    } else {
      navigate("/verify");
    }
  };

  return (
    <div className="min-h-screen bg-primary px-4 py-8 font-sans">
      <Navbar />
    <div className="h-40"></div> 

      <section className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-secondary mb-4">Trust.Ed.Chain</h1>
        <p className="text-lg text-white max-w-2xl mx-auto">
          A decentralized, trust-based community for students to connect, share, and grow.
          Your identity is verified, your profile is secure, and your voice matters.
        </p>

        <div className="mt-6">
          {!isLoggedIn ? (
            <>
              <p className="text-white font-semibold mb-2">Already a user?</p>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 bg-secondary text-white rounded-xl font-semibold hover:bg-secondary transition-all"
              >
                Login to Get Started
              </button>
            </>
          ) : loading ? (
            <p className="text-white font-semibold">Checking your verification status...</p>
          ) : (
            <>
              <p className="text-white font-semibold mb-2">Welcome back!</p>
              <button
                onClick={handleNavigate}
                className="px-6 py-3 bg-secondary text-white rounded-xl font-semibold hover:bg-secondary transition-all"
              >
                {aadhaarUploaded
                  ? "Go to Dashboard"
                  : "Verify Your Identity"}
              </button>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16 bg-white py-7 rounded-xl">
        <h2 className="text-2xl font-bold text-center text-[rgb(58,89,209)] mb-8">
          Why Trust-Ed Chain?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Verified Students",
              desc: "Only real students can join with valid Aadhaar, college ID, and selfie checks.",
            },
            {
              title: "Decentralized Identity",
              desc: "Built on blockchain to ensure security, privacy, and immutability.",
            },
            {
              title: "Trusted Community",
              desc: "Engage in real student communities, events, and trusted collaborations.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold text-[rgb(3,89,209)] mb-2">
                {f.title}
              </h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center text-secondary mb-8">
          How It Works
        </h2>
        <ol className="space-y-4 max-w-xl mx-auto">
          {[
            "Register using your student credentials",
            "Upload Aadhaar, College ID & a selfie",
            "Our team verifies your identity securely",
            "Once verified, access all community features",
          ].map((step, idx) => (
            <li
              key={idx}
              className="bg-white p-4 rounded-xl shadow flex items-start gap-4"
            >
              <span className="text-secondary font-bold text-lg">
                {idx + 1}.
              </span>
              <p className="text-gray-700">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <footer className="text-center text-sm text-secondary pt-8 border-t">
        © 2025 Trust-Ed Chain. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
