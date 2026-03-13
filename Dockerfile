# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# We copied dependency files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the source code
COPY . .

# The build command is required to compile TypeScript and prepare the app for production
RUN node ace build

# Stage 2: Runtime
FROM node:24-alpine

WORKDIR /app
ENV NODE_ENV=production

# Copy what we need from the builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

EXPOSE 3333

# The server starts from build/bin/server.js
CMD ["node", "build/bin/server.js"]
