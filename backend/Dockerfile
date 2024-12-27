FROM node:20-alpine

COPY package*.json .

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

CMD ["node", "dist/index.js"]