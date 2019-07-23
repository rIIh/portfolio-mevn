FROM mhart/alpine-node
RUN apk add --no-cache make gcc g++ python

WORKDIR /application
COPY /server/package*.json ./server/
COPY /frontend/package*.json ./frontend/
RUN ls

WORKDIR ./server
RUN npm install
WORKDIR ../frontend
RUN npm install

WORKDIR ..
COPY . .
RUN ls

WORKDIR ./server
CMD [ "npm", "start" ]
