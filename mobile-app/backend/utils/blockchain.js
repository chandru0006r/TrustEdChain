// utils/blockchain.js (Mock version)

export const writeLoanToBlockchain = async (loanId, data) => {
  console.log("🔗 Mock: writeLoanToBlockchain called");
  console.log("Loan ID:", loanId);
  console.log("Loan Data:", data);

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return "0xMockTransactionHash_WriteLoan";
};

export const updateLoanStatusOnBlockchain = async (loanId, status) => {
  console.log("🔗 Mock: updateLoanStatusOnBlockchain called");
  console.log("Loan ID:", loanId);
  console.log("New Status:", status);

  await new Promise((resolve) => setTimeout(resolve, 500));

  return true;
};

export const fundLoanOnBlockchain = async (loanId, amount) => {
  console.log("🔗 Mock: fundLoanOnBlockchain called");
  console.log("Loan ID:", loanId);
  console.log("Funded Amount:", amount);

  await new Promise((resolve) => setTimeout(resolve, 500));

  return "0xMockTransactionHash_FundLoan";
};

export const repayLoanOnBlockchain = async (loanId, amount) => {
  console.log("🔗 Mock: repayLoanOnBlockchain called");
  console.log("Loan ID:", loanId);
  console.log("Repaid Amount:", amount);

  await new Promise((resolve) => setTimeout(resolve, 500));

  return "0xMockTransactionHash_RepayLoan";
};

export const recordPenaltyOnBlockchain = async (loanId, amount) => {
  console.log("🔗 Mock: recordPenaltyOnBlockchain called");
  console.log("Loan ID:", loanId);
  console.log("Penalty Amount:", amount);

  await new Promise((resolve) => setTimeout(resolve, 500));

  return "0xMockTransactionHash_Penalty";
};

export const recordForgivenessOnBlockchain = async (loanId, amount) => {
  console.log("🔗 Mock: recordForgivenessOnBlockchain called");
  console.log("Loan ID:", loanId);
  console.log("Forgiven Amount:", amount);

  await new Promise((resolve) => setTimeout(resolve, 500));

  return "0xMockTransactionHash_Forgiveness";
};
