FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x wait-mysql.sh

# Install netcat to check MySQL port in case we want to remove this part we need to modify wait-mysql.sh file
RUN apt-get update && \
    apt-get install -y netcat-openbsd default-mysql-client && \
    rm -rf /var/lib/apt/lists/*

EXPOSE 5005
#CMD ["npm", "run", "dev"]
CMD ["./wait-mysql.sh"]