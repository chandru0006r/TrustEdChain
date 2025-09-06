import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import DownBar from '../components/Downbar';

const GiveLoanPage = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No token found. Please log in first.');
      setLoading(false);
      return;
    }

    axios
      .get('http://localhost:5000/api/loan/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // Filter out already funded loans and sort by date (most recent first)
        const pendingLoans = res.data
          .filter((loan) => loan.status === 'pending' && !loan.isFunded)  // Make sure it's not funded
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));  // Sort by most recent
          
        setLoans(pendingLoans);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching loans:', err);
        if (err.response?.status === 401) {
          setError('Unauthorized. Please log in again.');
        } else {
          setError('Something went wrong while fetching loans.');
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4 text-gray-600">Loading loan data...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto pt-20">
      <Navbar />
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Loan Requests</h2>
      {loans.length === 0 ? (
        <p className="text-gray-600">No pending loan requests at the moment.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 pb-20">
          {loans.map((loan) => (
            <div key={loan._id} className="p-5 bg-white rounded-lg shadow-md border">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">{loan.student.name}</h3>
              <p><strong>Email:</strong> {loan.student.email}</p>
              <p><strong>Amount Requested:</strong> ₹{loan.amountRequested}</p>
              <p><strong>Purpose:</strong> {loan.purpose}</p>
              <p><strong>Duration:</strong> {loan.durationMonths} months</p>
              <p><strong>Interest Rate:</strong> {loan.interestRate}%</p>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => navigate(`/fund-loan/${loan._id}`)}
              >
                Fund This Loan
              </button>
            </div>
          ))}
        </div>
      )}
      <DownBar />
    </div>
  );
};

export default GiveLoanPage;
