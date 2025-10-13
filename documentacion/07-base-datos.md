# Base de Datos - Esquema y Documentación

## Resumen

El proyecto utiliza MySQL 8.0 como base de datos principal con un esquema relacional normalizado. La base de datos se inicializa automáticamente con Docker y utiliza Sequelize como ORM.

## Esquema de Base de Datos

### Diagrama ER (Entidad-Relación)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    User     │    │   Product   │    │  Category   │
│─────────────│    │─────────────│    │─────────────│
│ user_id (PK)│    │product_id PK│    │category_id P│
│ name        │    │ name        │    │ name        │
│ email (UQ)  │    │ description │    │ description │
│ password_h..│    │ price       │    │ parent_id FK│
│ phone       │    │ discount_pr.│    │ isActive    │
│ role        │    │ stock_qty   │    │ created_at  │
│ isActive    │    │ category_id │────│ updated_at  │
│ created_at  │    │ sku (UQ)    │    └─────────────┘
│ updated_at  │    │ weight      │
└─────┬───────┘    │ dimensions  │
      │            │ isActive    │
      │            │ created_at  │
      │            │ updated_at  │
      │            └─────────────┘
      │
┌─────▼───────┐    ┌─────────────┐
│UserAddress  │    │    Cart     │
│─────────────│    │─────────────│
│address_id PK│    │ cart_id (PK)│
│ user_id (FK)│◄───┤ user_id (FK)│
│ address_line│    │ created_at  │
│ city        │    │ updated_at  │
│ state       │    └─────┬───────┘
│ country     │          │
│ type        │          │
└─────────────┘    ┌─────▼───────┐
                   │  CartItem   │
      ┌───────────▲│─────────────│
      │            │cart_item_id │
┌─────▼───────┐    │ cart_id (FK)│
│   Order     │    │product_id FK│
│─────────────│    │ quantity    │
│ order_id PK │    │ created_at  │
│ user_id (FK)│    └─────────────┘
│ total_amount│
│ status      │    ┌─────────────┐
│ shipping_..│    │ OrderItem   │
│ payment_met.│    │─────────────│
│ created_at  │    │order_item_id│
│ updated_at  │    │ order_id FK │◄──┐
└─────┬───────┘    │product_id FK│   │
      │            │ quantity    │   │
      └────────────│ unit_price  │───┘
                   │ subtotal    │
                   └─────────────┘
```

## Tablas Principales

### 1. user (Usuarios)
```sql
CREATE TABLE user (
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

-- Índices
CREATE INDEX idx_user_email ON user(email);
CREATE INDEX idx_user_role ON user(role);
CREATE INDEX idx_user_active ON user(isActive);
```

**Descripción**: Almacena información de todos los usuarios del sistema.
- **Roles disponibles**: customer (cliente), admin (administrador), editor
- **email**: Debe ser único, usado para login
- **password_hash**: Hash bcrypt de la contraseña
- **isActive**: Permite activar/desactivar usuarios

### 2. user_address (Direcciones de Usuario)
```sql
CREATE TABLE user_address (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address_line VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    type ENUM('shipping','billing') DEFAULT 'shipping',
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX idx_address_user ON user_address(user_id);
CREATE INDEX idx_address_type ON user_address(type);
```

**Descripción**: Múltiples direcciones por usuario.
- **type**: shipping (envío) o billing (facturación)
- **Cascade delete**: Se elimina al eliminar el usuario

### 3. category (Categorías)
```sql
CREATE TABLE category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id INT,
    isActive BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES category(category_id) ON DELETE SET NULL
);

-- Índices
CREATE INDEX idx_category_parent ON category(parent_id);
CREATE INDEX idx_category_active ON category(isActive);
```

**Descripción**: Categorías jerárquicas para productos.
- **parent_id**: Permite subcategorías (estructura de árbol)
- **isActive**: Permite ocultar categorías sin eliminarlas

### 4. product (Productos)
```sql
CREATE TABLE product (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2),
    stock_quantity INT DEFAULT 0,
    category_id INT,
    sku VARCHAR(50) UNIQUE,
    weight DECIMAL(5,2),
    dimensions VARCHAR(100),
    isActive BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE SET NULL
);

-- Índices
CREATE INDEX idx_product_category ON product(category_id);
CREATE INDEX idx_product_sku ON product(sku);
CREATE INDEX idx_product_active ON product(isActive);
CREATE INDEX idx_product_price ON product(price);
CREATE FULLTEXT INDEX idx_product_search ON product(name, description);
```

**Descripción**: Catálogo de productos.
- **sku**: Código único del producto
- **discount_price**: Precio con descuento (opcional)
- **stock_quantity**: Control de inventario
- **FULLTEXT**: Para búsquedas de texto completo

### 5. cart (Carrito de Compras)
```sql
CREATE TABLE cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_cart (user_id)
);

-- Índices
CREATE INDEX idx_cart_user ON cart(user_id);
```

**Descripción**: Un carrito por usuario registrado.
- **UNIQUE constraint**: Un usuario = un carrito
- **Persistente**: Se mantiene entre sesiones

### 6. cart_item (Elementos del Carrito)
```sql
CREATE TABLE cart_item (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_product (cart_id, product_id)
);

-- Índices
CREATE INDEX idx_cartitem_cart ON cart_item(cart_id);
CREATE INDEX idx_cartitem_product ON cart_item(product_id);
```

**Descripción**: Productos en cada carrito.
- **UNIQUE constraint**: Un producto por carrito (se actualiza quantity)
- **quantity**: Cantidad del producto en el carrito

### 7. order_table (Órdenes)
```sql
CREATE TABLE order_table (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE RESTRICT
);

-- Índices
CREATE INDEX idx_order_user ON order_table(user_id);
CREATE INDEX idx_order_status ON order_table(status);
CREATE INDEX idx_order_date ON order_table(created_at);
```

**Descripción**: Órdenes de compra finalizadas.
- **status**: Estados del flujo de orden
- **RESTRICT**: No permite eliminar usuario con órdenes
- **shipping_address**: Dirección al momento de la compra (desnormalizada)

### 8. order_item (Elementos de Orden)
```sql
CREATE TABLE order_item (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES order_table(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE RESTRICT
);

-- Índices
CREATE INDEX idx_orderitem_order ON order_item(order_id);
CREATE INDEX idx_orderitem_product ON order_item(product_id);
```

**Descripción**: Líneas de detalle de cada orden.
- **unit_price**: Precio al momento de la compra (histórico)
- **subtotal**: quantity * unit_price
- **RESTRICT**: Preservar historial de productos eliminados

## Tablas Auxiliares

### 9. user_session (Sesiones de Usuario)
```sql
CREATE TABLE user_session (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    refresh_token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX idx_session_user ON user_session(user_id);
CREATE INDEX idx_session_expires ON user_session(expires_at);
```

**Descripción**: Gestión de refresh tokens JWT.
- **expires_at**: Para limpieza automática
- **refresh_token**: Token para renovar JWT

### 10. password_reset_token (Tokens de Reset)
```sql
CREATE TABLE password_reset_token (
    token_id VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX idx_reset_user ON password_reset_token(user_id);
CREATE INDEX idx_reset_expires ON password_reset_token(expires_at);
```

**Descripción**: Tokens para recuperación de contraseña.
- **used**: Evitar reutilización de tokens
- **expires_at**: Tokens temporales (15 minutos)

### 11. product_tag (Tags de Productos) - Opcional
```sql
CREATE TABLE product_tag (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    tag_name VARCHAR(50) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE,
    INDEX idx_tag_product (product_id),
    INDEX idx_tag_name (tag_name)
);
```

**Descripción**: Sistema de etiquetas para productos.
- **Búsquedas**: Mejorar descubrimiento de productos
- **Filtros**: Filtrado por tags

## Relaciones y Constraints

### Relaciones Principales
1. **User → UserAddress**: 1:N (Un usuario, múltiples direcciones)
2. **User → Cart**: 1:1 (Un usuario, un carrito)
3. **Cart → CartItem**: 1:N (Un carrito, múltiples productos)
4. **User → Order**: 1:N (Un usuario, múltiples órdenes)
5. **Order → OrderItem**: 1:N (Una orden, múltiples productos)
6. **Category → Category**: 1:N (Categoría padre, subcategorías)
7. **Category → Product**: 1:N (Una categoría, múltiples productos)
8. **Product → CartItem**: 1:N (Un producto en múltiples carritos)
9. **Product → OrderItem**: 1:N (Un producto en múltiples órdenes)

### Constraints de Integridad
```sql
-- Evitar eliminaciones accidentales
ALTER TABLE order_table ADD CONSTRAINT fk_order_user 
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE RESTRICT;

-- Mantener integridad histórica
ALTER TABLE order_item ADD CONSTRAINT fk_orderitem_product 
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE RESTRICT;

-- Limpieza automática
ALTER TABLE cart ADD CONSTRAINT fk_cart_user 
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE;
```

## Inicialización y Migración

### Script de Inicialización (init.sql)
```sql
-- Crear base de datos
CREATE DATABASE IF NOT EXISTS ecommerce;
USE ecommerce;

-- Crear usuario
DROP USER IF EXISTS 'ecommerce_user'@'%';
CREATE USER 'ecommerce_user'@'%' IDENTIFIED WITH mysql_native_password BY 'ecommerce_p4zzW0rD';
GRANT ALL PRIVILEGES ON ecommerce.* TO 'ecommerce_user'@'%';
FLUSH PRIVILEGES;

-- Las tablas se crean automáticamente por Sequelize
```

### Sequelize Sync
```javascript
// En app.js
await db.sequelize.sync({ 
  alter: true,    // Actualizar estructura sin perder datos
  force: false    // NO recrear tablas (perdería datos)
});
```

## Indexing Strategy

### Índices de Performance
```sql
-- Búsquedas frecuentes
CREATE INDEX idx_user_email ON user(email);                    -- Login
CREATE INDEX idx_product_category ON product(category_id);     -- Filtros
CREATE INDEX idx_product_active ON product(isActive);          -- Productos activos
CREATE INDEX idx_order_user_date ON order_table(user_id, created_at); -- Historial usuario

-- Búsqueda de texto completo
CREATE FULLTEXT INDEX idx_product_search ON product(name, description);

-- Ordenamiento común
CREATE INDEX idx_product_price ON product(price);              -- Ordenar por precio
CREATE INDEX idx_order_date ON order_table(created_at DESC);   -- Órdenes recientes
```

### Consultas Optimizadas
```sql
-- Productos de una categoría (con subcategorías)
WITH RECURSIVE category_tree AS (
    SELECT category_id FROM category WHERE category_id = ?
    UNION ALL
    SELECT c.category_id FROM category c
    INNER JOIN category_tree ct ON c.parent_id = ct.category_id
)
SELECT p.* FROM product p
INNER JOIN category_tree ct ON p.category_id = ct.category_id
WHERE p.isActive = TRUE;

-- Búsqueda de productos
SELECT p.*, c.name as category_name,
       MATCH(p.name, p.description) AGAINST(? IN NATURAL LANGUAGE MODE) AS relevance
FROM product p
LEFT JOIN category c ON p.category_id = c.category_id
WHERE p.isActive = TRUE
  AND (MATCH(p.name, p.description) AGAINST(? IN NATURAL LANGUAGE MODE)
       OR p.name LIKE CONCAT('%', ?, '%'))
ORDER BY relevance DESC, p.name;
```

## Backup y Restore

### Scripts de Backup
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
docker compose exec mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} \
    --single-transaction --routines --triggers ecommerce > backup_${DATE}.sql

# Comprimir backup
gzip backup_${DATE}.sql
```

### Restore
```bash
#!/bin/bash
# restore.sh
BACKUP_FILE=$1
if [ -z "$BACKUP_FILE" ]; then
    echo "Uso: ./restore.sh backup_file.sql.gz"
    exit 1
fi

# Descomprimir si es necesario
if [[ $BACKUP_FILE == *.gz ]]; then
    gunzip -c $BACKUP_FILE | docker compose exec -T mysql \
        mysql -u root -p${MYSQL_ROOT_PASSWORD} ecommerce
else
    docker compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} \
        ecommerce < $BACKUP_FILE
fi
```

## Monitoreo y Mantenimiento

### Consultas de Monitoreo
```sql
-- Estado general de tablas
SELECT 
    TABLE_NAME,
    TABLE_ROWS,
    ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'ecommerce'
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;

-- Consultas lentas
SHOW PROCESSLIST;

-- Estadísticas de índices
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    CARDINALITY,
    INDEX_TYPE
FROM information_schema.STATISTICS 
WHERE TABLE_SCHEMA = 'ecommerce'
ORDER BY TABLE_NAME, INDEX_NAME;
```

### Limpieza Automática
```sql
-- Eliminar tokens expirados (ejecutar diariamente)
DELETE FROM user_session WHERE expires_at < NOW();
DELETE FROM password_reset_token WHERE expires_at < NOW() OR used = TRUE;

-- Limpiar carritos abandonados (ejecutar semanalmente)  
DELETE FROM cart WHERE updated_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
```

## Consideraciones de Escalamiento

### Partitioning (Futuro)
```sql
-- Particionar órdenes por fecha
ALTER TABLE order_table PARTITION BY RANGE (YEAR(created_at)) (
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

### Read Replicas
- Configurar replica para consultas de solo lectura
- Dirigir búsquedas de productos a replica
- Mantener escrituras en master

### Archiving Strategy
```sql
-- Mover órdenes antiguas a tabla de archivo
CREATE TABLE order_archive LIKE order_table;
CREATE TABLE order_item_archive LIKE order_item;

-- Archivar órdenes de más de 2 años
INSERT INTO order_archive 
SELECT * FROM order_table 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 2 YEAR);
```