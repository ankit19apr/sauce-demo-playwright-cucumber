/* global module */
module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['features/support/**/*.ts', 'features/step-definitions/**/*.ts'],
    paths: ['features/**/*.feature'],
    format: ['progress', 'json:cucumber-report.json'],
    publishQuiet: true,
    parallel: 1,
  },
};
