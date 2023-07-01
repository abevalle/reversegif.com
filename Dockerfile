FROM node:20-bookworm
LABEL nane="reversegif.com"
LABEL version="latest"

RUN apt update -y
RUN npm install -g yarn

WORKDIR /var/www/

RUN yarn config set "@fortawesome:registry" https://npm.fontawesome.com/
RUN yarn config set "//npm.fontawesome.com/:_authToken" C479FDFF-6447-4009-A7BE-006E063376A5
RUN yarn
RUN yarn build
RUN yarn start