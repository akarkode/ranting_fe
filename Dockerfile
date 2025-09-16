# ---------- Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Inject env (opsional → atau pakai workflow echo >> .env)
# ENV VITE_AUTH_URL=https://ranting.akarkode.com/api/auth
# ENV VITE_API_URL=https://ranting.akarkode.com/api/ai

RUN chmod +x node_modules/.bin/vite
RUN npm run build

# ---------- Production stage ----------
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Ganti port ke 8080 agar sesuai Cloud Run
RUN sed -i 's/listen       80;/listen 8080;/' /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
