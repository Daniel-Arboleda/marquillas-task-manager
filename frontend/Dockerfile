FROM node:22-alpine AS builder
LABEL org.opencontainers.image.title="Marquillas Task Manager Frontend"
LABEL org.opencontainers.image.vendor="Nexo Software Factory"
LABEL org.opencontainers.image.authors="Daniel Arboleda"
LABEL org.opencontainers.image.version="0.2.0"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.29-alpine
LABEL org.opencontainers.image.title="Marquillas Task Manager Frontend"
LABEL org.opencontainers.image.vendor="Nexo Software Factory"
LABEL org.opencontainers.image.authors="Daniel Arboleda"
LABEL org.opencontainers.image.version="0.1.0"

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx","-g","daemon off;"]