FROM node:22-alpine

WORKDIR /app

# Install netcat and mysql-client first
RUN apk add --no-cache netcat-openbsd mysql-client

COPY package*.json ./
RUN npm install

COPY . .

# Convert line endings and give execute permissions to the script
RUN sed -i 's/\r$//' wait-mysql.sh && chmod +x wait-mysql.sh

EXPOSE 5005
#CMD ["npm", "run", "dev"]
CMD ["sh", "./wait-mysql.sh"]