FROM node:20-bookworm
LABEL name="reversegif.com"
LABEL version="latest"

WORKDIR /var/www/
COPY . .

RUN yarn install

RUN yarn install
RUN yarn build

ENTRYPOINT [ "yarn start" ]
CMD ["bash"]

RUN EXIT 0