import app from './index';

export const customerService = app.service('api/v1/customer');

export const createClient = (name, email, password) => customerService.create({name, email, password});
