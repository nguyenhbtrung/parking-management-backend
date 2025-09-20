import { verifyToken } from '../utils/auth.js';

export const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
            error: {
                code: 'UNAUTHORIZED',
                message: 'No token provided'
            }
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            error: {
                code: 'INVALID_TOKEN',
                message: 'Token is invalid or expired'
            }
        });
    }
};

export const requireAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({
            error: {
                code: "FORBIDDEN",
                message: "You do not have permission to access this resource"
            }
        });
    }
    next();
};

