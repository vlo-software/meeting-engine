FROM node:16

WORKDIR /app

COPY . .

RUN yarn

RUN yarn build

EXPOSE 3000

ENV MONGO_IP=mongo

RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt-get -y install tzdata

CMD ["yarn", "start"]