import customer from './customer/customer.service.js';
import product from './product/product.service.js';
import transaction from './customer-transaction/customer-transaction.service';

// eslint-disable-next-line no-unused-vars
export default function (app) {
    app.configure(customer);
    app.configure(product);
    app.configure(transaction);
}
