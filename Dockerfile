###################
# BUILD FOR LOCAL DEVELOPMENT
###################

# Base image
FROM node:18-alpine AS development

# Required for Prisma Client to work in container
# RUN apt-get update && apt-get install -y openssl

ENV NODE_ENV development

# Create app directory
WORKDIR /app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./
COPY --chown=node:node tsconfig*.json ./

# Install app dependencies
RUN npm ci

# Bundle app source
COPY --chown=node:node . .
COPY prisma ./prisma/

# Generate Prisma database client code
RUN npm run prisma:generate

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

WORKDIR /app

COPY --chown=node:node package*.json ./
COPY --chown=node:node tsconfig*.json ./

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency.
# In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node . .
COPY prisma ./prisma/

# Run the build command which creates the production bundle
RUN npm run build
RUN npm run prisma:generate

# Set NODE_ENV environment variable
ENV NODE_ENV development

# Running `npm ci` removes the existing node_modules directory.
# Passing in --only=production ensures that only the production dependencies are installed.
# This ensures that the node_modules directory is as optimized as possible.
RUN npm ci
RUN npm cache clean --force

USER node

###################
# PRODUCTION
###################

# Base image for production
FROM node:18-alpine AS production

WORKDIR /app

#COPY --chown=node:node  --from=build /app/node_modules ./node_modules
COPY --chown=node:node  --from=build /app .

EXPOSE 3000

# Start the server using the production build
CMD [ "npm", "run", "start:prod" ]