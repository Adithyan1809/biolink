# Multi-stage production container for Adithyan's Full-Stack Biolink
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Final lightweight runner image
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy node modules from builder
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Copy application source files
COPY server.js ./
COPY index.html style.css script.js config.js ./
COPY assets ./assets
COPY data ./data

# Expose server port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start full-stack production server
CMD ["node", "server.js"]
