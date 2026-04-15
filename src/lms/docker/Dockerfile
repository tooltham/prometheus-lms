FROM ubuntu:26

# Install dependencies
RUN apt-get update && apt-get install -y nodejs npm

# Create working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Expose port and run application
EXPOSE 3000
CMD ["node", "app.js"]
