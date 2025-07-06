const requireAuth = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/login?error=login_required');
    }

    if (req.session.user.loginTime) {
        const now = new Date();
        const loginTime = new Date(req.session.user.loginTime);
        const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
        
        if (hoursSinceLogin > 24) {
            req.session.destroy();
            return res.redirect('/login?error=session_expired');
        }
    }

    next();
};

// Role-based authentication middleware
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            return res.redirect('/login?error=login_required');
        }

        const userRole = req.session.user.role;
                const allowedRoles = Array.isArray(roles) ? roles : [roles];
        
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).render('pages/error', {
                title: 'Access Denied',
                message: 'You do not have permission to access this page.',
                statusCode: 403
            });
        }

        next();
    };
};

// // Permission-based authentication middleware
// const requirePermission = (permission) => {
//     return (req, res, next) => {
//         if (!req.session || !req.session.user) {
//             return res.redirect('/login?error=login_required');
//         }

//         const userPermissions = req.session.user.permissions || [];
        
//         if (!userPermissions.includes(permission)) {
//             return res.status(403).render('pages/error', {
//                 title: 'Access Denied',
//                 message: 'You do not have permission to perform this action.',
//                 statusCode: 403
//             });
//         }

//         next();
//     };
// };

const requireGuest = (req, res, next) => {
    if (req.session && req.session.user) {
        return res.redirect('/dashboard');
    }
    next();
};

module.exports = {
    requireAuth,
    requireRole,
    requireGuest
};
