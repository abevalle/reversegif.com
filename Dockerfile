FROM ubuntu:20.04
LABEL name="reversegif.com"
LABEL version="latest"

RUN apt update -y && apt upgrade -y
RUN apt install curl -y
# RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
# RUN . ~/.nvm/nvm.sh
RUN apt install node
RUN npm install -g yarn


WORKDIR /var/www/
COPY . .

RUN yarn install --lts

RUN yarn install
RUN yarn build

ENTRYPOINT [ "yarn start" ]
CMD ["bash"]

RUN EXIT 0