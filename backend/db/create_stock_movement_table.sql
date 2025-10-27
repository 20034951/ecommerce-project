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
    FOREIGN KEY (order_id) REFERENCES `order`(order_id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE SET NULL ON UPDATE CASCADE,
    
    INDEX idx_product_id (product_id),
    INDEX idx_order_id (order_id),
    INDEX idx_movement_type (movement_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
