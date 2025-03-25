<div align="center">

# 🔣 Pwdr

A utility for generating deterministic passwords using a phrase and key

[![version](https://img.shields.io/npm/v/pwdr?style=for-the-badge)](https://www.npmjs.com/package/pwdr)
[![license](https://img.shields.io/npm/l/pwdr?style=for-the-badge)](https://github.com/Apollo917/pwdr/blob/main/LICENSE)
[![size](https://img.shields.io/bundlephobia/minzip/pwdr?style=for-the-badge)](https://bundlephobia.com/result?p=pwdr)
[![downloads](https://img.shields.io/npm/dw/pwdr?style=for-the-badge)](https://www.npmjs.com/package/pwdr)

</div>

## 📦 Installation

```bash
npm i pwdr
```

## 🚀 Quickstart

```javascript
import { generatePwd } from 'pwdr';

const encoder = new TextEncoder();
const phrase = encoder.encode('phrase');
const key = encoder.encode('key');

const pwdBuffer = await generatePwd(phrase, key);
```

```javascript
import { generatePwd, erase } from 'pwdr';

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const phrase = encoder.encode('phrase');
const key = encoder.encode('key');
const salt = encoder.encoding('salt');

const pwdBuffer = await generatePwd(phrase, key, { length: 32, iterations: 1_000_000, salt });
const pwd = decoder.decode(pwdBuffer);

erase(phrase, key, salt, pwdBuffer);
```

### 🔢 Resulting password

- Minimum length: 16
- Maximum length: 64
- Default length: 32

## 🔁 Version compatibility check

- phrase: `compatibility_check_phrase`
- key: `compatibility_check_key`
- length: `32`

### 🏷️ Versions

- **v1.x.x**
    - result: `1e9/wtB["D0NS/oCa/ra9p,v'NHBT4GQ`
- **v2.x.x**
    - result: `Ey,7Lg#4Vp(9Dg^2Nm_3Rm@5Bv!5Zj^8`