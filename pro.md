```md
# 🪙 Trust-Ed-Chain – Role-Based Workflow

## 🎓 Students
**Login:**  
Via verified college email (approved by the college).  

**Functionalities:**
- **Forum:** Exchange small peer-to-peer loans between students of the same college.
- **Bulk Loan Request:** Form to request higher-value loans.
- **KYC Confirmation:** Complete PAN/Aadhaar verification at registration.
- **Mentor Approval:** Mentor validates student account and monitors activities.
- **Profile:** Displays CGPA, personal details, and loan history.
- **Repayment Tracking:** View repayment progress and reminders.

---

## 👩‍🏫 Mentors (within College Portal)
**Login:**  
Through the same **college dashboard** (no separate login).  

**Functionalities:**
- View and manage **assigned students**.
- Approve or reject **student KYC** submissions.
- Approve **small-value loan requests** (e.g., ≤ ₹500).
- Review student activities and repayment behavior.
- Add **remarks or recommendations** visible to investors.
- Report defaults or suspicious activities to college admin.

---

## 🏫 College (Admin)
**Login:**  
Via official college mail ID.  

**Functionalities:**
- Manage **mentors and staff accounts** (add, update, remove).
- Approve student KYC and registration after mentor review.
- Oversee **college-level financial activity** and loan analytics.
- Approve **large loan requests**.
- Validate data using **PAN, Aadhaar, College ID APIs**.
- Access **reports** on student participation, repayment, and mentor performance.

---

## 💰 Investors
**Login:**  
Via registered email ID.  

**Functionalities:**
- Review verified student profiles across multiple colleges.
- Filter students by **CGPA**, **credit score**, **mentor remarks**, or **purpose**.
- Fund loans fully or partially using **smart contracts**.
- Track **repayment progress** and **returns**.
- View **mentor feedback** before investing.

---

## 🔄 End-to-End Flow

1. Student registers → completes **KYC** → awaits **mentor verification**.  
2. Mentor verifies and activates the student profile.  
3. Student requests a loan:
   - If ≤ ₹500 → Mentor approves.
   - If > ₹500 → Sent to **college admin** for approval.
4. Approved requests appear for **investors** to fund.  
5. Funds are disbursed via blockchain transaction.  
6. Student repays loan periodically.  
7. Mentor monitors progress and updates remarks.  
8. Investor sees repayment performance and mentor validation.

---

## 🧱 Database Relationship Overview

| Table | Key Fields | Relation |
|--------|-------------|-----------|
| `college` | college_id | 1:N with `mentor` and `student` |
| `mentor` | mentor_id, college_id | 1:N with `student` |
| `student` | student_id, mentor_id, college_id | N:1 with mentor |
| `loan` | loan_id, student_id, investor_id, mentor_approval | N:1 with student |
| `investor` | investor_id | 1:N with loan |

---

## 🧭 Dashboard Access Matrix

| Feature | Student | Mentor | College Admin | Investor |
|----------|----------|--------|----------------|-----------|
| Login | ✅ | ✅ (college portal) | ✅ | ✅ |
| KYC Verification | Submit | Review | Approve | View summary |
| Loan Request | Create | Review small | Approve large | Fund |
| Student Forum | ✅ | View only | View only | ❌ |
| Manage Mentors | ❌ | ❌ | ✅ | ❌ |
| View Repayment | ✅ | ✅ | ✅ | ✅ |
| Add Remarks | ❌ | ✅ | ✅ | ❌ |
| Funding Loans | ❌ | ❌ | ❌ | ✅ |
| Analytics | Personal | My Students | Global | Investment |

---

## 🧠 Key Design Insight
- Mentors are **sub-users within the college ecosystem** — not a separate login.  
- Their permissions are **role-based**, granting access only to student supervision and approvals.  
- This model mirrors **LMS systems**, where mentors act like instructors managing assigned students.  
- The structure ensures transparency, accountability, and a smooth approval workflow for DeFi-based education loans.
```
