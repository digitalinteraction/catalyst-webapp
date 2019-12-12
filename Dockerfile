# Start with a node 10 image with package info
FROM node:12-alpine as base
WORKDIR /app
COPY ["package*.json", "/app/"]

# [1] An image to install modules and run a build
FROM base as builder
ENV NODE_ENV development
RUN npm ci &> /dev/null
COPY [ ".", "/app/" ]
RUN NODE_ENV=production npm run build &> /dev/null

# [2] An image with production dependencies to run the vue ssr server
FROM base
ENV NODE_ENV production
RUN npm ci &> /dev/null
COPY ["server", "/app/server"]
COPY ["public", "/app/public"]
COPY --from=builder /app/dist /app/dist
CMD ["node", "server/index.js"]
