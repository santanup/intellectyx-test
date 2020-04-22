const app = require('../../src/app');

describe('\'customer\' service', () => {
  it('registered the service', () => {
    const service = app.service('customer');
    expect(service).toBeTruthy();
  });
});
