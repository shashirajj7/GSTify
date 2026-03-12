# GSTify AI – Frontend

Frontend application for **GSTify AI**, an AI-powered GST invoice processing platform designed to automate invoice extraction, validation, and compliance for Indian MSMEs.

This frontend provides a modern SaaS-style dashboard where users can upload invoices, view AI extraction results, monitor compliance scores, detect fraud risks, and export GSTR-1 drafts.

---

## 🚀 Features

* 📊 Modern SaaS Dashboard
* 📤 Invoice Upload Interface
* 🤖 AI Extraction Results Display
* 🧾 GST Validation & Compliance View
* 🚨 Fraud Detection Indicators
* 📁 GSTR-1 CSV Export Interface
* ⚡ Fast React UI with Vite
* 🎨 Tailwind CSS based responsive design

---

## 🛠 Tech Stack

* **React** – UI framework
* **Vite** – Fast frontend build tool
* **Tailwind CSS** – Styling framework
* **JavaScript (ES6+)**
* **Axios / Fetch API** – Backend communication

---

## 📂 Project Structure

```
frontend/
│
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Application pages
│   ├── assets/         # Images & icons
│   ├── App.jsx         # Main application component
│   └── main.jsx        # Entry point
│
├── index.html          # Root HTML file
├── package.json        # Project dependencies
├── tailwind.config.js  # Tailwind configuration
├── vite.config.js      # Vite configuration
└── README.md
```

---

## ⚙️ Installation

Clone the repository:

```
git clone https://github.com/your-username/gstify-ai.git
```

Navigate to the frontend directory:

```
cd gstify-ai/frontend
```

Install dependencies:

```
npm install
```

---

## ▶️ Running the Development Server

Start the local development server:

```
npm run dev
```

The application will run at:

```
http://localhost:5173
```

---

## 📦 Build for Production

To create a production build:

```
npm run build
```

The optimized files will be generated in the **dist/** folder.

---

## 🌐 Deployment

The frontend can be deployed easily using **Vercel**.

Steps:

1. Push the repository to GitHub
2. Import the project into Vercel
3. Set the **root directory** as:

```
frontend
```

4. Deploy

---

## 🔗 Backend API

This frontend communicates with the **GSTify AI Flask backend** for:

* Invoice upload
* AI data extraction
* GST validation
* Fraud detection
* CSV export

Example API endpoint:

```
POST /api/process-invoice
```

---

## 👨‍💻 Author

**Shashi Raj**

AI Developer | Building tools to automate compliance and financial workflows for Indian businesses.

---


