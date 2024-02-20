
curl -X POST \
  http://localhost:8081/api/cassandra/contactPoints \
  -H 'Content-Type: application/json' \
  -d '{}'

curl: (6) Could not resolve host: your-api-url

curl -X POST http://localhost:8081/api/cassandra/keyspaces \
-H "Content-Type: application/json" \
-d '{"contactPoints":["127.0.0.1"],"dataCenter":"staging"}'

curl -X POST http://localhost:8081/api/cassandra/getTablesByKeyspace \
-H "Content-Type: application/json" \
-d '{
  "contactPoints": ["127.0.0.1"],
  "dataCenter": "staging",
  "keyspace": "ecommerce_data",
  "query": "SELECT table_name FROM system_schema.tables WHERE keyspace_name = 'ecommerce_data'"
}'


curl -X POST http://localhost:8081/api/cassandra/executeSelectQuery \
-H "Content-Type: application/json" \
-d '{
  "contactPoints": ["127.0.0.1"],
  "dataCenter": "staging",
  "keyspace": "ecommerce_data",
  "query": "SELECT * FROM product01"
}'
