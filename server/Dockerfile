# --------- Stage: Production ---------
FROM node:20-alpine

# Create app directory inside the container
WORKDIR /app

# Copy package files FIRST (for better caching)
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of your source code
COPY . .

# Your server.js listens on this port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]