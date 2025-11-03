-- Create database if not exists
CREATE DATABASE IF NOT EXISTS ecommerce;

-- Use the database
USE ecommerce;

-- Create application user
CREATE USER IF NOT EXISTS 'ecommerce_user'@'%' IDENTIFIED WITH mysql_native_password BY 'ecommerce_p4zzW0rD';

-- Grant app user access to only this DB
GRANT ALL PRIVILEGES ON ecommerce.* TO 'ecommerce_user'@'%';

-- Create MySQL exporter user
CREATE USER IF NOT EXISTS 'mysqld_exporter'@'%' IDENTIFIED WITH mysql_native_password BY 'exporter_pass';

-- Exporter required perms
GRANT PROCESS, REPLICATION CLIENT ON *.* TO 'mysqld_exporter'@'%';
GRANT SELECT ON performance_schema.* TO 'mysqld_exporter'@'%';
-- GRANT SELECT ON information_schema.* TO 'mysqld_exporter'@'%';

-- Flush privileges
FLUSH PRIVILEGES;

-- Create tables according to the schema
-- Usuarios
CREATE TABLE IF NOT EXISTS user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('customer', 'admin', 'editor') DEFAULT 'customer',
    isActive BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Dirección de Usuarios
CREATE TABLE IF NOT EXISTS user_address (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address_line VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    type ENUM('shipping','billing') DEFAULT 'shipping',
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

-- Categorías
CREATE TABLE IF NOT EXISTS category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    emoji VARCHAR(10),
    color VARCHAR(50),
    parent_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES category(category_id) ON DELETE SET NULL
);

-- Productos
CREATE TABLE IF NOT EXISTS product (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    sku VARCHAR(50) UNIQUE,
    image_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE RESTRICT
);

-- Etiquetas de productos
CREATE TABLE IF NOT EXISTS product_tag (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    tag VARCHAR(50) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
);

-- Carrito
CREATE TABLE IF NOT EXISTS cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

-- Productos del carrito
CREATE TABLE IF NOT EXISTS cart_item (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
);

-- Métodos de envío
CREATE TABLE IF NOT EXISTS shipping_method (
    shipping_method_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    region VARCHAR(100)
);

-- Métodos de pago
CREATE TABLE IF NOT EXISTS payment_methods (
    payment_method_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    icon VARCHAR(100),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Notificaciones
CREATE TABLE IF NOT EXISTS notification (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    status ENUM('unread','read') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

-- Reviews
CREATE TABLE IF NOT EXISTS review (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

-- Cupones
CREATE TABLE IF NOT EXISTS coupon (
    coupon_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount DECIMAL(5,2) NOT NULL,
    type ENUM('percent','fixed') DEFAULT 'percent',
    valid_from DATE,
    valid_until DATE,
    usage_limit INT,
    used_count INT DEFAULT 0,
    status ENUM('active','inactive','expired') DEFAULT 'active' NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Órdenes
CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address_id INT NOT NULL,
    status ENUM('pending','paid','processing','shipped','delivered','cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    tracking_number VARCHAR(100) UNIQUE,
    tracking_url VARCHAR(500),
    estimated_delivery DATETIME,
    shipped_at DATETIME,
    delivered_at DATETIME,
    cancelled_at DATETIME,
    cancellation_reason TEXT,
    shipping_method_id INT,
    payment_method_id INT,
    coupon_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (address_id) REFERENCES user_address(address_id) ON DELETE RESTRICT,
    FOREIGN KEY (shipping_method_id) REFERENCES shipping_method(shipping_method_id) ON DELETE SET NULL,
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(payment_method_id) ON DELETE SET NULL,
    FOREIGN KEY (coupon_id) REFERENCES coupon(coupon_id) ON DELETE SET NULL
);

-- Artículos de órdenes
CREATE TABLE IF NOT EXISTS order_item (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE RESTRICT
);

-- Historial de estados de órdenes
CREATE TABLE IF NOT EXISTS order_status_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    status ENUM('pending','paid','processing','shipped','delivered','cancelled') NOT NULL,
    notes TEXT,
    changed_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES user(user_id) ON DELETE SET NULL
);

-- Sesiones de usuario (para JWT)
CREATE TABLE IF NOT EXISTS user_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_id VARCHAR(255) NOT NULL UNIQUE,
    device_info VARCHAR(500),
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at DATETIME NOT NULL,
    last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

-- Tokens de recuperación de contraseña
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    token_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

-- Crear tabla stock_movement para rastrear movimientos de inventario
CREATE TABLE IF NOT EXISTS stock_movement (
    movement_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    order_id INT NULL,
    movement_type ENUM('sale', 'cancellation', 'adjustment', 'restock') NOT NULL COMMENT 'sale: Venta/pedido, cancellation: Cancelación de pedido, adjustment: Ajuste manual, restock: Reabastecimiento',
    quantity INT NOT NULL COMMENT 'Cantidad positiva para incrementos, negativa para decrementos',
    previous_stock INT NOT NULL COMMENT 'Stock antes del movimiento',
    new_stock INT NOT NULL COMMENT 'Stock después del movimiento',
    notes TEXT NULL,
    user_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE SET NULL ON UPDATE CASCADE,
    
    INDEX idx_product_id (product_id),
    INDEX idx_order_id (order_id),
    INDEX idx_movement_type (movement_type),
    INDEX idx_created_at (created_at)
);

-- Índices para optimización
CREATE INDEX idx_user_email ON user(email);
CREATE INDEX idx_user_sessions_token ON user_sessions(token_id);
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active);
CREATE INDEX idx_product_sku ON product(sku);
CREATE INDEX idx_product_category ON product(category_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_tracking ON orders(tracking_number);
CREATE INDEX idx_order_status_history_order ON order_status_history(order_id);
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_user ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_expires ON password_reset_tokens(expires_at);