FROM node:8.9.4-alpine

ADD . app
WORKDIR app

RUN npm install

EXPOSE 3000
CMD [ "node", "index.js" ]