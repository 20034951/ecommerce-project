#!/bin/sh
# Waits until MySQL/MariaDB is ready and user exists

set -e

# Check if required environment variables are set
if [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASS" ] || [ -z "$DB_NAME" ]; then
    echo "ERROR: Required environment variables are not set:"
    echo "DB_HOST=$DB_HOST"
    echo "DB_PORT=$DB_PORT"
    echo "DB_USER=$DB_USER"
    echo "DB_PASS=$DB_PASS"
    echo "DB_NAME=$DB_NAME"
    exit 1
fi

HOST=${DB_HOST}
DB_PORT=${DB_PORT}
USER=${DB_USER}
PASS=${DB_PASS}
DB=${DB_NAME}

echo "Waiting for MariaDB/MySQL at $HOST:$DB_PORT..."
echo "Using credentials: User=$USER, DB=$DB"

# Wait until MySQL/MariaDB accept TCP connections
until nc -z $HOST $DB_PORT; do
    echo "Database is unavailable - sleeping 5s"
    sleep 5
done

# Use mysql/mariadb client (both support --ssl=0)
if command -v mysql >/dev/null 2>&1; then
    DB_CLIENT="mysql"
    echo "Using MySQL client"
elif command -v mariadb >/dev/null 2>&1; then
    DB_CLIENT="mariadb"
    echo "Using MariaDB client"
else
    echo "ERROR: Neither mariadb nor mysql client found"
    exit 1
fi

# Wait until user and database exists
echo "Waiting for $USER and database $DB to be ready ..."
echo "Testing connection..."

# Test connection with more verbose output
MAX_RETRIES=30
RETRY_COUNT=0

# Use the detected client with appropriate SSL options
until $DB_CLIENT -h "$HOST" -P "$DB_PORT" -u "$USER" -p"$PASS" --ssl=0 -e "USE $DB;" > /dev/null 2>&1; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "ERROR: Max retries ($MAX_RETRIES) reached. Database connection failed."
        echo "Last connection attempt details:"
        $DB_CLIENT -h "$HOST" -P "$DB_PORT" -u "$USER" -p"$PASS" --ssl=0 -e "USE $DB;" 2>&1 || true
        exit 1
    fi
    
    echo "Database/user not ready - sleeping 5s (attempt $RETRY_COUNT/$MAX_RETRIES)"
    sleep 5
done

echo "MySQL and user ready - starting backend"
exec npm start