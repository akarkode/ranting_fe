# ===== Builder =====
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps (frozen lockfile untuk speed & konsistensi)
COPY package*.json ./
RUN npm ci

COPY . .

# Build dengan env
ARG VITE_AUTH_URL
ARG VITE_API_URL
ENV VITE_AUTH_URL=$VITE_AUTH_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ===== Production =====
FROM nginx:alpine

# hapus default config
RUN rm /etc/nginx/conf.d/default.conf

# copy build hasil vite
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# set user non-root
USER nginx

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
