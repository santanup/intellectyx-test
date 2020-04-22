const app = require('../../src/app');

describe('\'product\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/product');
    expect(service).toBeTruthy();
  });
});
