# syntax=docker/dockerfile:1

# ---- Étape 1 : construire le site Angular ----
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx ng build --configuration production \
 && mkdir -p /out \
 && cp -r dist/*/browser/. /out/

# ---- Étape 2 : servir le site avec nginx ----
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /out /usr/share/nginx/html
COPY docker-entrypoint.sh /docker-entrypoint.d/40-contact-config.sh
RUN chmod +x /docker-entrypoint.d/40-contact-config.sh

EXPOSE 80
