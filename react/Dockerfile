FROM node:20-slim

WORKDIR /usr/src/app

COPY package*.json ./

ENV NODE_ENV=development
RUN npm install --include=dev

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]