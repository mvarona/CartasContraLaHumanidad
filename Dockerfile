FROM node:14.17.0

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Build for production
RUN npm ci --omit=dev

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "npm", "build" ]
CMD [ "npm", "run", "production" ]