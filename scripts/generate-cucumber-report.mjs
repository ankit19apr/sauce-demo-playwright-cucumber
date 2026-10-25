import { mkdir, copyFile } from 'node:fs/promises';
import { generate } from 'multiple-cucumber-html-reporter';

await mkdir('./cucumber-json', { recursive: true });

await copyFile(
  './cucumber-report.json',
  './cucumber-json/cucumber-report.json'
);

generate({
  jsonDir: './cucumber-json',
  reportPath: './cucumber-html-report',
  reportName: 'Playwright + Cucumber Test Report',
  pageTitle: 'Automation Test Results',
  displayDuration: true,
  metadata: {
    browser: {
      name: 'chromium',
      version: 'latest',
    },
    platform: {
      name: process.platform,
      version: process.version,
    },
  },
});