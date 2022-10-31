FROM node:16

WORKDIR /app

COPY . .

RUN yarn

RUN yarn build

EXPOSE 3000

ENV MONGO_IP=mongo

CMD ["yarn", "start"]