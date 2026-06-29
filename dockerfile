# ---- Build Stage ----
FROM node:22-alpine AS builder

WORKDIR /app

# Accept build-time arguments
ARG VITE_API_BASE_URL
ARG VITE_APP_NAME

# Expose them as environment variables so Vite can inline them during build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_APP_NAME=$VITE_APP_NAME

# Copy package files first to leverage Docker layer caching
COPY package.json package-lock.json* ./

# Install all dependencies (devDependencies needed for build)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the application (tsc + vite build)
RUN npm run build

# ---- Production Preview Stage ----
FROM node:22-alpine

WORKDIR /app

# Copy package files to install only production dependencies + vite
COPY package.json package-lock.json* ./

# Install only production dependencies, then add vite (needed for preview)
RUN npm ci --production && npm install vite

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist

# Vite preview listens on port 4173 by default
EXPOSE 4173

# Start the preview server; --host allows connections from outside the container
CMD ["npx", "vite", "preview", "--host", "--port", "4173"]
