FROM node:18-bookworm
LABEL name="reversegif.com"
LABEL version="latest"

WORKDIR /var/www/
COPY . .
RUN npm install -g yarn --force && yarn install && yarn build

ENTRYPOINT [ "yarn start" ]
