FROM node:slim As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps --network-timeout 100000

COPY . .

RUN npm run build

FROM node:slim as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps --production --network-timeout 100000

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
