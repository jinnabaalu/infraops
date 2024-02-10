import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Form, Button, Table, Container, Card } from 'react-bootstrap';

function CassandraQuery() {
  const [contactPoints, setContactPoints] = useState([]);
  const [selectedDC, setSelectedDC] = useState('');
  const [selectedContactPoint, setSelectedContactPoint] = useState('');
  const [keyspaces, setKeyspaces] = useState([]);
  const [selectedKeyspace, setSelectedKeyspace] = useState('');
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState([]);
  const [error, setError] = useState(null);

  const isSelectQuery = (query) => {
    const selectPattern = /^\s*SELECT/i; // Case-insensitive match for SELECT at the beginning

    return selectPattern.test(query);
  };

  const handleQueryChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (isSelectQuery(newQuery)) {
      console.log('Valid SELECT query');
    } else {
      console.log('Not a valid SELECT query');
    }
  };
  const isExecuteButtonDisabled = () => {
    return !selectedDC || !selectedContactPoint || !selectedKeyspace || !query;
  };

  const memoizedFetchContactPoints = useCallback(() => {
    fetchContactPoints();
  }, []);

  useEffect(() => {
    memoizedFetchContactPoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoizedFetchContactPoints]);

  const fetchContactPoints = () => {
    fetch('http://localhost:5555/cassandra/api/contactPoints')
      .then((response) => response.json())
      .then((data) => {
        setContactPoints(data.contact_points);

        if (data.contact_points.length > 0) {
          setSelectedContactPoint(data.contact_points[0].hosts[0]);
          fetchKeyspaces(data.contact_points[0].hosts[0]); // Fetch keyspaces with the default contact point
        } else {
          setSelectedContactPoint('');
          setKeyspaces([]);
          setSelectedKeyspace('');
        }
      })
      .catch((error) => {
        setError('Error fetching contact points.');
      });
  };

  const fetchKeyspaces = (selectedContactPoint) => {

    if (selectedContactPoint) {
      const requestBody = {
        contact_points: [selectedContactPoint],
      };

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      };

      fetch('http://localhost:5555/cassandra/api/keyspaces', requestOptions)
        .then((response) => response.json())
        .then((data) => {
          setKeyspaces(data.keyspaces);
          setSelectedKeyspace('');
        })
        .catch((error) => {
          setError('Error fetching keyspaces.');
        });
    }
  };

  const executeQuery = () => {
    if (selectedKeyspace && query && selectedContactPoint) {
      const requestBody = {
        query: query,
        keyspace: selectedKeyspace,
        contact_points: [selectedContactPoint],
      };
      fetch('http://localhost:5555/cassandra/api/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          setResponse(data);
          setError(null);
        })
        .catch((error) => {
          setResponse([]);
          setError('Error executing the query.');
        });
    }
  };

  return (
    <Container>
      <Row>
        <Col md={12}>
          <h4>Cassandra CQL Query</h4>
          <hr></hr>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <Form.Group controlId="formDataCenter">
            <Form.Control
              as="select"
              value={selectedDC}
              onChange={(e) => {
                setSelectedDC(e.target.value);
              }}
            >
              <option value="">Select Data Center</option>
              {contactPoints.map((dc) => (
                <option key={dc.dc} value={dc.dc}>
                  {dc.dc}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Control
            as="select"
            value={selectedContactPoint}
            onChange={(e) => {
              setSelectedContactPoint(e.target.value);
              fetchKeyspaces(e.target.value);
            }}
          >
            <option value="">Select Contact Point</option>
            {(contactPoints.find((dc) => dc.dc === selectedDC) || { hosts: [] }).hosts.map((cp) => (
              <option key={cp} value={cp}>
                {cp}
              </option>
            ))}
          </Form.Control>
        </Col>
        <Col md={3}>
          <Form.Group controlId="formKeyspace">
            <Form.Control
              as="select"
              value={selectedKeyspace}
              onChange={(e) => setSelectedKeyspace(e.target.value)}>
              <option value="">Select Keyspace</option>
              {keyspaces.map((ks) => (
                <option key={ks} value={ks}>
                  {ks}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Button variant="primary" onClick={executeQuery} disabled={isExecuteButtonDisabled()}>
            Execute Query
          </Button>
        </Col>
      </Row>
      <br></br>
      <Row>
        <Col md={12}>
          <Form>
            <Form.Group controlId="formQuery">
              <Form.Control
                as="textarea"
                rows={2}
                value={query}
                onChange={handleQueryChange}
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card>
            <Card.Body>
              {error && <div style={{ color: 'red' }}>{error}</div>}
              {response.length > 0 ? (
                <small>
                  <Table striped bordered hover>
                    <thead style={{ backgroundColor: '#007bff', color: 'white' }}>
                      <tr>
                        {Object.keys(response[0]).map((key) => (
                          <th key={key}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {response.map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value, index) => (
                            <td key={index}>{value}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </small>
              ) : (
                <div className="text-center">No data available</div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CassandraQuery;
