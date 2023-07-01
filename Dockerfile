FROM node:20-bookworm
LABEL nane="reversegif.com"
LABEL version="latest"

RUN apt update -y
RUN npm install --production
RUN npm install -g yarn

WORKDIR /var/www/

RUN yarn
RUN yarn build
RUN yarn start