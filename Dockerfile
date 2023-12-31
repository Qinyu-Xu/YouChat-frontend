# Stage 0: build
FROM node:18 AS build

ENV FRONTEND=/opt/frontend

WORKDIR $FRONTEND

RUN yarn config set registry https://registry.npmmirror.com

COPY . .

RUN yarn install

RUN yarn build

RUN yarn export

# Stage1: build nginx container
FROM nginx:1.22

ENV HOME=/opt/app

WORKDIR $HOME

COPY --from=build /opt/frontend/out dist

COPY nginx /etc/nginx/conf.d

EXPOSE 80
