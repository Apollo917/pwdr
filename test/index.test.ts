import { generatePwd } from '../src';

describe('generatePwd', () => {
  const phrase = 'compatibility_check_phrase';
  const key = 'compatibility_check_key';
  const prevVersionCompatibilityResult = `1e9/wtB["D0NS/oCa/ra9p,v'NHBT4GQ`;
  const pwdMinLength = 16;
  const pwdMaxLength = 64;
  const pwdDefaultLength = 32;

  it('compatibility', async () => {
    await expect(generatePwd(phrase, key, 32)).resolves.toBe(prevVersionCompatibilityResult);
  });

  it('should generate password', async () => {
    await expect(generatePwd(phrase, key)).resolves.toHaveLength(pwdDefaultLength);
  });

  it('length should define password length not the content', async () => {
    const pwd1 = await generatePwd(phrase, key, 64);
    const pwd2 = await generatePwd(phrase, key, 32);
    const pwd3 = await generatePwd(phrase, key, 16);

    expect(pwd1).toContain(pwd2);
    expect(pwd2).toContain(pwd3);
  });

  it('should generate password of provided length', async () => {
    await expect(generatePwd(phrase, key, 20)).resolves.toHaveLength(20);
    await expect(generatePwd(phrase, key, 30)).resolves.toHaveLength(30);
    await expect(generatePwd(phrase, key, 40)).resolves.toHaveLength(40);
  });

  it('should generate password with min length when provided length < min length', async () => {
    await expect(generatePwd(phrase, key, 0)).resolves.toHaveLength(pwdMinLength);
  });

  it('should generate password with max length when provided length > max length', async () => {
    await expect(generatePwd(phrase, key, 999)).resolves.toHaveLength(pwdMaxLength);
  });

  it('should generate password with default length when provided length is undefined, null', async () => {
    await expect(generatePwd(phrase, key, undefined)).resolves.toHaveLength(pwdDefaultLength);
    // @ts-expect-error: for testing purposes
    await expect(generatePwd(phrase, key, null)).resolves.toHaveLength(pwdDefaultLength);
  });

  it('should throw error when phrase value is undefined, null, empty or blank', async () => {
    // @ts-expect-error: for testing purposes
    await expect(() => generatePwd(undefined, key)).rejects.toThrow();
    // @ts-expect-error: for testing purposes
    await expect(() => generatePwd(null, key)).rejects.toThrow();
    await expect(() => generatePwd('', key)).rejects.toThrow();
    await expect(() => generatePwd('   ', key)).rejects.toThrow();
  });

  it('should throw error when key value is undefined, null, empty, blank', async () => {
    // @ts-expect-error: for testing purposes
    await expect(() => generatePwd(phrase, undefined)).rejects.toThrow();
    // @ts-expect-error: for testing purposes
    await expect(() => generatePwd(phrase, null)).rejects.toThrow();
    await expect(() => generatePwd(phrase, '')).rejects.toThrow();
    await expect(() => generatePwd(phrase, '   ')).rejects.toThrow();
  });

  it('should generate equal passwords for the same phrase with and without a leading or trailing spaces', async () => {
    const expected = await generatePwd(phrase, key);

    await expect(generatePwd(`   ${phrase}`, key)).resolves.toBe(expected);
    await expect(generatePwd(`${phrase}   `, key)).resolves.toBe(expected);
  });

  it('should generate equal passwords for the same key with and without a leading or trailing spaces', async () => {
    const expected = await generatePwd(phrase, key);

    await expect(generatePwd(phrase, `   ${key}`)).resolves.toBe(expected);
    await expect(generatePwd(phrase, `${key}   `)).resolves.toBe(expected);
  });
});
