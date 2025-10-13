import express from 'express';
import db from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import HttpError from '../utils/HttpError.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
const { Role } = db;

// Cache Keys
const CACHE_KEY_ALL = 'roles:all';
const CACHE_KEY_BY_ID = (id) => `roles:${id}`;
const CACHE_TTL = 300;

/**
 * @route GET /api/roles
 * @desc Get all roles
 */
router.get('/',
    authenticateToken,
    requireAdmin,
    cacheMiddleware(CACHE_KEY_ALL, CACHE_TTL),
    asyncHandler(async (req, res) => {
        const roles = await Role.findAll();
        res.status(200).json(roles);
    })
);

/**
 * @route GET /api/roles/:id
 * @desc Get role by id
 */
router.get('/:id',
    cacheMiddleware((req) => CACHE_KEY_BY_ID(req.params.id), CACHE_TTL),
    asyncHandler(async (req, res) => {
        const role = await Role.findByPk(req.params.id);
        if(!role){
            throw new HttpError(404, 'Role not found');
        }
        res.status(200).json(role);
    })
);

/**
 * @route POST /api/roles
 * @desc Creates a new role
 */
router.post('/',
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
        const { name, description } = req.body;

        if(!name){
            throw new HttpError(400, 'Role name is required');
        }

        const existing = await Role.findOne( { where: {name} } );

        if(existing) {
            throw new HttpError(400, 'Role name already exists');
        }

        const role = await Role.create( { name, description } );

        await invalidateCache([CACHE_KEY_ALL]);

        res.status(201).json(role);
    })
);

/**
 * @route PUT /api/roles/:id
 * @desc Updates an existing role
 */
router.put('/:id',
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
        const { name, description } = req.body;
        const role = await Role.findByPk(req.params.id);

        if(!role){
            throw new HttpError(400, 'Role not found');
        }

        if(name) role.name = name;
        if(description) role.description = description;

        await role.save();

        await invalidateCache([CACHE_KEY_ALL, CACHE_KEY_BY_ID(req.params.id)]);

        res.status(200).json(role);
    })
);


router.delete('/:id',
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
        const role = await Role.findByPk(req.params.id);
        if(!role){
            throw new HttpError(404, 'Role not found');
        }

        await role.destroy();

        await invalidateCache([CACHE_KEY_ALL, CACHE_KEY_BY_ID(req.params.id)]);

        res.status(200).json({ message: 'Role deleted successfully' });
    })
);

export default router;
