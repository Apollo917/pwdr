'use strict';

import crypto from 'node:crypto';

type Encoding = 'base64' | 'hex';
type NormalizeNum = (value: number, min?: number, max?: number) => number;
type IsBlank = (val?: string | null) => boolean;
type Hash = (data: string, encoding?: Encoding) => Promise<string>;
type Slice = (str: string, sliceSize: number) => string[];
type AppendWithChar = (val: string, offset: number) => string;
type GenerateKeyOffsets = (key: string) => Promise<number[]>;
type GenerateSeed = (phrase: string, minLength: number) => Promise<string>;
export type GeneratePwd = (phrase: string, key: string, length?: number) => Promise<string>;

const CHARS = `!"#$%&'()*+,-./:;<=>?@[\]^_~{|}~`;
const MAX_OFFSET = 20_000;
const PWD_CHUNK_SIZE = 4;

const normalizeNum: NormalizeNum = (value = 0, min, max) => {
  min = min ?? Number.MIN_SAFE_INTEGER;
  max = max ?? Number.MAX_SAFE_INTEGER;
  min = Math.min(min, max);
  max = Math.max(min, max);

  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const isBlank: IsBlank = (val) => {
  return val === undefined || val === null || val === '' || val.trim() === '';
};

const hash: Hash = async (data, encoding = 'base64') => {
  return crypto.createHash('sha512').update(data).digest(encoding);
};

const slice: Slice = (str, sliceSize) => {
  sliceSize = normalizeNum(sliceSize, 1);
  return str.match(new RegExp(`.{1,${sliceSize}}`, 'g')) ?? [];
};

const appendWithChar: AppendWithChar = (str, offset) => {
  return str + CHARS.charAt(Math.abs(offset) % CHARS.length);
};

const generateKeyOffsets: GenerateKeyOffsets = async (key) => {
  return await hash(key)
    .then((hash) => slice(hash, 4))
    .then((slices) => Promise.all(slices.map((slice) => hash(slice, 'hex'))))
    .then((hashes) => hashes.map((hash) => Number.parseInt(hash.slice(0, 8), 16)))
    .then((offsets) => offsets.map((offset) => Math.floor((offset / 0xffffffff) * MAX_OFFSET)));
};

const generateSeed: GenerateSeed = async (phrase, minLength) => {
  const sliceSize = 4;
  const seed = await hash(phrase)
    .then((hash) => slice(hash, sliceSize))
    .then((slices) => slices.map(appendWithChar))
    .then((slices) => Promise.all(slices.map((slice) => hash(slice))))
    .then((hashes) => hashes.flatMap((hash) => slice(hash, sliceSize)))
    .then((slices) => slices.map(appendWithChar))
    .then((slices) => slices.join(''));

  return seed.length >= minLength ? seed : seed + (await generateSeed(seed, minLength - seed.length));
};

export const generatePwd: GeneratePwd = async (phrase, key, length = 32) => {
  if (isBlank(phrase)) throw new Error('Phrase is required');
  if (isBlank(key)) throw new Error('Key is required');

  phrase = phrase.trim();
  key = key.trim();
  length = normalizeNum(length ?? 32, 16, 64);

  const offsets = await generateKeyOffsets(key);
  const lastPwdChunkSize = PWD_CHUNK_SIZE + (length % PWD_CHUNK_SIZE);
  const minSeedLength = Math.max(...offsets) + lastPwdChunkSize;
  const seed = await generateSeed(phrase + key, minSeedLength);
  const lastOffsetIndex = 0;

  return offsets
    .map((offset, i) => seed.slice(offset, offset + (i === lastOffsetIndex ? lastPwdChunkSize : PWD_CHUNK_SIZE)))
    .join('')
    .slice(0, length);
};
