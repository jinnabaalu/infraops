FROM node:18.19.0

ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /usr/src/infraops

COPY package.json ./

COPY ./apps/api/package.json ./apps/api/package.json
COPY ./apps/docs/package.json ./apps/docs/package.json
COPY ./apps/ui/package.json ./apps/ui/package.json
COPY ./apps/web/package.json ./apps/web/package.json
COPY ./packages ./

RUN npm install 

COPY . .

RUN npm run build

EXPOSE 3000
EXPOSE 8080
CMD ["npm", "run", "dev"]