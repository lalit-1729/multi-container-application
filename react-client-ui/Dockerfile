FROM node:alpine as buildStage
WORKDIR /app
COPY package.json .
RUN npm install 
COPY . .

RUN npm run build 

FROM nginx as serverStage
EXPOSE 3000
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=buildStage /app/build /usr/share/nginx/html
