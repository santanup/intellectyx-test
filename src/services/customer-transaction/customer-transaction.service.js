// Initializes the `customer-transaction` service on path `/api/v1/customer-transaction`
import { CustomerTransaction } from './customer-transaction.class';

import createModel from '../../models/customer-transaction.model';
import hooks from './customer-transaction.hooks';

export default function (app) {
    const options = {
        Model: createModel(app),
        paginate: app.get('paginate')
    };

    // Initialize our service with any options it requires
    app.use('/api/v1/customer-transaction', new CustomerTransaction(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('api/v1/customer-transaction');

    service.hooks(hooks);
}
