-- Script para actualizar categorías existentes con emojis y colores
-- Ejecutar después de agregar las columnas emoji y color a la tabla category

USE ecommerce;

-- Primero, agregar las columnas si no existen (opcional, ya están en init.sql)
-- ALTER TABLE category ADD COLUMN emoji VARCHAR(10);
-- ALTER TABLE category ADD COLUMN color VARCHAR(50);

-- Actualizar cada categoría con su emoji y color correspondiente (colores hexadecimales)
UPDATE category SET emoji = '📱', color = '#3B82F6' WHERE name = 'Electrónica';
UPDATE category SET emoji = '👕', color = '#EC4899' WHERE name = 'Ropa y Calzado';
UPDATE category SET emoji = '🏠', color = '#10B981' WHERE name = 'Hogar y Muebles';
UPDATE category SET emoji = '⚽', color = '#F97316' WHERE name = 'Deportes y Aire Libre';
UPDATE category SET emoji = '📚', color = '#A855F7' WHERE name = 'Libros y Medios';
UPDATE category SET emoji = '🎮', color = '#6366F1' WHERE name = 'Juguetes y Videojuegos';
UPDATE category SET emoji = '💄', color = '#EF4444' WHERE name = 'Belleza y Salud';
UPDATE category SET emoji = '🍔', color = '#14B8A6' WHERE name = 'Alimentos y Bebidas';
UPDATE category SET emoji = '🍳', color = '#EAB308' WHERE name = 'Electrodomésticos y Cocina';
UPDATE category SET emoji = '🌱', color = '#84CC16' WHERE name = 'Jardinería';
UPDATE category SET emoji = '🚗', color = '#6B7280' WHERE name = 'Automotriz';
UPDATE category SET emoji = '🐾', color = '#F59E0B' WHERE name = 'Mascotas';
UPDATE category SET emoji = '📎', color = '#64748B' WHERE name = 'Oficina y Papelería';
UPDATE category SET emoji = '🎸', color = '#8B5CF6' WHERE name = 'Instrumentos Musicales';
UPDATE category SET emoji = '👶', color = '#F43F5E' WHERE name = 'Bebés y Maternidad';
UPDATE category SET emoji = '🔨', color = '#78716C' WHERE name = 'Ferretería y Construcción';
UPDATE category SET emoji = '🎨', color = '#06B6D4' WHERE name = 'Artesanías Guatemaltecas';
UPDATE category SET emoji = '📷', color = '#10B981' WHERE name = 'Fotografía';
UPDATE category SET emoji = '💎', color = '#D946EF' WHERE name = 'Joyería';
UPDATE category SET emoji = '🖌️', color = '#0EA5E9' WHERE name = 'Arte y Manualidades';

-- Verificar los cambios
SELECT category_id, name, emoji, color FROM category ORDER BY category_id;
