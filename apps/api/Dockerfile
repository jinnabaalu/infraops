FROM node:18 AS builder
ENV CASSANDRA_CONTACT_POINTS=/usr/src/config/cassandra.yml
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
