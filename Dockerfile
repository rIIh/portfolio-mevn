FROM mhart/alpine-node
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
CMD [ "npm", "start" ]