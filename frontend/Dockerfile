# syntax=docker/dockerfile:1
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Dev server (geliştirme için)
CMD ["npm", "run", "dev"]
