FROM node:alpine AS builder
WORKDIR /app
RUN npm install -g serve
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000

CMD ["sh", "-c", "serve -s build -l 5000"]
