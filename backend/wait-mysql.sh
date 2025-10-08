#!/bin/sh
# Waits until MySQL is ready and users exists

set -e

HOST=${DB_HOST}
DB_PORT=${DB_PORT}
USER=${MYSQL_USER}
PASS=${MYSQL_PASSWORD}
DB=${MYSQL_DATABASE}

echo "Waiting for MySQL at $HOST:$DB_PORT..."

# Wait until MySQL accept TCP connections
until nc -z $HOST $DB_PORT; do
    echo "MySQL is unavailable - sleeping 5s"
    sleep 5
done

# Wait until user and database exists
echo "Waiting for $USER and database $DB to be ready ..."
until mysql -h "$HOST" -P "$DB_PORT" -u "$USER" -p"$PASS" -e "USE $DB;" > /dev/null 2>&1; do
    echo "Database/user not ready - sleeping 5s"
    sleep 5
done

echo "MySQL and user ready - starting backend"
exec npm start


