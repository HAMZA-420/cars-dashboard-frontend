FROM node:14-alpine

WORKDIR /usr/src/app/auth_app

COPY package*.json ./

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]