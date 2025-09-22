# Multi-stage build for Node.js application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Run tests in build stage
RUN npm test

# Production stage with distroless image for security
FROM gcr.io/distroless/nodejs22-debian12 AS production

WORKDIR /app

# Copy only production files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/app.js ./
COPY --from=builder /app/node_modules ./node_modules

# Distroless images don't have shell, so we can't create users
# They run as non-root by default

EXPOSE 3000

# Health check using node directly
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["app.js"]
