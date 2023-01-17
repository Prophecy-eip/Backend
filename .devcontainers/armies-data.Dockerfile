FROM node:alpine

WORKDIR armies-data

COPY scripts/armies_data .

RUN ["yarn"]

CMD ["yarn", "start"]
