import { HttpContext } from '@adonisjs/core/http';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import env from '#start/env';

interface JWK {
  kid: string
  kty: string
  use: string
  n: string
  e: string
  alg: string
}

interface ClerkJWTPayload {
  sub: string // User ID
  iat: number
  exp: number
  iss: string
  aud: string
  [key: string]: string | number | boolean | object
}

declare module '@adonisjs/core/http' {
  interface Request {
    user?: ClerkJWTPayload
    user_id?: string
  }
}

export default class ClerkAuth {
  public async handle(
    { request, response }: HttpContext,
    next: () => Promise<void>
  ) {
    try {
      const authHeader = request.header('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return response.unauthorized({
          message: 'Invalid Authorization Header',
        });
      }
      const token = authHeader.split(' ')[1];
      const jwksUrl = env.get('JWKS_URL');
      const { data } = await axios.get(jwksUrl);

      if (!data.keys || data.keys.length === 0) {
        return response.unauthorized({
          message: 'Failed to retrieve public keys',
        });
      }
      const decodedHeader = jwt.decode(token, { complete: true });
      if (
        !decodedHeader ||
        !decodedHeader.header ||
        !decodedHeader.header.kid
      ) {
        return response.unauthorized({ message: 'Invalid JWT structure' });
      }
      const key = data.keys.find((k: JWK) => k.kid === decodedHeader.header.kid)
      if (!key) {
        return response.unauthorized({ message: 'No matching key found' });
      }
      const publicKey = jwkToPem(key);
      const verifiedPayload = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
      }) as ClerkJWTPayload
      
      // Save both the full payload and the user ID for easy access
      request.user = verifiedPayload
      request.user_id = verifiedPayload.sub
      
      await next()
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return response.unauthorized({ message: 'Invalid or expired token' });
    }
  }
}
