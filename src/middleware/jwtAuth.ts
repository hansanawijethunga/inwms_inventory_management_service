import type { Request, Response, NextFunction } from 'express';
// Extend Express Request type to include user
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      sub: string;
      username: string;
      roles: string[];
    };
  }
}
import jwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';
import type { JwtHeader, SigningKeyCallback } from 'jsonwebtoken';

const jwksUri = process.env.JWKS_URI;

const client = jwksClient({
  jwksUri: jwksUri as string,
  cache: true,
  rateLimit: true,
});

function getKey(header: JwtHeader, callback: SigningKeyCallback) {
  // If kid is missing, default to 'default' (matches your JWKS)
  const kid = header.kid || 'default';
  console.log('JWT header:', header);
  client.getSigningKey(kid, function (err: any, key: any) {
    if (err) {
      console.error('Error getting signing key:', err);
      return callback(err);
    }
    const signingKey = key?.getPublicKey();
    console.log('Using signing key for kid:', kid);
    callback(null, signingKey);
  });
}

export function jwtAuth() {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.split(' ')[1];
    if (typeof token !== 'string') {
      return res.status(401).json({ error: 'Invalid token format' });
    }
    // console.log('Verifying token:', token);
    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err: any, decoded: any) => {
      if (err) return res.status(401).json({ error: 'Invalid token' });
      // Attach user info to request
      req.user = {
        sub: decoded.sub,
        username: decoded.username,
        roles: decoded.roles,
      };
      next();
    });
  };
}
