import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = "http://localhost:5000/api/profile/upload";
const PROFILE_URL = "http://localhost:5000/api/profile";

const IdentityVerification = () => {
  const [step, setStep] = useState(1);
  const [aadharFile, setAadharFile] = useState(null);
  const [collegeIdFile, setCollegeIdFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      alert("You must log in first.");
      navigate('/login');
    } else {
      setToken(storedToken);
      fetchProfile(storedToken);
    }
  }, []);

  const fetchProfile = async (authToken) => {
    try {
      const response = await axios.get(PROFILE_URL, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const userProfile = response.data;
      setRole(userProfile.role);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      alert("Error fetching user profile. Please try again.");
    }
  };

  const uploadFiles = async () => {
    try {
      const formData = new FormData();
      formData.append("aadhaar", aadharFile);
      if (role !== "lender") {
        formData.append("collegeId", collegeIdFile);
      }
      formData.append("selfie", selfieFile);

      const response = await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Files uploaded successfully! You're added to the community.");
      navigate('/');
      return response.data;
    } catch (error) {
      alert("Error uploading files: " + (error.response ? error.response.data.message : "Unknown error"));
    }
  };

  const handleNext = () => {
    if (step === 1 && aadharFile && (role === "lender" || collegeIdFile)) {
      setStep(2);
    } else {
      alert("Please upload required files before proceeding.");
    }
  };

  const handleFileChange = (e, setter) => {
    setter(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!aadharFile || !selfieFile || (role !== "lender" && !collegeIdFile)) {
      alert("Please upload all required files before submitting.");
      return;
    }

    setLoading(true);
    try {
      await uploadFiles();
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (role === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary text-white text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary p-4">
      <Navbar />
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-8">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold text-center text-secondary mb-6">Identity Verification</h2>

            {/* Aadhaar Upload */}
            <div className="mb-6">
              <label className="block text-primary font-semibold mb-2">Upload Aadhaar Card</label>
              <div
                onClick={() => document.getElementById('aadhar-input').click()}
                className="border-2 border-dashed border-gray-300 p-6 text-center rounded-xl cursor-pointer hover:border-primary transition"
              >
                <i className="fa-solid fa-upload text-xl text-gray-600"></i>
                <p className="mt-2 text-gray-700 font-medium">Click to select Aadhaar file</p>
                {aadharFile && (
                  <p className="text-sm text-gray-500 mt-1">{aadharFile.name}</p>
                )}
                <input
                  id="aadhar-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, setAadharFile)}
                />
              </div>
            </div>

            {/* College ID Upload */}
            {role !== "lender" && (
              <div className="mb-6">
                <label className="block text-[rgb(58,89,209)] font-semibold mb-2">Upload College ID</label>
                <div
                  onClick={() => document.getElementById('college-input').click()}
                  className="border-2 border-dashed border-gray-300 p-6 text-center rounded-xl cursor-pointer hover:border-[rgb(58,89,209)] transition"
                >
                  <i className="fa-solid fa-upload text-xl text-gray-600"></i>
                  <p className="mt-2 text-gray-700 font-medium">Click to select College ID</p>
                  {collegeIdFile && (
                    <p className="text-sm text-gray-500 mt-1">{collegeIdFile.name}</p>
                  )}
                  <input
                    id="college-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, setCollegeIdFile)}
                  />
                </div>
              </div>
            )}

            <button
              className="w-full bg-[rgb(58,89,209)] text-white py-3 rounded-xl hover:bg-[rgb(61,144,215)] transition disabled:opacity-50"
              onClick={handleNext}
              disabled={!aadharFile || (role !== "lender" && !collegeIdFile)}
            >
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold text-center text-[rgb(58,89,209)] mb-6">Upload a Selfie</h2>

            <div className="mb-6">
              <div
                onClick={() => document.getElementById('selfie-input').click()}
                className="border-2 border-dashed border-gray-300 p-6 text-center rounded-xl cursor-pointer hover:border-[rgb(58,89,209)] transition"
              >
                <i className="fa-solid fa-camera text-xl text-gray-600"></i>
                <p className="mt-2 text-gray-700 font-medium">Click to upload a selfie</p>
                {selfieFile && (
                  <p className="text-sm text-gray-500 mt-1">{selfieFile.name}</p>
                )}
                <input
                  id="selfie-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, setSelfieFile)}
                />
              </div>
            </div>

            <button
              className="w-full bg-[rgb(58,89,209)] text-white py-3 rounded-xl hover:bg-[rgb(61,144,215)] transition disabled:opacity-50"
              onClick={handleSubmit}
              disabled={!selfieFile || loading}
            >
              {loading ? "Submitting..." : "Submit & Continue"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default IdentityVerification;
