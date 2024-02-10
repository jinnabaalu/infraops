import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Layout/Header';
import Footer from './Components/Layout/Footer';
import Dashboard from './Components/Dashboard';
import CassandraDashboard from './Components/CassandraDashboard';
import CassandraQuery from './Components/CassandraQuery';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <div className="container-fluid flex-grow-1">
          <Header />
          <div className="row">
            <div className="col-12 d-flex flex-column align-items-center mt-5">
              {/* Center the content */}
              <Routes>
                <Route path="/cassandra" element={<CassandraDashboard />} />
                <Route path="/cassandra/cql" element={<CassandraQuery />} />
                <Route path="/" element={<Dashboard />} />
              </Routes>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
