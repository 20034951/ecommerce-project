import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';
import { 
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from '../services/userService.js';

const router = express.Router();

const CACHE_KEY_ALL = 'users:all';
const CACHE_KEY_BY_ID = (id) => `users:${id}`;
const CACHE_TTL = 300;

/**
 * @route GET /api/users
 * @desc Get all users
 */
router.get('/',
    cacheMiddleware(CACHE_KEY_ALL, CACHE_TTL),
    asyncHandler(async (req, res) => {
        const users = await getAllUsers();
        res.status(200).json(users);
    })
);

/**
 * @route GET /api/users/:id
 * @desc Get user by id
 */
router.get('/:id',
    cacheMiddleware((req) => CACHE_KEY_BY_ID(req.params.id), CACHE_TTL),
    asyncHandler(async (req, res) => {
        const user = await getUserById(req.params.id);
        res.status(200).json(user);
    })
);

/**
 * @route POST /api/users
 * @desc Creates a new user
 */
router.post('/',
    asyncHandler(async (req, res) => {
        const user = await createUser(req.body);
        await invalidateCache([CACHE_KEY_ALL]);
        res.status(201).json(user);
    })
);

/**
 * @route PUT /api/users/:id
 * @desc Updates an existing user
 */
router.put('/:id',
    asyncHandler(async (req, res) => {
        const user = await updateUser(req.params.id, req.body);
        await invalidateCache([ CACHE_KEY_ALL, CACHE_KEY_BY_ID(req.params.id) ]);
        res.status(200).json(user);
    })
);

/**
 * @route DELETE /api/users/:id
 * @desc Deletes an existing user
 */
router.delete('/:id',
    asyncHandler(async (req, res) => {
        const result = await deleteUser(req.params.id);
        await invalidateCache([ CACHE_KEY_ALL, CACHE_KEY_BY_ID(req.params.id) ]);
        res.status(200).json(result);
    })
);

export default router;