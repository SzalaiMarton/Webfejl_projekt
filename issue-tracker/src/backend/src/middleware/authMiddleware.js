/**
 * Auth Middleware
 * Felhasználó hitelesítésének ellenőrzése
 */
export function requireAuth(req, res, next) {
  try {
    // Authorization header ellenőrzése
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Authorization header is missing',
        status: 401
      });
    }

    // Bearer token formátum ellenőrzése
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        error: 'Invalid authorization header format',
        status: 401
      });
    }

    // Egyszerű token validáció - valós alkalmazásban: JWT
    // Ez most csak egy placeholder, JWT-t lehetne használni
    req.userId = token; // A token az user ID

    next();
  } catch (error) {
    res.status(401).json({
      error: 'Authentication failed',
      status: 401
    });
  }
}

/**
 * Optional Auth Middleware
 * Nem kötelező hitelesítés
 */
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
