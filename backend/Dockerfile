# Build Stage
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Install all dependencies (including dev tools needed for build)
COPY package*.json ./
RUN npm ci

# Copy all source code
COPY . .

# Generate Prisma Client & Build NestJS app
RUN npx prisma generate
RUN npm run build

# Production Stage
FROM node:18-alpine

WORKDIR /usr/src/app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built artifacts from the builder stage
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/dist ./dist

# Re-generate Prisma Client in production environment to ensure OS binary compatibility
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
