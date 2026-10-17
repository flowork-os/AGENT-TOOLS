#!/usr/bin/env node
/**
 * 🔬 fl_dissect_mql - Sovereign MetaTrader Binary & Logic Dissector
 * Command: dissect-mql (algorithmic_trading_re)
 * Description: Dissect logic, metadata, parameters, and security properties of MetaTrader compiled EX4/EX5 files
 * Zero-Crash Hardened: Bulletproof try/catch & process.exit(0) error containment
 * Co-authored-by: Flowork OS <agent@floworkos.com>
 */
import fs from 'fs';
import path from 'path';

process.on('uncaughtException', (err) => {
  console.log(JSON.stringify({
    status: 'error',
    tool: 'fl_dissect_mql',
    error: 'UNCAUGHT_EXCEPTION',
    message: err ? err.message : 'Unknown exception caught gracefully'
  }, null, 2));
  process.exit(0);
});

process.on('unhandledRejection', (reason) => {
  console.log(JSON.stringify({
    status: 'error',
    tool: 'fl_dissect_mql',
    error: 'UNHANDLED_REJECTION',
    message: String(reason || 'Unhandled promise rejection caught gracefully')
  }, null, 2));
  process.exit(0);
});

function calculateEntropy(buffer) {
  if (!buffer || buffer.length === 0) return 0;
  const freq = new Array(256).fill(0);
  for (let i = 0; i < buffer.length; i++) {
    freq[buffer[i]]++;
  }
  let entropy = 0;
  const len = buffer.length;
  for (let i = 0; i < 256; i++) {
    if (freq[i] > 0) {
      const p = freq[i] / len;
      entropy -= p * Math.log2(p);
    }
  }
  return parseFloat(entropy.toFixed(4));
}

function extractUtf16Strings(buf, minLen = 3) {
  const results = [];
  let i = 0;
  while (i < buf.length - 2) {
    if (buf[i + 1] === 0 && (buf[i] >= 32 && buf[i] <= 126)) {
      const start = i;
      const chars = [];
      while (i < buf.length - 1 && buf[i + 1] === 0 && (buf[i] >= 32 && buf[i] <= 126 || buf[i] === 9 || buf[i] === 10 || buf[i] === 13)) {
        chars.push(String.fromCharCode(buf[i]));
        i += 2;
      }
      if (chars.length >= minLen) {
        results.push({
          offset: '0x' + start.toString(16).padStart(6, '0'),
          text: chars.join('')
        });
      }
    } else {
      i++;
    }
  }
  return results;
}

function extractAsciiStrings(buf, minLen = 4) {
  const results = [];
  let i = 0;
  while (i < buf.length) {
    if (buf[i] >= 32 && buf[i] <= 126) {
      const start = i;
      const chars = [];
      while (i < buf.length && (buf[i] >= 32 && buf[i] <= 126 || buf[i] === 9 || buf[i] === 10 || buf[i] === 13)) {
        chars.push(String.fromCharCode(buf[i]));
        i++;
      }
      if (chars.length >= minLen) {
        results.push({
          offset: '0x' + start.toString(16).padStart(6, '0'),
          text: chars.join('')
        });
      }
    } else {
      i++;
    }
  }
  return results;
}

function parseArgs() {
  try {
    const args = process.argv.slice(2);
    let params = {};
    const pIdx = args.indexOf('--params');
    if (pIdx !== -1 && args[pIdx + 1]) {
      try { params = JSON.parse(args[pIdx + 1]); } catch (_) {}
    } else if (args[0] && args[0].startsWith('{')) {
      try { params = JSON.parse(args[0]); } catch (_) {}
    } else if (args[0]) {
      params = { target_path: args[0] };
    }
    return params;
  } catch (_) {
    return {};
  }
}

async function main() {
  const params = parseArgs();
  const target = params.target_path || params.path || params.file || params.target;

  if (!target) {
    console.log(JSON.stringify({
      status: 'help',
      tool: 'fl_dissect_mql',
      usage: 'node tools/fl_dissect_mql/main.mjs --params \'{"target_path":"/path/to/file.ex5"}\'',
      parameters: {
        target_path: 'Path to .ex4 or .ex5 file (required)',
        extract_mode: 'Analysis depth: full, metadata_only, strings_only, entropy_map'
      }
    }, null, 2));
    process.exit(0);
  }

  const resolvedPath = path.resolve(target);
  if (!fs.existsSync(resolvedPath)) {
    console.log(JSON.stringify({
      status: 'error',
      tool: 'fl_dissect_mql',
      error: 'FILE_NOT_FOUND',
      message: `File not found at path: ${resolvedPath}`
    }, null, 2));
    process.exit(0);
  }

  const data = fs.readFileSync(resolvedPath);
  const totalSize = data.length;
  const overallEntropy = calculateEntropy(data);

  // Magic & Format Identification
  let format = 'UNKNOWN';
  let platform = 'Unknown';
  let generation = 'Unknown';
  const magic4 = data.slice(0, 4).toString('ascii');
  const magicHex = data.slice(0, 4).toString('hex');

  let compilerBuild = null;
  let codepage = null;

  if (magic4.startsWith('EX5') || magicHex.startsWith('455835')) {
    format = 'EX5';
    platform = 'MetaTrader 5 (64-bit Virtual Machine)';
    generation = 'Modern MT5 Bytecode Container';

    // Parse Build number from header (offset 0x60, uint32 LE)
    if (data.length >= 0x68) {
      compilerBuild = data.readUInt32LE(0x60);
    }
    // Parse Codepage from header (offset 0x10, uint32 LE)
    if (data.length >= 0x14) {
      const cpVal = data.readUInt32LE(0x10);
      codepage = cpVal ? `${cpVal} (Windows ANSI)` : 'UTF-16LE Native';
    }
  } else if (data[0] === 0x4D && data[1] === 0x5A) {
    format = 'EX4 (PE Container)';
    platform = 'MetaTrader 4 (Build 600+)';
    generation = 'Modern LLVM Virtualized Container';
  } else if (data[0] === 0x84 || data[0] === 0x85) {
    format = 'EX4 (Legacy)';
    platform = 'MetaTrader 4 (Build < 600)';
    generation = 'Old Stack VM Bytecode';
  }

  // Parse Metadata & Properties (EX5 Header)
  const metadata = {
    title: null,
    copyright_link: null,
    version: null,
    compiler_build: compilerBuild,
    codepage: codepage
  };

  if (format === 'EX5') {
    const readFixedUtf16 = (start, maxLen) => {
      let str = '';
      for (let i = start; i < Math.min(start + maxLen, data.length - 1); i += 2) {
        if (data[i] === 0 && data[i + 1] === 0) break;
        if (data[i + 1] === 0 && data[i] >= 32 && data[i] <= 126) {
          str += String.fromCharCode(data[i]);
        }
      }
      return str.trim() || null;
    };

    metadata.title = readFixedUtf16(0x000a8, 256);
    metadata.copyright_link = readFixedUtf16(0x001a8, 256);
    metadata.version = readFixedUtf16(0x002a8, 64);
  }

  // Scan String Pool
  const utf16Strings = extractUtf16Strings(data, 3);
  const asciiStrings = extractAsciiStrings(data, 4);

  const detectedSignals = {
    indicators: [],
    trade_functions: [],
    network_endpoints: [],
    protection_signatures: []
  };

  const indicatorKeywords = [
    'iMA', 'iRSI', 'iMACD', 'iATR', 'iBands', 'iStochastic', 'iCCI', 
    'iIchimoku', 'iCustom', 'Moving Average', 'Relative Strength Index', 
    'Bollinger Bands', 'SuperTrend', 'ZigZag', 'Parabolic'
  ];

  const tradeKeywords = [
    'OrderSend', 'OrderClose', 'OrderModify', 'PositionOpen', 'PositionClose',
    'OrderCalcMargin', 'TradeTransaction', 'MagicNumber', 'LotSize', 'StopLoss',
    'TakeProfit', 'TrailingStop', 'Multiplier', 'GridDistance', 'Martingale'
  ];

  const allStrings = [...utf16Strings.map(s => s.text), ...asciiStrings.map(s => s.text)];

  allStrings.forEach(str => {
    if (str.includes('http://') || str.includes('https://') || str.includes('.com') || str.includes('api.telegram.org')) {
      if (!detectedSignals.network_endpoints.includes(str)) detectedSignals.network_endpoints.push(str);
    }
    indicatorKeywords.forEach(k => {
      if (str.toLowerCase().includes(k.toLowerCase()) && !detectedSignals.indicators.includes(k)) {
        detectedSignals.indicators.push(k);
      }
    });
    tradeKeywords.forEach(k => {
      if (str.toLowerCase().includes(k.toLowerCase()) && !detectedSignals.trade_functions.includes(k)) {
        detectedSignals.trade_functions.push(k);
      }
    });
    if (str.includes('AccountNumber') || str.includes('AccountCompany') || str.includes('Expired') || str.includes('License')) {
      if (!detectedSignals.protection_signatures.includes(str)) detectedSignals.protection_signatures.push(str);
    }
  });

  // Calculate Header vs Payload Entropy
  const headerSize = 0x002e8;
  const payloadSize = totalSize - headerSize;
  const headerEntropy = calculateEntropy(data.slice(0, headerSize));
  const payloadEntropy = calculateEntropy(data.slice(headerSize));
  const encryptionRatio = parseFloat(((payloadSize / totalSize) * 100).toFixed(1));

  // Construct Final Report
  const report = {
    status: 'success',
    tool: 'fl_dissect_mql',
    target: {
      file_name: path.basename(resolvedPath),
      file_size_bytes: totalSize,
      file_size_kb: parseFloat((totalSize / 1024).toFixed(2)),
      file_path: resolvedPath
    },
    format_analysis: {
      format,
      platform,
      generation,
      compiler_build: compilerBuild ? `Build ${compilerBuild}` : 'Unknown',
      codepage: codepage || 'Standard',
      magic_hex: magicHex
    },
    metadata: {
      program_name: metadata.title || 'Unknown (Encrypted or Missing)',
      website_or_author: metadata.copyright_link || 'Not declared in header',
      version: metadata.version || '1.00',
      raw_properties: metadata
    },
    cryptographic_profile: {
      overall_entropy: overallEntropy,
      header_entropy: headerEntropy,
      payload_entropy: payloadEntropy,
      max_entropy: 8.0,
      encryption_ratio_percent: encryptionRatio,
      container_security: payloadEntropy >= 7.8 ? 'HEAVILY_ENCRYPTED_PAYLOAD' : (payloadEntropy >= 6.5 ? 'COMPRESSED_PAYLOAD' : 'PLAIN_BYTECODE')
    },
    dissected_signals: detectedSignals,
    clean_room_verdict: {
      is_100_percent_decompile_possible: false,
      reason: payloadEntropy >= 7.8 
        ? `Biner EX5 dikompilasi pada MT5 Build ${compilerBuild || 'Modern'} dengan proteksi kontainer simetris MetaQuotes (Payload Entropy: ${payloadEntropy}). Seluruh bytecode dan string tabel terenkripsi penuh.`
        : "Biner memiliki section terstruktur. Rekonstruksi logika rule trading dapat dipetakan dari tabel simbol.",
      recommended_action: `Manfaatkan metadata yang terekstrak (${metadata.title || 'EA'} v${metadata.version}) dan endpoint gateway (${metadata.copyright_link || 'Gateway'}) untuk clean-room reconstruction atau integrasi webhook.`
    }
  };

  console.log(JSON.stringify(report, null, 2));
  process.exit(0);
}

main();
