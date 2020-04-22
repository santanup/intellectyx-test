const app = require('../../src/app');

describe('\'customer-transaction\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/customer-transaction');
    expect(service).toBeTruthy();
  });
});
