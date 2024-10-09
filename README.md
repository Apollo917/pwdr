<div align="center">

# 🔣 Pwdr

A utility for generating deterministic passwords based on a phrase and key

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

### CommonJS

```javascript
const { generatePwd } = require('pwdr');

const pwd = await generatePwd('phrase', 'key');
```

### ESM

```javascript
import { generatePwd } from 'pwdr';

const pwd = await generatePwd('phrase', 'key');
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

- **v <= 1.0.1**
    - output: `1e9/wtB["D0NS/oCa/ra9p,v'NHBT4GQ`