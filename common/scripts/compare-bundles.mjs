import { appendFileSync, readFileSync } from 'fs';

if (process.argv.length < 4) {
  console.error('Usage: node compare-bundles.js <baseReportPath> <currentReportPath>');
  process.exit(1);
}

const [basePath, currentPath] = process.argv.slice(2);

function loadReport(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch (err) {
    console.error(`Failed to read or parse ${path}:`, err.message);
    process.exit(1);
  }
}

function extractSizes(report) {
  const sizes = {};
  for (const entry of report) {
    const name = entry.label || entry.fileName;
    sizes[name] = entry.parsedSize;
  }
  return sizes;
}

function getAllBundleNames(baseSizes, currentSizes) {
  const all = new Set([...Object.keys(baseSizes), ...Object.keys(currentSizes)]);
  const names = Array.from(all);

  // Make build.bundle.js appear first in the sorted list
  // This assumes that build.bundle.js is the main bundle we care about
  // and should be prioritized in the output.
  names.sort((a, b) => {
    if (a === 'build.bundle.js') return -1;
    if (b === 'build.bundle.js') return 1;
    return a.localeCompare(b);
  });
  return names;
}

function formatTable(baseSizes, currentSizes, bundleNames) {
  let output = `| Bundle | Base Size (bytes) | Current Size (bytes) | Change | Delta (bytes) |\n`;
  output += `|--------|-------------------|------------------------|--------|--------|\n`;

  for (const name of bundleNames) {
    const base = baseSizes[name] || 0;
    const current = currentSizes[name] || 0;
    const delta = current - base;

    const change = current > base
      ? '⚠️ increased'
      : current < base
      ? '⬇️ decreased'
      : '➖ unchanged';

    output += `| ${name} | ${base} | ${current} | ${change} | ${delta} |\n`;
  }

  return output;
}

// Run
const baseReport = loadReport(basePath);
const currentReport = loadReport(currentPath);

const baseSizes = extractSizes(baseReport);
const currentSizes = extractSizes(currentReport);

const bundleNames = getAllBundleNames(baseSizes, currentSizes);
let markdown = formatTable(baseSizes, currentSizes, bundleNames);

// Add total
const totalBase = Object.values(baseSizes).reduce((sum, size) => sum + size, 0);
const totalCurrent = Object.values(currentSizes).reduce((sum, size) => sum + size, 0);
const totalDelta = totalCurrent - totalBase;
const readableDelta =
  Math.abs(totalDelta) > 1024
    ? `${(totalDelta / 1024).toFixed(1)} KB`
    : `${totalDelta} B`;

const summaryEmoji = totalDelta > 0 ? '⚠️' : totalDelta < 0 ? '⬇️' : '➖';
const summaryText = `**Total change:** ${totalDelta >= 0 ? '+' : ''}${readableDelta} ${summaryEmoji}`;
markdown += `\n${summaryText}\n`;

// Output to GitHub Actions environment variable
appendFileSync(process.env.GITHUB_OUTPUT, `bundle_diff_comment<<EOF\n${markdown}\nEOF\n`);
appendFileSync(process.env.GITHUB_OUTPUT, `diff=${totalDelta}\n`);
