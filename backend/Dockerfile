# Use an official Node.js runtime as a parent image
FROM node:16-alpine

RUN apk add --no-cache make gcc g++ python3

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm rebuild bcrypt --build-from-source

EXPOSE 5000

CMD ["node", "server.js"]