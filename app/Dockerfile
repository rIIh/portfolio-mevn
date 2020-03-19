# FROM mhart/alpine-node:10.10
# RUN apk add --no-cache make gcc g++ python

# WORKDIR /application
# COPY /server/package*.json ./server/
# COPY /frontend/package*.json ./frontend/

# WORKDIR /application/frontend
# RUN npm install

# WORKDIR /application
# COPY . .

# WORKDIR /application/server
# RUN npm install
# EXPOSE 5000
# CMD [ "npm", "start" ]

FROM node:12 as build
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:12-alpine AS release
ENV NODE_ENV='production'
RUN apk add --no-cache python make gcc g++
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY .env .
COPY --from=build /usr/src/app/server ./server
CMD ["npm","start"]
