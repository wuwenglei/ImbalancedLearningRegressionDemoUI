FROM node:18

LABEL maintainer="Wenglei Wu"

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build

ARG DEFAULT_PORT=3000

ENV PORT $DEFAULT_PORT

EXPOSE $PORT

ARG DEFAULT_API_BASE_URL=http://localhost:8080/

ENV API_BASE_URL $DEFAULT_API_BASE_URL

CMD ["npm", "run", "start"]

# docker build -t wuwenglei/iblr-demo-ui:latest .
# docker push wuwenglei/iblr-demo-ui:latest