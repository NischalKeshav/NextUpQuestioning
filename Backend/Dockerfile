FROM node:24-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY server.js ./

# Expose WebSocket port
EXPOSE 8080

# Start the server
CMD ["npm", "start"]

