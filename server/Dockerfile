FROM alpine:3.18

RUN apk update && apk add nodejs npm

WORKDIR /app/server

COPY server/package*.json ./

RUN npm install

COPY server/ ./

CMD ["npm", "run", "server"]
