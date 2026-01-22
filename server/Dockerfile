# Gunakan Node.js versi ringan
FROM node:18-alpine

# Set folder kerja di dalam container
WORKDIR /app

# Copy file package.json dulu (biar cache installnya awet)
COPY package*.json ./

# Install dependencies backend
RUN npm install

# Copy folder prisma (penting buat database)
COPY prisma ./prisma/

# Generate Client Prisma
RUN npx prisma generate

# Copy seluruh sisa kodingan server
COPY . .

# Buka port 5000
EXPOSE 5000

# Jalankan server
CMD ["npm", "start"]