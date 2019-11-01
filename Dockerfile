FROM node:8
RUN apt-get update -y && apt-get upgrade -y
RUN mkdir /app
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8000
ENTRYPOINT ["node", "/app/server.js"]
