import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';
import { authenticateToken, requireAdmin, requireCustomer } from '../middleware/auth.js';
import HttpError from '../utils/HttpError.js';
import { 
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserSessions,
    terminateUserSession,
    terminateAllUserSessions
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
    authenticateToken,
    requireAdmin,
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
    authenticateToken,
    requireAdmin,
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
    authenticateToken,
    requireAdmin,
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
    authenticateToken,
    requireAdmin,
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
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
        const result = await deleteUser(req.params.id);
        await invalidateCache([ CACHE_KEY_ALL, CACHE_KEY_BY_ID(req.params.id) ]);
        res.status(200).json(result);
    })
);

/**
 * @route PUT /api/users/:id/role
 * @desc Update user role
 */
router.put('/:id/role',
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
        const { role } = req.body;
        if (!role) {
            throw new HttpError(400, 'Role is required');
        }
        
        const user = await updateUser(req.params.id, { role });
        await invalidateCache([ CACHE_KEY_ALL, CACHE_KEY_BY_ID(req.params.id) ]);
        res.status(200).json(user);
    })
);

/**
 * @route GET /api/users/:id/sessions
 * @desc Get user active sessions
 */
router.get('/:id/sessions',
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
        const sessions = await getUserSessions(req.params.id);
        res.status(200).json(sessions);
    })
);

/**
 * @route DELETE /api/users/:id/sessions/:sessionId
 * @desc Terminate a specific user session
 */
router.delete('/:id/sessions/:sessionId',
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
        const result = await terminateUserSession(req.params.id, req.params.sessionId);
        res.status(200).json(result);
    })
);

/**
 * @route DELETE /api/users/:id/sessions
 * @desc Terminate all user sessions
 */
router.delete('/:id/sessions',
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
        const result = await terminateAllUserSessions(req.params.id);
        res.status(200).json(result);
    })
);

export default router;