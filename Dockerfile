FROM node:20-alpine

RUN apk update && \
    apk upgrade -U && \
    apk add --no-cache libwebp-tools && \
    rm -rf /var/cache/*

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY index.js .

EXPOSE 3000

CMD ["node", "index.js"]
