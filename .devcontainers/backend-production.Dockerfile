FROM node:alpine
#
WORKDIR server
#
COPY src src
COPY package.json .
COPY .env .
COPY tsconfig.build.json .
COPY tsconfig.json .
COPY yarn.lock .

RUN ["yarn"]
RUN ["yarn", "prebuild"]
RUN ["yarn", "build"]

CMD ["yarn", "start:prod"]
