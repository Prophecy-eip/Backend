FROM node:alpine

WORKDIR /server/

COPY package.json .

RUN yarn

COPY . .

CMD [ "yarn", "start" ]