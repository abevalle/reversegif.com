FROM node:20-bullseye
LABEL name="reversegif.com"
LABEL version="latest"

RUN npm install -g yarn --force

WORKDIR /var/www/
COPY . .

RUN yarn install

ENTRYPOINT [ "yarn start" ]
CMD ["bash"]

RUN EXIT 0