# ================================================================
# Multi-Stage Production Dockerfile for in.gress Frontend
# ================================================================

FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . ./
RUN npm run build

FROM nginx:alpine AS runner

# Copy compiled SPA dist
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom Nginx config for SPA routing and port 5180
RUN echo 'server { \
  listen 5180; \
  location / { \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    try_files $uri $uri/ /index.html; \
  } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 5180

CMD ["nginx", "-g", "daemon off;"]
