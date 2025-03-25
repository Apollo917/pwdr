'use strict';

// Types

/**
 * Configuration options for password generation
 */
export interface GeneratePwdOptions {
  /**
   * Desired password length.
   * <br>
   * Must be between 16 and 64 characters
   * @default 32
   */
  length?: number;
  /**
   * Number of key derivation iterations
   * <br>
   * Higher iterations increase computational complexity and security
   * <br>
   * Minimum 100,000, recommended 1,000,000+
   * @default 1,000,000
   */
  iterations?: number;
  /**
   * Cryptographic salt to enhance key derivation
   * <br>
   * Provides additional protection against rainbow table attacks
   * @default 'pwdr-default-salt' (UTF-8 encoded)
   */
  salt?: Uint8Array;
}

type NormalizeNum = (value: number, min?: number, max?: number) => number;
type Erase = (...buffers: Uint8Array[]) => void;
type ConvertToPwd = (pwdSeed: Uint8Array, length: number) => Uint8Array;
export type GeneratePwd = (phrase: Uint8Array, key: Uint8Array, options?: GeneratePwdOptions) => Promise<Uint8Array>;

// Constants

/** Minimum allowed password length */
const MIN_PWD_LENGTH = 16;

/** Maximum allowed password length */
const MAX_PWD_LENGTH = 64;

/** Key derivation algorithm used for secure key generation */
const KEY_DERIVATIONS_ALGORITHM = 'PBKDF2';

/** Cryptographic hashing algorithm for enhanced security */
const HASHING_ALGORITHM = 'SHA-512';

/** Signing algorithm for message authentication */
const SIGNING_ALGORITHM = 'HMAC';

// Functions

/**
 * Normalizes a numeric value within specified bounds
 * @param value Input numeric value to normalize
 * @param min Minimum allowed value
 * @param max Maximum allowed value
 * @returns Normalized numeric value
 */
const normalizeNum: NormalizeNum = (value = 0, min, max) => {
  min = min ?? Number.MIN_SAFE_INTEGER;
  max = max ?? Number.MAX_SAFE_INTEGER;
  min = Math.min(min, max);
  max = Math.max(min, max);

  if (value < min) return min;
  if (value > max) return max;
  return value;
};

/**
 * Securely erases sensitive buffer contents by filling with zeros
 * <br>
 * Helps prevent sensitive data from lingering in memory
 * @param buffers One or more Uint8Array buffers to erase
 */
export const erase: Erase = (...buffers) => {
  buffers.filter((b) => !!b).forEach((b) => b.fill(0));
};

/**
 * Converts a cryptographic seed to a password using character set rotation
 * <br>
 * Ensures password includes diverse character types
 * @param pwdSeed Cryptographic seed for password generation
 * @param length Desired password length
 * @returns Generated password as Uint8Array
 */
const convertToPwd: ConvertToPwd = (pwdSeed, length) => {
  const charsets = [
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    'abcdefghijklmnopqrstuvwxyz',
    '!@#$%^&*()-_=+[]{}|;:,.<>?',
    '0123456789',
  ];
  const result = new Uint8Array(length);

  pwdSeed.forEach((num, i) => {
    const charsetIndex = i % charsets.length;
    const charset = charsets[charsetIndex];
    result[i] = charset.charAt(num % charset.length).charCodeAt(0);
  });

  erase(pwdSeed);

  return result;
};

/**
 * Generates a deterministic, cryptographically secure password.
 * <br>
 * Consider erasing the phrase, key, salt and result after usage
 *
 * @param phrase Secret user passphrase
 * @param key Application-specific secret key
 * @param options Optional configuration for password generation
 * @returns Promise resolving to cryptographically generated password
 * @throws Error if phrase or key are missing
 */
export const generatePwd: GeneratePwd = async (phrase, key, options) => {
  if (!phrase || !phrase.length || !key || !key.length) {
    erase(phrase, key);
    throw new Error('Phrase and key are required');
  }

  return await (async (): Promise<Uint8Array> => {
    const encoder = new TextEncoder();
    const safePhrase = new Uint8Array(phrase);
    const safeKey = new Uint8Array(key);
    const safeSalt = options?.salt ? new Uint8Array(options.salt) : encoder.encode('pwdr-default-salt');
    const pwdLength = normalizeNum(options?.length ?? 32, MIN_PWD_LENGTH, MAX_PWD_LENGTH);
    const baseKey = await crypto.subtle.importKey('raw', safePhrase, KEY_DERIVATIONS_ALGORITHM, false, ['deriveKey']);

    erase(safePhrase);

    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: KEY_DERIVATIONS_ALGORITHM,
        salt: safeSalt,
        iterations: normalizeNum(options?.iterations ?? 1_000_000, 100_000),
        hash: HASHING_ALGORITHM,
      },
      baseKey,
      { name: SIGNING_ALGORITHM, hash: HASHING_ALGORITHM, length: 256 },
      false,
      ['sign'],
    );

    erase(safeSalt);

    const signature = await crypto.subtle.sign(SIGNING_ALGORITHM, derivedKey, safeKey);

    erase(safeKey);

    return Promise.resolve(convertToPwd(new Uint8Array(signature), pwdLength));
  })();
};
