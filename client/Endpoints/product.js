import app from './index';

export const productService = app.service('api/v1/product');

export const createProduct = (name, price) => productService.create({name, price});

export const updateProduct = (_id, name, price) => productService.patch(_id, {name, price});

export const deleteProduct = (_id) => productService.remove(_id);

export const getProducts = ($skip = 0) => productService.find({
    query: {
        $skip
    }
});
