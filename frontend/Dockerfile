FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install vite

COPY . .

# RUN npm run build

EXPOSE 3011

CMD ["npm", "run","dev"]