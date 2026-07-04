# Production Stage
FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies (only production)
COPY package*.json ./
RUN npm ci --only=production

# Copy generated Prisma Client and built application
COPY ./prisma ./prisma
RUN npx prisma generate

COPY ./dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
