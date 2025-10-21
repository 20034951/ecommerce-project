import express from "express";
import authService from "../services/authService.js";
import db from "../models/index.js";
import HttpError from "../utils/HttpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticateToken, requireAdmin, requireOwnership } from "../middleware/auth.js";

const router = express.Router();
const { User } = db;

// Registro de usuarios
router.post("/register", asyncHandler(async (req, res) => {
    const { name, email, password, phone, role = 'customer' } = req.body;

    // Validaciones básicas
    if (!name || !email || !password) {
        throw new HttpError(400, "Nombre, email y contraseña son requeridos");
    }

    if (password.length < 6) {
        throw new HttpError(400, "La contraseña debe tener al menos 6 caracteres");
    }

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new HttpError(400, "El email ya está registrado");
    }

    // Solo admin puede crear usuarios con roles admin/editor
    if (role !== 'customer') {
        throw new HttpError(403, "No puedes asignar roles administrativos durante el registro");
    }

    // Hash de la contraseña
    const password_hash = await authService.hashPassword(password);

    // Crear usuario
    const user = await User.create({
        name,
        email,
        password_hash,
        phone,
        role
    });

    // No devolver la contraseña
    const userResponse = {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        created_at: user.created_at
    };

    res.status(201).json({
        message: "Usuario registrado exitosamente",
        user: userResponse
    });
}));

// Login de usuarios
router.post("/login", asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new HttpError(400, "Email y contraseña son requeridos");
    }

    // Buscar usuario
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new HttpError(401, "Credenciales inválidas");
    }

    if (!user.isActive) {
        throw new HttpError(401, "Usuario inactivo");
    }

    // Verificar contraseña
    const isValidPassword = await authService.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
        throw new HttpError(401, "Credenciales inválidas");
    }

    // Generar tokens
    const tokens = authService.generateTokens(user);

    // Crear sesión
    await authService.createSession(user, tokens.tokenId, req);

    // Respuesta sin contraseña
    const userResponse = {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
    };

    res.json({
        message: "Login exitoso",
        user: userResponse,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn
    });
}));

// Logout
router.post("/logout", authenticateToken, asyncHandler(async (req, res) => {
    await authService.logout(req.tokenId);
    
    res.json({ 
        message: "Logout exitoso" 
    });
}));

// Logout de todas las sesiones
router.post("/logout-all", authenticateToken, asyncHandler(async (req, res) => {
    await authService.logoutAllSessions(req.user.user_id);
    
    res.json({ 
        message: "Todas las sesiones han sido cerradas" 
    });
}));

// Refresh token
router.post("/refresh", asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    console.log('Intento de refresh token recibido');

    if (!refreshToken) {
        console.log('No se proporcionó refresh token');
        throw new HttpError(400, "Refresh token requerido");
    }

    try {
        console.log('Verificando refresh token...');
        // Verificar refresh token
        const decoded = authService.verifyRefreshToken(refreshToken);
        console.log('Refresh token decodificado:', { user_id: decoded.user_id, tokenId: decoded.tokenId });
        
        // Verificar que la sesión esté activa
        const isActive = await authService.isSessionActive(decoded.tokenId);
        if (!isActive) {
            console.log('Sesión no activa para refresh token');
            throw new HttpError(401, "Sesión expirada");
        }

        // Obtener usuario
        const user = await User.findByPk(decoded.user_id);
        if (!user || !user.isActive) {
            console.log('Usuario no encontrado o inactivo para refresh');
            throw new HttpError(401, "Usuario no encontrado o inactivo");
        }

        console.log('Generando nuevos tokens...');
        // Generar nuevos tokens
        const newTokens = authService.generateTokens(user);

        // Invalidar sesión anterior y crear nueva
        await authService.logout(decoded.tokenId);
        await authService.createSession(user, newTokens.tokenId, req);

        console.log('Refresh exitoso para usuario:', user.email);
        res.json({
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
            expiresIn: newTokens.expiresIn
        });
    } catch (error) {
        console.log('Error en refresh:', error.message);
        throw new HttpError(401, "Refresh token inválido o expirado");
    }
}));

// Verificar token
router.get("/verify", authenticateToken, asyncHandler(async (req, res) => {
    res.json({
        valid: true,
        user: {
            user_id: req.user.user_id,
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phone,
            role: req.user.role
        }
    });
}));

// Obtener mis sesiones activas
router.get("/sessions", authenticateToken, asyncHandler(async (req, res) => {
    const sessions = await authService.getUserSessions(req.user.user_id);
    res.json({ sessions });
}));

// Revocar sesión específica (propia)
router.delete("/sessions/:sessionId", authenticateToken, requireOwnership('sessionId'), asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    
    // Verificar que la sesión pertenece al usuario
    const session = await db.UserSession.findOne({
        where: { 
            session_id: sessionId,
            user_id: req.user.user_id 
        }
    });

    if (!session) {
        throw new HttpError(404, "Sesión no encontrada");
    }

    await authService.revokeSession(sessionId);
    
    res.json({ 
        message: "Sesión revocada exitosamente" 
    });
}));

// Rutas administrativas

// Obtener todas las sesiones activas (solo admin)
router.get("/admin/sessions", authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
    const sessions = await authService.getAllActiveSessions();
    res.json({ sessions });
}));

// Revocar cualquier sesión (solo admin)
router.delete("/admin/sessions/:sessionId", authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    
    const session = await authService.revokeSession(sessionId);
    
    res.json({ 
        message: "Sesión revocada exitosamente",
        session: {
            session_id: session.session_id,
            user_id: session.user_id
        }
    });
}));

// Cerrar todas las sesiones de un usuario (solo admin)
router.post("/admin/users/:userId/logout-all", authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    const user = await User.findByPk(userId);
    if (!user) {
        throw new HttpError(404, "Usuario no encontrado");
    }

    await authService.logoutAllSessions(userId);
    
    res.json({ 
        message: `Todas las sesiones del usuario ${user.name} han sido cerradas` 
    });
}));

// Crear usuario (solo admin)
router.post("/admin/users", authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
    const { name, email, password, phone, role = 'customer' } = req.body;

    if (!name || !email || !password) {
        throw new HttpError(400, "Nombre, email y contraseña son requeridos");
    }

    if (password.length < 6) {
        throw new HttpError(400, "La contraseña debe tener al menos 6 caracteres");
    }

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new HttpError(400, "El email ya está registrado");
    }

    // Validar rol
    const validRoles = ['customer', 'editor', 'admin'];
    if (!validRoles.includes(role)) {
        throw new HttpError(400, "Rol inválido");
    }

    // Hash de la contraseña
    const password_hash = await authService.hashPassword(password);

    // Crear usuario
    const user = await User.create({
        name,
        email,
        password_hash,
        phone,
        role
    });

    // Respuesta sin contraseña
    const userResponse = {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        created_at: user.created_at
    };

    res.status(201).json({
        message: "Usuario creado exitosamente",
        user: userResponse
    });
}));

export default router;
