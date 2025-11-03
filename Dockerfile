FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

# Install backend dependencies
COPY Backend/package.json ./Backend/package.json
RUN cd Backend \
  && npm install --only=production \
  && npm cache clean --force

# Copy backend server
COPY Backend/server.js ./Backend/server.js

# Copy frontend clients (served by backend)
COPY SenderClient/ ./SenderClient/
COPY RecieverClient/ ./RecieverClient/

EXPOSE 8080

CMD ["node", "Backend/server.js"]

