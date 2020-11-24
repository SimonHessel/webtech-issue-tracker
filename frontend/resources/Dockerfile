### STAGE 1: Build ###

# We label our stage as ‘builder’
FROM node:12 as builder


WORKDIR /app
COPY package.json package-lock.json /app/

RUN npm install

COPY src /app/src
COPY e2e /app/e2e
COPY *.json *.js .browserslistrc /app/

## Build the angular app in production mode and store the artifacts in dist folder
RUN npm run build -- --configuration=production --output-path=dist


### STAGE 2: Setup ###

FROM nginx:1.14.1-alpine
WORKDIR /app/

RUN apk add --no-cache --update \
    apache2-utils

## Copy our default nginx config
COPY resources/nginx.conf /etc/nginx/nginx.conf
COPY resources/site.conf /etc/nginx/sites-enabled/default

# Copy entrypoint.sh
COPY resources/entrypoint.sh /app/resources/entrypoint.sh

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /app/dist /app/dist

ENTRYPOINT ["sh","./resources/entrypoint.sh"]

CMD ["nginx"]