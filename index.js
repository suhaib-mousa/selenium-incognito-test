// selenium-incognito-tool/index.js
import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const chromeLauncher = require('chrome-launcher');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { config } = require('./package.json');
const { url, times, delay, headless, mode, screenshot } = config;
const {
  pattern: screenshotPattern = 'screenshot-{index}.png',
  condition = 'all',
  disabled: screenshotDisabled = false
} = screenshot || {};

async function getChromePath() {
  if (config.chromePath) return config.chromePath;
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;

  const installations = await chromeLauncher.Launcher.getInstallations();
  return installations[0] || null;
}
const chromePath = await getChromePath();

const driverPath = path.resolve(
  './node_modules/chromedriver/lib/chromedriver/chromedriver.exe'
);

function shouldTakeScreenshot(index) {
  if (screenshotDisabled || mode === 'perf') return false;
  const i = index + 1;
  switch (condition) {
    case 'odd': return i % 2 === 1;
    case 'even': return i % 2 === 0;
    case 'none': return false;
    default:
      if (condition.startsWith('every-')) {
        const n = parseInt(condition.split('-')[1], 10);
        return !isNaN(n) && i % n === 0;
      }
      return true;
  }
}

async function runTest() {
  console.log("🚀 Starting automation tool with mode:", mode);
  const results = [];

  for (let i = 0; i < times; i++) {
    console.log(`🔁 [${i + 1}/${times}] Opening: ${url}`);

    const service = new chrome.ServiceBuilder(driverPath);
    const options = new chrome.Options();
    options.addArguments('--incognito');
    if (headless) options.addArguments('--headless=new');
    if (chromePath) {
      options.setChromeBinaryPath(chromePath);
    } else {
      console.error('❌ Chrome executable not found. Please set it via config.chromePath, CHROME_PATH env variable, or install Chrome.');
      process.exit(1);
    }

    let driver;
    try {
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .setChromeService(service)
        .build();

      const start = Date.now();
      await driver.get(url);
      const end = Date.now();

      let screenshotFilePath = null;
      if (shouldTakeScreenshot(i)) {
        const formatted = screenshotPattern.replace('{index}', i + 1);
        screenshotFilePath = path.join(__dirname, formatted);
        const screenshot = await driver.takeScreenshot();
        fs.writeFileSync(screenshotFilePath, screenshot, 'base64');
      }

      results.push({
        url,
        status: 'success',
        loadTimeMs: end - start,
        screenshot: screenshotFilePath
      });

      await new Promise(res => setTimeout(res, delay));
      await driver.quit();
      console.log(`✅ Completed [${i + 1}/${times}]`);
    } catch (err) {
      console.error('🧨 Error:', err);
      results.push({ url, status: 'error', error: err.message });
      if (driver) await driver.quit();
    }
  }

  const reportPath = path.join(__dirname, 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log('📄 Report written to:', reportPath);
  console.log('🎉 Automation complete.');
}

runTest();
