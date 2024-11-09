
![Group 61](https://github.com/user-attachments/assets/abc40d7f-3a8a-4dd1-b2a9-e2cc5f394ec0)
# CryptoSecure

---

## 🚀 Project Overview

With the rise of cryptocurrency transactions, protecting users from fraudulent activities has become increasingly critical. **CryptoSecure** helps achieve this by assigning each wallet a **safety score**, a metric that reflects the likelihood of a wallet being involved in suspicious behavior. This score enables users and platforms to assess the risk associated with specific wallets before engaging in transactions.

---

## ⚙️ Working Methodology

CryptoSecure uses a combination of **Supervised** and **Unsupervised Machine Learning** approaches:

- **Supervised ML**: Using **XGBoost**, a highly accurate gradient boosting algorithm, to detect anomalies and high-risk patterns associated with scams.
- **Unsupervised ML**: Using **Auto-Encoders** to identify suspicious wallet behaviors that deviate from normal transaction patterns.

The model processes wallet and transaction data to calculate a **safety score** for each wallet, representing the probability that the wallet is connected to scams or phishing schemes.

---

## 🧰 Tech Stack

### Machine Learning
- **XGBoost**: Supervised learning algorithm for precise anomaly detection.
- **Auto-Encoders**: Unsupervised model to capture irregular patterns in transactions.

### Backend
- **MongoDB**: A NoSQL database to store wallet and transaction information.
- **FastAPI**: A high-performance API framework for handling backend operations.
- **Redis**: Caching layer to boost the performance of frequently accessed data.

### Frontend
- **ReactJS**: Interactive UI for displaying wallet safety scores and transaction histories.
- **TailwindCSS, ShadCN, Aceternity UI**: CSS frameworks and libraries for a modern, responsive, and user-friendly design.

---

## 🌟 Key Features

1. **Safety Score Calculation**: CryptoSecure generates a **safety score** for each wallet, indicating the probability of it being involved in scams or phishing.
2. **Anomaly Detection**: The system flags wallets that exhibit unusual transaction patterns based on supervised and unsupervised machine learning models.
3. **Real-Time API**: FastAPI provides endpoints for querying wallet safety scores and transaction details, with Redis caching to optimize response times.
4. **User-Friendly Interface**: Intuitive and accessible UI for users to check the safety scores of wallets before making transactions.

---

## 🛠️ Installation & Setup

### Prerequisites

- **Python 3.8+**
- **Node.js** and **npm**

### Installation Steps

1. **Clone repository**:
   ```bash
   git clone https://github.com/harsh3dev/htfHackermen
   cd CryptoSecure
   ```
2. **Setting up Backend**
   - **Dependency installation**
   ```bash
   pip install -r backend/requirements.txt
   ```
   - **Start Server**
   ```bash
   uvicorn backend.main:app --reload
   ```
3. **Setting up Frontend**
   - **Navigation**
     ```bash
     cd frontend
     ```
   - **Install dependency**
     ```bash
     npm install
     ```
   - **Start server**
     ```bash
     npm run dev
     ```
