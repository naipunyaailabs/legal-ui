# Lexi-Flow Legal Platform

An AI-powered legal intelligence platform with ASK, INTERACT, and DRAFT capabilities.

## Features

- **ASK**: Get comprehensive legal research with IRAC-formatted analysis
- **INTERACT**: Upload and analyze legal documents with AI-powered insights
- **DRAFT**: Generate professional legal documents with AI assistance

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Python 3.12 (for backend)

## Installation

1. Install frontend dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode

To run the frontend:
```bash
npm run dev
```

This will start:
- Frontend on http://localhost:5173

### Running the Backend

The frontend application requires the backend API to function properly. You can run the backend in two ways:

#### Option 1: Automated Setup (Recommended)

From the root project directory:
```bash
python run_application.py
```

This script will automatically:
1. Set up the Python virtual environment
2. Install backend dependencies
3. Install frontend dependencies
4. Start both backend and frontend servers

#### Option 2: Manual Setup

1. Navigate to the backend directory:
   ```bash
   cd ../backend
   ```

2. Create a virtual environment with Python 3.12:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Start the backend API:
   ```bash
   python api.py
   ```

The backend will run on http://localhost:5000 by default.

## Project Structure

```
.
├── src/                     # Frontend source code
│   ├── components/          # React components
│   ├── pages/               # Page components
│   ├── services/            # API service clients
│   ├── types/               # TypeScript types
│   └── lib/                 # Utility functions
├── public/                  # Static assets
└── ...
```

## Development

### Frontend

The frontend is built with:
- React + TypeScript
- Vite
- Tailwind CSS
- Shadcn UI components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request