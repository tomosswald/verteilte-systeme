FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY ./src .

EXPOSE 8080

CMD [ "node", "index.js" ]