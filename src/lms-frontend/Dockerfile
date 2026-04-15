# Stage 1: Build
FROM node:18-bullseye AS build

WORKDIR /app

# Accept API URL as a build argument
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV CI=true

COPY package*.json ./
# Deep fix for react-scripts/webpack dependency issues
RUN npm install --legacy-peer-deps && \
    npm install ajv ajv-keywords ajv-formats --save-dev --legacy-peer-deps

COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:stable-alpine

# Copy build files from Stage 1
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
