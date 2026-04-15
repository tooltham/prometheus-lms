FROM node:18-alpine

# Install build dependencies for bcrypt and other native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies (production only for final image)
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Ensure the uploads directory exists
RUN mkdir -p uploads

EXPOSE 3000

# Use a non-root user for security
USER node

CMD ["node", "server.js"]