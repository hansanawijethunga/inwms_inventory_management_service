# Use official Node.js LTS image
FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production=false

# Copy source code
COPY . ./

# Build TypeScript
RUN npm run build

# --- Production image ---
FROM node:20-alpine as prod
WORKDIR /app

# Copy only necessary files from build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

# Expose port (default 3000)
EXPOSE 3000

# Start the app
CMD ["node", "dist/index.js"]
