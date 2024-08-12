module.exports = {
    default: {
      parallel: 2,
      format: ['html:cucumber-report.html'],
      formatOptions: {
        snippetInterface: 'async-await',
      },
      requireModule: ['ts-node/register'],
      require: ['features/steps/*.steps.ts'],
      paths: ['../features/*.feature']
    }
  }