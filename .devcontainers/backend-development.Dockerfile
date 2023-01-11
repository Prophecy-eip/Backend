FROM node:alpine

WORKDIR server-dev

COPY . .

RUN yarn
