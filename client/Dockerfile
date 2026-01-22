# Gunakan Node.js versi ringan
FROM node:18-alpine

# Set folder kerja
WORKDIR /app

# Copy package.json
COPY package*.json ./

# Install dependencies frontend
RUN npm install

# Copy seluruh sisa kodingan client
COPY . .

# Buka port 3000
EXPOSE 3000

# Jalankan React
CMD ["npm", "start"]