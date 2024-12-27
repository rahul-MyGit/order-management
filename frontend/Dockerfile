FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY . .

RUN npm install && npm run build

FROM node:20-alpine AS runnner

RUN mkdir /.npm && chown -R 1001:1001 /.npm

USER 1001:1001
WORKDIR /usr/src/app

COPY --from=builder --chown=1001:1001 usr/src/app/.next/standalone ./
COPY --from=builder --chown=1001:1001 usr/src/app/.next/static ./.next/static

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node","server.js"]