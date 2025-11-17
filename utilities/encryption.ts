import crypto from 'crypto';
import env from '#start/env';

interface InvitationData {
  email: string;
  businessId: string;
  timestamp: string;
  roleId: string;
}

interface SingleValueData {
  value: string;
}

export class EncryptionService {
  private static readonly algorithm = 'aes-256-gcm';
  private static readonly secretKey = crypto.scryptSync(env.get('APP_KEY'), 'invitation-salt', 32);

  /**
   * Encrypts a full invitation object
   */
  static encryptInvitationData(data: InvitationData | SingleValueData): string {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv);
      cipher.setAAD(Buffer.from('invitation-data'));

      const text = JSON.stringify(data);
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();
      
      // Combine iv, authTag, and encrypted data
      const combined = iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;

      // Base64 encode for URL safety
      return Buffer.from(combined).toString('base64url');
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt invitation data');
    }
  }

  /**
   * Decrypts invitation token back to original data
   */
  static decryptInvitationData<T = InvitationData | SingleValueData>(encryptedToken: string): T {
    try {
      const combined = Buffer.from(encryptedToken, 'base64url').toString();
      const parts = combined.split(':');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const iv = Buffer.from(parts[0], 'hex');
      const authTag = Buffer.from(parts[1], 'hex');
      const encrypted = parts[2];

      const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, iv);
      decipher.setAAD(Buffer.from('invitation-data'));
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt invitation data - invalid or corrupted token');
    }
  }

  /**
   * Helpers for single values
   */
  static encryptValue(value: string): string {
    return this.encryptInvitationData({ value });
  }

  static decryptValue(token: string): string {
    const obj = this.decryptInvitationData<SingleValueData>(token);
    return obj.value;
  }

  /**
   * Validates if the encrypted token is valid and not tampered with
   */
  static validateToken(encryptedToken: string): boolean {
    try {
      this.decryptInvitationData(encryptedToken);
      return true;
    } catch {
      return false;
    }
  }
}