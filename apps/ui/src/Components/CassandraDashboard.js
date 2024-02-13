import React, { useState, useEffect } from 'react';

function CassandraDashboard() {
  const [healthStatus, setHealthStatus] = useState('');

  useEffect(() => {
    fetchHealthStatus();
  }, []);

  const fetchHealthStatus = () => {
    fetch(`${process.env.REACT_APP_API_END_POINT}/api/health`)
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
