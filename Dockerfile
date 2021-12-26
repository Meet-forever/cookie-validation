FROM alpine:latest

RUN apk add --update-cache nodejs npm
WORKDIR /app

COPY package.json .
RUN npm install
COPY . .

CMD [ "npm", "start" ]