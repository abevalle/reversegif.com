FROM node:18-bookworm
LABEL name="reversegif.com"
LABEL version="latest"

RUN npm install -g yarn --force
ENV PATH "$PATH:/opt/yarn/bin"

WORKDIR /var/www/
COPY . .

