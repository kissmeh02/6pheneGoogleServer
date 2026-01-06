import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import MaterialsCatalog from './pages/MaterialsCatalog'
import NewRun from './pages/NewRun'
import PredictionResults from './pages/PredictionResults'
import FormulaManager from './pages/FormulaManager'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/materials" element={<MaterialsCatalog />} />
          <Route path="/new-run" element={<NewRun />} />
          <Route path="/results/:runId" element={<PredictionResults />} />
          <Route path="/formulas" element={<FormulaManager />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App












