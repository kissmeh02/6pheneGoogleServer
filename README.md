# 6phene Google Server

[![Production Status](https://img.shields.io/badge/status-production-brightgreen.svg)](https://github.com/kissmeh02/6pheneGoogleServer)
[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)
[![Author](https://img.shields.io/badge/author-Kavan%20Kissoon-orange.svg)](https://github.com/kissmeh02)

## Overview

**6phene Google Server** is a comprehensive enterprise-grade platform hosted on Google Cloud Platform (GCP), featuring multiple integrated applications for advanced materials research, business operations, and web presence management.

This repository contains the complete production codebase for the 6phene technology ecosystem, including graphene composite simulation tools, modern invoicing systems, and the corporate web presence.

---

## 🏗️ Architecture

```
6pheneGoogleServer/
├── graphene_composite_simulator/    # AI-Powered Materials Research Platform
│   ├── backend/                     # FastAPI Python Backend
│   └── frontend/                    # React + TypeScript + Tailwind UI
├── modern-invoice-system/           # Enterprise Invoicing Solution
├── webpage/                         # 6phene Corporate Website
└── docs/                            # Technical Documentation
```

---

## 🚀 Applications

### 1. Graphene Composite Simulator
An advanced machine learning-powered platform for predicting and optimizing graphene-enhanced composite material properties.

**Key Features:**
- Real-time property prediction using ML models
- Formula management and optimization
- Materials catalog with supplier integration
- Comprehensive run history and analytics
- RESTful API for third-party integrations

**Tech Stack:**
- Backend: Python 3.12, FastAPI, SQLite, Scikit-learn
- Frontend: React 18, TypeScript, Tailwind CSS, Vite

### 2. Modern Invoice System
A full-featured invoicing and billing management system designed for enterprise use.

**Key Features:**
- Customer and invoice management
- PDF generation and export
- Payment tracking
- Dashboard analytics

### 3. 6phene Corporate Website
A modern, responsive corporate website showcasing 6phene's graphene technology solutions.

**Key Features:**
- Product catalog and technology showcase
- Customer portal with authentication
- Contact and inquiry management
- SEO-optimized static pages

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Python 3.12, FastAPI, SQLAlchemy |
| **Frontend** | React 18, TypeScript, Tailwind CSS |
| **Database** | SQLite (Development), PostgreSQL (Production) |
| **Build Tools** | Vite, npm |
| **Server** | Nginx, Uvicorn |
| **Cloud** | Google Cloud Platform (GCP) |
| **CI/CD** | GitHub Actions |

---

## 📦 Installation

### Prerequisites
- Python 3.12+
- Node.js 20+
- npm 10+
- Git

### Quick Start

```bash
# Clone the repository
git clone https://github.com/kissmeh02/6pheneGoogleServer.git
cd 6pheneGoogleServer

# Backend Setup (Graphene Simulator)
cd graphene_composite_simulator/backend
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python seed_data.py
uvicorn app.main:app --reload

# Frontend Setup (in a new terminal)
cd graphene_composite_simulator/frontend
npm install
npm run dev
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the appropriate directories:

```env
# Backend Configuration
DATABASE_URL=sqlite:///./app.db
SECRET_KEY=your-secret-key
DEBUG=false

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:8000
```

---

## 📚 Documentation

- [Improvement Guide](IMPROVEMENT_GUIDE.md) - Future enhancement roadmap
- [Optimization Report](OPTIMIZATION_REPORT.md) - Performance optimization details
- [UX/UI Rating Report](UX_UI_RATING_REPORT.md) - User experience assessment

---

## 🚢 Deployment

This application is deployed on Google Cloud Platform with the following configuration:

- **Compute**: Google Compute Engine (Ubuntu 24.04 LTS)
- **Web Server**: Nginx (reverse proxy)
- **Application Server**: Uvicorn (ASGI)
- **SSL**: Let's Encrypt certificates

### Production Deployment

```bash
# Pull latest changes
git pull origin main

# Restart services
sudo systemctl restart nginx
sudo systemctl restart graphene-simulator
```

---

## 👤 Author

**Kavan Kissoon**  
*Software Developer*

- GitHub: [@kissmeh02](https://github.com/kissmeh02)
- Email: kavankissoon@gmail.com

---

## 📄 License

This project is proprietary software. All rights reserved.

Copyright © 2024-2025 6phene Technologies. Unauthorized copying, modification, or distribution of this software is strictly prohibited.

---

## 🤝 Contributing

This is a private repository. For contribution inquiries, please contact the author directly.

---

## 📊 Project Status

| Module | Status | Version |
|--------|--------|---------|
| Graphene Simulator | ✅ Production | 1.0.0 |
| Invoice System | ✅ Production | 1.0.0 |
| Corporate Website | ✅ Production | 1.0.0 |

---

*Last Updated: November 2025*

