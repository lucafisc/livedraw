FROM alpine:3.18

RUN apk update && apk add nodejs npm

WORKDIR /app/client

COPY client/package*.json ./

RUN npm install

COPY client/ ./

CMD ["npm", "run", "dev"]