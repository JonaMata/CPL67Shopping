FROM node:latest AS build
ARG meteorVersion

RUN apt-get update && apt-get install -y curl bash
RUN curl "https://install.meteor.com/?release=$meteorVersion" | sh

WORKDIR /usr/src/app
COPY ./.meteor ./.meteor
COPY ./tests ./tests
COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./server ./server
COPY ./client ./client
COPY ./imports ./imports
ENV METEOR_ALLOW_SUPERUSER=true
RUN meteor npm install
RUN meteor build build --directory


ARG nodeVersion=latest
FROM node:12.16.1

WORKDIR /var/src/app
COPY --from=build /usr/src/app/build/bundle ./
RUN cd programs/server && npm install

ENV PORT 8080
EXPOSE 8080
CMD ["node", "main.js"]