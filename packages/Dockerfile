# Use the official Node.js image as a base image
FROM node:18-alpine AS build

# development stage
FROM build AS development 

ARG SERVICE_NAME
ARG PORT
ARG NODE_ENV=development 

ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package.json package-lock.json ./ 
RUN npm install

COPY . . 
RUN npm run build ${SERVICE_NAME} 

EXPOSE ${PORT}

# Add an env to save ARG
ENV APP_MAIN_FILE=dist/apps/${SERVICE_NAME}/src/main.js
CMD node ${APP_MAIN_FILE}