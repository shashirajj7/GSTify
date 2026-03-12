n# GSTify Filing Companion

GSTify Filing Companion is an AI-powered system that automatically processes GST invoices and extracts structured data for easier GST filing.
The system uses OCR and intelligent parsing to read invoice documents and convert them into usable financial information.

## 🚀 Features

* 📄 Upload GST invoices (images or documents)
* 🔍 Extract invoice details using OCR
* 🤖 AI-assisted invoice parsing
* 📊 Structured invoice data output
* ⚡ Fast and user-friendly web interface

## 🧠 Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS

### Backend

* Python
* OCR Processing
* Invoice Parsing Engine

## 📁 Project Structure

```
GSTify-FilingCompanion
│
├── backend
│   └── py-flask
│       ├── api.py
│       ├── agent.py
│       ├── config.py
│       ├── requirements.txt
│       ├── tools/
│       ├── sample_invoices/
│       └── storage/
│
├── frontend
│   └── gstify-react
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── vite.config.js
│
└── README.md
```

## ⚙️ Installation

### Clone the Repository

```
git clone https://github.com/yourusername/GSTify-FilingCompanion.git
cd GSTify-FilingCompanion
```

### Backend Setup

```
cd backend/hackathonkl
pip install -r requirements.txt
python api.py
```

### Frontend Setup

```
cd frontend/gstify-react
npm install
npm run dev
```

The frontend will run locally and communicate with the backend API.

## 🌐 Deployment

Frontend deployed on **Vercel**
Backend deployed on **Render**

## 📌 Use Case

GSTify helps businesses and accountants automate GST invoice processing by eliminating manual data entry. The system reads invoices and extracts relevant fields required for GST filing.

## 👨💻 Author

Shashi Raj
