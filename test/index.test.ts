import type { GeneratePwdOptions } from '../src';
import { generatePwd, erase } from '../src';

describe('generatePwd', () => {
  const textEncoder = new TextEncoder();
  const textDecoder = new TextDecoder();
  const phrase = textEncoder.encode('compatibility_check_phrase');
  const key = textEncoder.encode('compatibility_check_key');
  const prevVersionCompatibilityResult = textEncoder.encode(`Ey,7Lg#4Vp(9Dg^2Nm_3Rm@5Bv!5Zj^8`);
  const pwdMinLength = 16;
  const pwdMaxLength = 64;
  const pwdDefaultLength = 32;

  it('compatibility', async () => {
    const options: GeneratePwdOptions = {
      length: 32,
    };

    await expect(generatePwd(phrase, key, options)).resolves.toEqual(prevVersionCompatibilityResult);
  });

  it('should generate password', async () => {
    await expect(generatePwd(phrase, key)).resolves.toHaveLength(pwdDefaultLength);
  });

  it('length should define password length not the content', async () => {
    const pwd1 = textDecoder.decode(await generatePwd(phrase, key, { length: 64 }));
    const pwd2 = textDecoder.decode(await generatePwd(phrase, key, { length: 32 }));
    const pwd3 = textDecoder.decode(await generatePwd(phrase, key, { length: 16 }));

    expect(pwd1).toContain(pwd2);
    expect(pwd2).toContain(pwd3);
  });

  it('should generate password of provided length', async () => {
    await expect(generatePwd(phrase, key, { length: 20 })).resolves.toHaveLength(20);
    await expect(generatePwd(phrase, key, { length: 30 })).resolves.toHaveLength(30);
    await expect(generatePwd(phrase, key, { length: 40 })).resolves.toHaveLength(40);
  });

  it('should generate password with min length when provided length < min length', async () => {
    await expect(generatePwd(phrase, key, { length: 0 })).resolves.toHaveLength(pwdMinLength);
  });

  it('should generate password with max length when provided length > max length', async () => {
    await expect(generatePwd(phrase, key, { length: 999 })).resolves.toHaveLength(pwdMaxLength);
  });

  it('should generate password with default length when provided length is undefined, null', async () => {
    await expect(generatePwd(phrase, key, undefined)).resolves.toHaveLength(pwdDefaultLength);
    // @ts-expect-error: for testing purposes
    await expect(generatePwd(phrase, key, null)).resolves.toHaveLength(pwdDefaultLength);
  });

  it('should throw error when phrase value is undefined, null, empty', async () => {
    // @ts-expect-error: for testing purposes
    await expect(() => generatePwd(undefined, key)).rejects.toThrow();
    // @ts-expect-error: for testing purposes
    await expect(() => generatePwd(null, key)).rejects.toThrow();
    await expect(() => generatePwd(new Uint8Array(), key)).rejects.toThrow();
  });

  it('should throw error when key value is undefined, null, empty', async () => {
    // @ts-expect-error: for testing purposes
    await expect(() => generatePwd(phrase, undefined)).rejects.toThrow();
    // @ts-expect-error: for testing purposes
    await expect(() => generatePwd(phrase, null)).rejects.toThrow();
    await expect(() => generatePwd(phrase, new Uint8Array())).rejects.toThrow();
  });

  it('should erase Uint8Array', async () => {
    const actual = textEncoder.encode('test');
    const expected = new Uint8Array([0, 0, 0, 0]);

    erase(actual);

    expect(actual).toEqual(expected);
  });

  it('should erase non null Uint8Arrays', async () => {
    const actual1 = textEncoder.encode('test');
    const actual2 = null;
    const actual3 = undefined;
    const actual4 = textEncoder.encode('tset');
    const expected = new Uint8Array([0, 0, 0, 0]);

    // @ts-expect-error: for testing purposes
    erase(actual1, actual2, actual3, actual4);

    expect(actual1).toEqual(expected);
    expect(actual2).toEqual(null);
    expect(actual3).toEqual(undefined);
    expect(actual4).toEqual(expected);
  });
});
