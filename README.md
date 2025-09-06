
# Trust-Ed-Chain – DeFi Microloan Platform

## 📌 Overview

**Trust-Ed-Chain** is a decentralized **microloan platform** that leverages blockchain technology to provide secure, transparent, and trustless peer-to-peer lending.

Borrowers can submit loan requests with details such as purpose, duration, and interest rate, while lenders can view, fund, and track repayment progress. All transactions are immutably recorded on the blockchain to ensure trust, reduce fraud, and eliminate traditional financial intermediaries.

---

## 🚀 Features

* **Loan Requests** – Borrowers can request microloans with customizable terms.
* **Funding Loans** – Lenders can partially or fully fund loans.
* **Blockchain Integration** – Transactions are recorded on Ethereum for transparency.
* **Repayment Tracking** – Borrowers’ repayment progress is maintained.
* **API-Driven** – REST APIs handle loan requests, updates, and blockchain interactions.

---

## 🛠️ Tech Stack

* **Frontend**: React.js
* **Backend**: Node.js + Express.js
* **Database**: MongoDB
* **Blockchain**: Ethereum (Solidity Smart Contracts)
* **API Testing**: Postman / cURL

---

## 📡 API Endpoints

### Loan Request

**POST** `/api/loan/request`

```json
{
  "amountRequested": 100,
  "purpose": "by chandru",
  "durationMonths": 20,
  "interestRate": 10
}
```

#### Example Loan Record

```json
{
  "id": "L12345",
  "student": "chandru01",
  "amountRequested": 100,
  "fundedAmount": 50,
  "purpose": "by chandru",
  "durationMonths": 20,
  "interestRate": 10,
  "status": "Partially Funded",
  "repaymentProgress": "25%",
  "blockchainTxHash": "0xabc123...xyz"
}
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/trust-ed-chain.git
cd trust-ed-chain
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start Backend

```bash
npm run server
```

### 4. Start Frontend

```bash
npm start
```

### 5. Deploy Smart Contracts

```bash
truffle migrate --network development
```

---

## 🌍 Future Roadmap

* Credit scoring mechanism for borrowers
* NFT-based collateral management
* Multi-chain (Polygon, BSC) integration
* DAO governance for lender-borrower ecosystem

---

## 👨‍💻 Author

**Chandru V** – Creator & Developer of Trust-Ed-Chain

