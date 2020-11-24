FROM node:10-alpine AS build-deps
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM build-deps AS src
WORKDIR /app
COPY . .

FROM src AS build
WORKDIR /app
RUN npm run build

FROM build-deps AS prod-deps
WORKDIR /app
RUN npm prune --production

FROM node:10-alpine AS final
# Add minio client to perform admin operation using system call
RUN wget https://dl.min.io/client/mc/release/linux-amd64/mc && \
    chmod +x mc && mv mc /usr/local/bin

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=prod-deps /app/node_modules ./node_modules
EXPOSE 5000
CMD ["node", "dist/server.js"]
