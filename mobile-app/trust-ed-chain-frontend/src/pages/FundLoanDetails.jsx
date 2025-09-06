import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import DownBar from '../components/Downbar';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const FundLoanDetails = () => {
  const { id } = useParams(); // loan ID from URL
  const [loan, setLoan] = useState(null);
  const [student, setStudent] = useState(null);
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [riskLoading, setRiskLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [txNote, setTxNote] = useState('');
  const [fundLoading, setFundLoading] = useState(false);
  const [fundError, setFundError] = useState('');
  const [fundSuccess, setFundSuccess] = useState('');
  const [fundTransaction, setFundTransaction] = useState(null); // New state to store transaction details

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to continue.');
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5000/api/loan/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setLoan(res.data);
        const studentId = res.data.student._id || res.data.studentId;
        return axios.get(
          `http://localhost:5000/api/profile/student/${studentId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      })
      .then((res) => {
        setStudent(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch loan or user details.');
        setLoading(false);
      });
  }, [id]);

  const fetchRiskPrediction = () => {
    setRiskLoading(true);
    axios
      .post(`http://localhost:5000/api/risk/predict`, { loanId: id })
      .then((res) => {
        setRisk(res.data.riskProbability);
        setRiskLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setRisk('Error predicting risk');
        setRiskLoading(false);
      });
  };

  const handleFundAgreement = () => {
    if (loan) {
      setFundAmount(loan.amountRequested); // Auto-fill with requested amount
    }
    setIsModalOpen(true);
  };
  

  const submitFundLoan = async () => {
    setFundLoading(true);
    setFundError('');
    setFundSuccess('');
    setFundTransaction(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:5000/api/transactions/fund/${id}`,
        { amount: fundAmount, txNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFundSuccess(res.data.message);
      setFundTransaction(res.data.transaction);
      setIsModalOpen(false);
      setFundAmount('');
      setTxNote('');
    } catch (err) {
      console.error(err);
      setFundError('Funding failed. Please try again.');
    } finally {
      setFundLoading(false);
    }
  };

  if (loading) return <p className="p-4">Loading loan and user details...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div>
      <Navbar />
      <div className="p-6 mt-20 max-w-3xl mx-auto pb-20 mb-10">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">📄 Loan & User Details</h2>

        {student && (
          <div className="bg-white p-5 rounded-lg shadow-md border mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">👤 Student Information</h3>
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Department:</strong> {student.department}</p>
            <p><strong>Year:</strong> {student.year}</p>
          </div>
        )}

        {loan && (
          <div className="bg-white p-5 rounded-lg shadow-md border mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">💰 Loan Information</h3>
            <p><strong>Amount Requested:</strong> ₹{loan.amountRequested}</p>
            <p><strong>Purpose:</strong> {loan.purpose}</p>
            <p><strong>Duration:</strong> {loan.durationMonths} months</p>
            <p><strong>Interest Rate:</strong> {loan.interestRate}%</p>
            {loan.status && <p><strong>Status:</strong> {loan.status}</p>}
          </div>
        )}

        <div className="mb-4">
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            onClick={fetchRiskPrediction}
            disabled={riskLoading}
          >
            {riskLoading ? 'Checking risk...' : 'Check Risk Probability'}
          </button>
          {risk && <p className="mt-2 text-gray-700">Risk Probability: <strong>{risk}</strong></p>}
        </div>

        {!fundSuccess && (
  <div>
    <button
      className="bg-green-600 text-white px-4 py-3 rounded-xl shadow-md hover:bg-green-700 transition"
      onClick={handleFundAgreement}
    >
      ✅ Proceed to Agreement & Fund Loan
    </button>
  </div>
)}

        {fundSuccess && (
          <p className="mt-4 text-green-600 font-medium">{fundSuccess}</p>
        )}

        {fundTransaction && (
          <div className="bg-white p-4 mt-4 rounded-md shadow-md border text-sm">
            <h3 className="text-md font-semibold mb-2 text-green-700">🎉 Transaction Details</h3>
            <p><strong>Loan ID:</strong> {fundTransaction.loan}</p>
            <p><strong>Amount Funded:</strong> ₹{fundTransaction.amount}</p>
            <p><strong>Note:</strong> {fundTransaction.txNote}</p>
            <p><strong>Blockchain Hash:</strong> <code className="break-words">{fundTransaction.blockchainTxHash}</code></p>
            <p><strong>Time:</strong> {new Date(fundTransaction.timestamp).toLocaleString()}</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto mt-24 pb-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
      >
        <h2 className="text-xl font-bold mb-4">📝 Terms & Funding Form</h2>
        <p className="text-sm text-gray-700 mb-3">
          By proceeding, you agree to fund this student loan with the entered amount. This action is recorded permanently and cannot be reversed.
        </p>
        <ul className="text-sm text-gray-600 list-disc pl-5 mb-4">
          <li>You will receive interest based on the agreed rate.</li>
          <li>Early repayment is possible.</li>
          <li>Trust-Ed Chain ensures accountability and tracking via blockchain.</li>
        </ul>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">💸 Amount to Fund</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded-md bg-gray-100 cursor-not-allowed"
            value={fundAmount}
            readOnly
            />

        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">📝 Transaction Note</label>
          <textarea
            className="w-full border px-3 py-2 rounded-md"
            rows={3}
            value={txNote}
            onChange={(e) => setTxNote(e.target.value)}
            placeholder="Write a short message or note..."
          />
        </div>

        <div className="flex justify-end gap-3 pb-20">
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={submitFundLoan}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            disabled={fundLoading}
          >
            {fundLoading ? 'Processing...' : '✅ Confirm & Fund'}
          </button>
        </div>

        {fundError && <p className="text-red-500 mt-2">{fundError}</p>}
      </Modal>

      <DownBar />
    </div>
  );
};

export default FundLoanDetails;
