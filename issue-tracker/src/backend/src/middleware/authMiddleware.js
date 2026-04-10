export function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Authorization header is missing',
        status: 401
      });
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        error: 'Invalid authorization header format',
        status: 401
      });
    }

    req.userId = token;

    next();
  } catch (error) {
    res.status(401).json({
      error: 'Authentication failed',
      status: 401
    });
  }
}

export function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const [scheme, token] = authHeader.split(' ');
      if (scheme === 'Bearer' && token) {
        req.userId = token;
      }
    }

    next();
  } catch (error) {
    next();
  }
}

export function requireSessionAuth(req, res, next) {
  console.log(req.session)
  try {
    if (req.session && req.session.userId) {
      req.userId = req.session.userId;
      return next();
    }

    return res.status(401).json({ error: 'Not authenticated', status: 401 });
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed', status: 401 });
  }
}
