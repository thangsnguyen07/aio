FROM node:lts-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm@8.5.1

# # Development stage
# FROM base AS development
# ARG SERVICE_NAME
# ENV NODE_ENV=development
# COPY --chown=node:node . /app
# WORKDIR /app
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# RUN pnpm run -r build
# RUN pnpm deploy --filter=$SERVICE_NAME /app/$SERVICE_NAME
# CMD ["npm", "run", "start:dev"]

FROM base AS build
ARG SERVICE_NAME
COPY --chown=node:node . /app
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm deploy --filter=$SERVICE_NAME --prod ./prod/$SERVICE_NAME

FROM node:lts-alpine AS image
ARG SERVICE_NAME
ARG PORT
COPY --from=build app/prod/$SERVICE_NAME /app
WORKDIR /app
EXPOSE $PORT
CMD ["node", "dist/main.js"]