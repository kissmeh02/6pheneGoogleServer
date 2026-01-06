# Graphene Composite Simulator

A full-stack web application to predict how adding graphene to base materials affects their mechanical, thermal, and electrical properties.

## Features

- **Dark-themed, modern frontend** with React + Tailwind CSS
- **Editable mathematical formulas** for predictions
- **Database of base materials** and **supplier catalog** (graphene, fibers) — seeded with Canadian suppliers
- **Input forms** for material properties and process parameters
- **Physics-based prediction engine** (Rule of Mixtures, Halpin-Tsai, etc.)
- **Visualization** with charts (Recharts)
- **Export** functionality (CSV, PDF)
- **Persistence** (save / load materials and runs)

## Tech Stack

- **Backend**: Python + FastAPI
- **Database**: SQLite (for prototype)
- **Frontend**: React + TypeScript + Tailwind CSS (dark mode)
- **Formula parsing**: sympy (Python)
- **Charting**: Recharts
- **Export**: jsPDF for PDF, built-in CSV export

## Setup

### Backend

```bash
cd graphene_composite_simulator/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python seed_data.py  # Seed initial data
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd graphene_composite_simulator/frontend
npm install
npm run dev
```

The frontend will run on http://localhost:3001

## Project Structure

```
graphene_composite_simulator/
├── backend/
│   ├── app/
│   │   ├── models.py          # SQLModel data models
│   │   ├── database.py        # Database setup
│   │   ├── main.py           # FastAPI app
│   │   ├── prediction_engine.py  # Physics-based predictions
│   │   └── routers/          # API endpoints
│   ├── requirements.txt
│   └── seed_data.py         # Initial data seeding
└── frontend/
    ├── src/
    │   ├── components/       # React components
    │   ├── pages/           # Page components
    │   ├── services/        # API client
    │   └── App.tsx          # Main app
    └── package.json
```

## API Endpoints

- `GET /api/materials` - List materials
- `POST /api/materials` - Create material
- `GET /api/materials/graphene-specs` - List graphene specs
- `GET /api/runs` - List composite runs
- `POST /api/runs` - Create new run
- `POST /api/predictions/calculate/{run_id}` - Calculate predictions
- `GET /api/formulas` - List formulas
- `POST /api/formulas` - Create formula

## Pages

1. **Dashboard** - Overview, recent runs, quick actions
2. **Materials Catalog** - Manage base materials and graphene specs
3. **New Composite Run** - Create new prediction run
4. **Prediction Results** - View results with charts and export
5. **Formula Manager** - Edit prediction formulas

## Dark Theme Colors

- Background: `#121212`
- Panels: `#1E1E1E`
- Text: `#E0E0E0`
- Accent: `#BB86FC` (purple)
- Accent 2: `#03DAC6` (cyan)












