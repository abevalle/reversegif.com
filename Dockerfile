FROM ubuntu:20.04
LABEL name="reversegif.com"
LABEL version="latest"

SHELL ["/bin/bash", "--login", "-c"]
RUN apt update -y && apt upgrade -y
RUN apt install curl -y
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
RUN bash && nvm install
RUN npm install -g yarn


WORKDIR /var/www/
COPY . .

RUN yarn install --lts

RUN yarn install
RUN yarn build

ENTRYPOINT [ "yarn start" ]
CMD ["bash"]

RUN EXIT 0