FROM mhart/alpine-node:10.10
RUN apk add --no-cache make gcc g++ python

WORKDIR /application
COPY /server/package*.json ./server/
COPY /frontend/package*.json ./frontend/

WORKDIR /application/frontend
RUN npm install

WORKDIR /application
ADD CHECKS /app
COPY . .

WORKDIR /application/server
RUN npm install
EXPOSE 5000
CMD [ "npm", "start" ]