FROM bitnami/node:12 AS builder

COPY package*.json /app/
WORKDIR /app
RUN ["npm", "install"]

COPY . /app
RUN ["npm", "run", "compile_production" ]
RUN ["npm", "prune","--production"]


FROM bitnami/node:12-prod AS production
ENV NODE_ENV="production"
ENV PORT=8000

RUN ["adduser", "web", "--disabled-password"]

COPY --chown=web:web --from=builder /app /app
USER web
WORKDIR /app

RUN /bin/mkdir -p /home/web/tmp/public
RUN /bin/cp -r ./public /home/web/tmp/public
RUN /usr/bin/touch /home/web/tmp/.updatePublic

EXPOSE 8000

CMD ["node", "index.js"]
