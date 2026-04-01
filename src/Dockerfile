FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --production

COPY server.js ./
COPY public/ ./public/

# These will be mounted as volumes for persistence
RUN mkdir -p /app/data /app/music

EXPOSE 3000

CMD ["node", "server.js"]
