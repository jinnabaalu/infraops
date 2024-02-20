import React, { useState, useEffect } from 'react';
import { API_ENDPOINT } from '../config';

const healthApi = `${API_ENDPOINT}/api/health`;

function CassandraDashboard() {
  const [healthStatus, setHealthStatus] = useState('');

  useEffect(() => {
    fetchHealthStatus();
  }, []);

  const fetchHealthStatus = () => {
    fetch(healthApi)
      .then(response => response.json())
      .then(data => {
        setHealthStatus(data.status);
      })
      .catch(error => console.error('Error fetching health status:', error));
  };

  return (
    <div>
      <h2>Cassandra</h2>
      <hr></hr>
      <p>Health Status: {healthStatus}</p>
    </div>
  );
}

export default CassandraDashboard;
