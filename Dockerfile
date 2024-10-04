FROM node:18

WORKDIR /usr/src/app

# Copy the wait-for-it script and make it executable
COPY ./scripts/wait-for-it.sh /usr/src/app/
RUN chmod +x /usr/src/app/wait-for-it.sh

# Install the dependencies
COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Expose the port
EXPOSE 3000

# Start the application with wait-for-it
CMD ["npm", "start"]
