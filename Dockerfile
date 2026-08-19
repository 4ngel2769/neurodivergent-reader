# Build stage
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package.json bun.lock ./

# Install all dependencies (including devDependencies needed for build)
RUN bun install --frozen-lockfile

# Copy application source code
COPY . .

# Build SvelteKit application
RUN bun run build

# Production runtime stage
FROM oven/bun:1-alpine AS runner

WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV DATA_DIR=/app/data
ENV BODY_SIZE_LIMIT=100M

# Copy built bundle and minimal package configuration
COPY --from=builder /app/package.json ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules

# Create persistent storage directory for Markdown files
RUN mkdir -p /app/data

# Expose reader web port
EXPOSE 3000

# Run with Bun native runtime
CMD ["bun", "./build/index.js"]
