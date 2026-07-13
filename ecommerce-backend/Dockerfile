FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install

# Copy Prisma schema and generate client before copying rest of the app
COPY prisma ./prisma
RUN npx prisma generate

# Copy everything else
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]