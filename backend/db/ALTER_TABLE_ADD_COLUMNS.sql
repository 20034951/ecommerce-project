-- Script para agregar las columnas emoji y color a la tabla category
-- Ejecutar SOLO si la tabla ya existe sin estas columnas

USE ecommerce;

ALTER TABLE category ADD COLUMN emoji VARCHAR(10);
ALTER TABLE category ADD COLUMN color VARCHAR(50);
