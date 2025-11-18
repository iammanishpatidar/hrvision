###########
# Builder #
###########
FROM node:20-alpine AS base

WORKDIR /home/node/app

# Install dependencies (including dev deps for build + dev stages)
COPY package*.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

#################
# Dev container #
#################
FROM base AS development

ENV NODE_ENV=development

# Default command matches docker-compose override
CMD ["node", "ace", "serve", "--watch"]

############
# Builder  #
############
FROM base AS builder

ENV NODE_ENV=production

RUN npm run build

################
# Production   #
################
FROM node:20-alpine AS production

WORKDIR /home/node/app

ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled output and runtime assets
COPY --from=builder /home/node/app/build ./build
COPY --from=builder /home/node/app/swagger.json ./swagger.json

EXPOSE 4000

CMD ["node", "build/bin/server.js"]

