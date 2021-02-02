FROM node:14-alpine AS build-deps
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

FROM node:14-alpine AS final
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/dist .
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/package.json ./package.json
EXPOSE 5000
CMD ["npm", "run", "start:prod"]
