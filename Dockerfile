FROM mhart/alpine-node
RUN apk add --no-cache make gcc g++ python

WORKDIR /application
COPY /server/package*.json ./

RUN npm install

COPY . .

RUN npm run --prefix frontend build

EXPOSE 5000
CMD [ "npm", "start" ]
