FROM node:20-alpine
WORKDIR /app
COPY package.json yarn-lock.json ./
COPY tsconfig.json ./
COPY . .
RUN yarn install
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]
