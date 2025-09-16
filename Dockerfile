# ===== Builder =====
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_AUTH_URL
ARG VITE_API_URL
ENV VITE_AUTH_URL=$VITE_AUTH_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ===== Production =====
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

RUN sed -i 's/listen       80;/listen 8080;/' /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
