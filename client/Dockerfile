# Build Stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production Stage
FROM node:22-alpine AS runner

WORKDIR /app

# Install serve to run the static site
RUN npm install -g serve

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Start the app using the PORT environment variable provided by Railway
CMD ["sh", "-c", "serve -s dist -l ${PORT:-3000}"]
