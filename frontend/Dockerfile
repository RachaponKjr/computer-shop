FROM node:23-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g vite

COPY . .

RUN npm run build

EXPOSE 3011

CMD ["npm", "run","preview"]