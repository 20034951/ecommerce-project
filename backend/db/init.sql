-- Create database if not exists
CREATE DATABASE IF NOT EXISTS ecommerce;

-- Create user and assigns permissions to connect from any host
CREATE USER IF NOT EXISTS 'ecommerce_user'@'%' IDENTIFIED BY 'ecommerce_p4zzW0rD';

-- Grant permissions over database
GRANT ALL PRIVILEGES ON ecommerce.* TO 'ecommerce_user'@'%';

-- 
FLUSH PRIVILEGES;