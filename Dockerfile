FROM bitnami/node:12 AS builder

COPY package*.json /app/
WORKDIR /app
RUN ["npm", "install"]

COPY . /app
RUN npm run compile_production && \
  npm prune --production

FROM node:lts-alpine AS production
ENV NODE_ENV="production"
ENV PORT=8000

RUN adduser web --disabled-password
USER web
RUN /bin/mkdir -p /home/web/tmp/public

COPY --chown=web:web --from=builder /app /app
WORKDIR /app

RUN /bin/cp -r ./public /home/web/tmp/public && \
  /bin/touch /home/web/tmp/.updatePublic

EXPOSE 8000

CMD ["node", "index.js"]
