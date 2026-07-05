# Build Stage
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Install all dependencies (including dev tools needed for build)
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Generate Prisma Client & Build NestJS app
RUN npx prisma generate
RUN npm run build

# Production Stage
FROM node:22-alpine

WORKDIR /usr/src/app

# Install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built artifacts from the builder stage
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/dist ./dist

# Copy generated Prisma Client from builder
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
