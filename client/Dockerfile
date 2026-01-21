# Build Stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Production Stage - Use Nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Clear default nginx static files
RUN rm -rf ./*

# Copy built assets from builder stage
COPY --from=builder /app/dist .

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Script to replace PORT_PLACEHOLDER with real PORT and start nginx
CMD ["/bin/sh", "-c", "sed -i \"s/PORT_PLACEHOLDER/${PORT:-3000}/g\" /etc/nginx/conf.d/default.conf && nginx -g \"daemon off;\""]
