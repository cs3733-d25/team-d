# Stage 1: Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and Yarn configuration
COPY package.json yarn.lock ./
COPY .yarn .yarn
COPY .pnp.cjs .pnp.loader.mjs ./

# Copy the entire project structure for building
COPY apps apps
COPY packages packages
COPY configs configs
COPY tsconfig.json turbo.json ./

# Enable Yarn Berry
RUN corepack enable

# Install dependencies
RUN yarn install

# Generate Prisma client
RUN yarn workspace database generate


# Accept build-time variables
ARG NODE_ENV
ARG FRONTEND_PORT
ARG BACKEND_PORT
ARG BACKEND_SOURCE
ARG BACKEND_URL
ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG POSTGRES_PORT
ARG POSTGRES_DB
ARG VITE_GOOGLE_MAPS_API_KEY
ARG POSTGRES_HOST

# Make them available at runtime
ENV NODE_ENV=$NODE_ENV \
    FRONTEND_PORT=$FRONTEND_PORT \
    BACKEND_PORT=$BACKEND_PORT \
    BACKEND_SOURCE=$BACKEND_SOURCE \
    BACKEND_URL=$BACKEND_URL \
    POSTGRES_USER=postgres \
    POSTGRES_PASSWORD=MAzl1dukOGzZ1SAaPxZ6 \
    POSTGRES_PORT=5432 \
    POSTGRES_DB=postgres \
    VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY \
    POSTGRES_HOST=softeng-db-1.cf6ck0meqqck.us-east-2.rds.amazonaws.com


# Build the application
RUN yarn build

# Stage 2: Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Accept build-time variables
ARG NODE_ENV
ARG FRONTEND_PORT
ARG BACKEND_PORT
ARG BACKEND_SOURCE
ARG BACKEND_URL

# Make them available at runtime
ENV NODE_ENV=$NODE_ENV \
    FRONTEND_PORT=$FRONTEND_PORT \
    BACKEND_PORT=$BACKEND_PORT \
    BACKEND_SOURCE=$BACKEND_SOURCE \
    BACKEND_URL=$BACKEND_URL

# Copy the entire project structure
COPY --from=builder /app .

# Enable Yarn Berry for production
RUN corepack enable

# Install serve for the frontend
RUN yarn add serve

# Install nginx
RUN apk add --no-cache nginx

# Install envsubst
RUN apk add --no-cache gettext

# Copy nginx configuration
COPY docker/nginx.conf.template /etc/nginx/http.d/template

# Copy start script
COPY docker/start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Start the application
CMD ["/app/start.sh"]
