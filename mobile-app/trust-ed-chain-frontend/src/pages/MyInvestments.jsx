import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import DownBar from '../components/Downbar';

const MyInvestments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to view your investments.');
      setLoading(false);
      return;
    }

    const fetchInvestments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/loan/my-investments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInvestments(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch your investments.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  const renderInvestment = (loan, index) => (
    <div key={loan._id} className="bg-white shadow-md p-5 mb-4 rounded-lg border">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Investment #{index + 1}</h3>
      <p><strong>Student Name:</strong> {loan.student?.name || 'N/A'}</p>
      <p><strong>Purpose:</strong> {loan.purpose}</p>
      <p><strong>Total Amount Requested:</strong> ₹{loan.amountRequested}</p>
      <p><strong>Amount You Funded:</strong> ₹{loan.amountInvested}</p>
      <p><strong>Status:</strong>
        <span className={`ml-1 font-medium ${loan.status === 'Approved' ? 'text-green-600' : loan.status === 'Rejected' ? 'text-red-500' : 'text-yellow-600'}`}>
          {loan.status}
        </span>
      </p>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="p-6 mt-20 max-w-4xl mx-auto mb-20">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">📈 My Investments</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && investments.length === 0 && <p>No investments found.</p>}
        {!loading && investments.map(renderInvestment)}
      </div>
      <DownBar />
    </div>
  );
};

export default MyInvestments;
