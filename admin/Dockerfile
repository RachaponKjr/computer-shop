FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install
RUN npm install vite

COPY . .

RUN npm run build

EXPOSE 3010

CMD ["npm", "run","preview"]