// Initializes the `customer` service on path `/customer`
import { Customer } from './customer.class';

import createModel from '../../models/customer.model';
import hooks from './customer.hooks';

export default function (app) {
    const options = {
        Model: createModel(app),
        paginate: app.get('paginate')
    };

    // Initialize our service with any options it requires
    app.use('/api/v1/customer', new Customer(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('api/v1/customer');

    service.hooks(hooks);
}
