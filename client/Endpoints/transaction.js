import app from './index';

export const transactionService = app.service('api/v1/customer-transaction');

export const createTransaction = (product, createdBy, amount) => transactionService.create({product, createdBy, amount});

export const getTransactionById = (_id) => transactionService.get(_id, {query: {$populate: ['product', 'createdBy']}});

export const getTransactionList = ($skip) => transactionService.find(
    {
        query: {
            $skip,
            $populate: ['product', 'createdBy']
        }
    }
);
