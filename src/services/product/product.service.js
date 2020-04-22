// Initializes the `product` service on path `/api/v1/product`
import { Product } from './product.class';

import createModel from '../../models/product.model';
import hooks from './product.hooks';

export default function (app) {
    const options = {
        Model: createModel(app),
        paginate: app.get('paginate')
    };

    // Initialize our service with any options it requires
    app.use('/api/v1/product', new Product(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('api/v1/product');

    service.hooks(hooks);
}
