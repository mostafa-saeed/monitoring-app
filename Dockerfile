FROM node:14-alpine

EXPOSE 3000

RUN mkdir /code && chown node:node /code
WORKDIR /code

COPY --chown=node:node package*.json ./
RUN npm install && npm cache clean --force

COPY --chown=node:node . .

USER node

CMD ["node", "--tls-min-v1.0", "src/app.js"]
