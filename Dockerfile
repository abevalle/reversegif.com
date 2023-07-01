FROM node:18-bookworm
LABEL name="reversegif.com"
LABEL version="latest"

RUN npm install -g yarn --force

WORKDIR /var/www/
COPY . .

RUN yarn install

ENTRYPOINT [ "yarn start" ]
CMD ["bash"]
