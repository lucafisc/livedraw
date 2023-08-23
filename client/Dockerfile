FROM alpine:latest

RUN apk update && apk add nodejs npm

WORKDIR /app/client

COPY client/package*.json ./

RUN npm install

COPY client/ ./

CMD ["npm", "run", "dev"]