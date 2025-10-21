import express from "express";
import db from "../models/index.js";
import { Op } from "sequelize";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();
const { Product, Category } = db;

/**
 * @route   GET /api/products/search
 * @desc    Busca productos por nombre, categoría o descripción
 * @access  Público
 */
router.get("/search", asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q || q.trim() === "") {
    return res.status(400).json({ 
      success: false,
      message: "Debe proporcionar un término de búsqueda." 
    });
  }

  const searchTerm = q.trim();

  // Buscar productos usando Sequelize con LIKE para búsqueda parcial
  const products = await Product.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.like]: `%${searchTerm}%` } },
        { description: { [Op.like]: `%${searchTerm}%` } },
        { sku: { [Op.like]: `%${searchTerm}%` } }
      ]
    },
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['category_id', 'name'],
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${searchTerm}%` } }
          ]
        },
        required: false // LEFT JOIN para que también traiga productos sin coincidencia en categoría
      }
    ],
    limit: 10, // Limitar resultados para mejor rendimiento
    order: [['name', 'ASC']]
  });

  res.status(200).json({ 
    success: true,
    data: products,
    count: products.length
  });
}));

export default router;
