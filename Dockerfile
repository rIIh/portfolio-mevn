FROM mhart/alpine-node
RUN apk add --no-cache make gcc g++ python

WORKDIR /application
COPY package*.json ./

RUN npm install

COPY . .
EXPOSE 5000
CMD [ "npm", "start" ]
