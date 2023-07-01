FROM node:20-bookworm
LABEL name="reversegif.com"
LABEL version="latest"

WORKDIR /var/www/
COPY . .

RUN npm config set "@fortawesome:registry" https://npm.fontawesome.com/
RUN npm config set "//npm.fontawesome.com/:_authToken" C479FDFF-6447-4009-A7BE-006E063376A5
RUN npm install
RUN npm run build

ENTRYPOINT [ "npm run start" ]
CMD ["bash"]

RUN EXIT 0