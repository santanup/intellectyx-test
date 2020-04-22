import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import React, {useState} from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import {useSnackbar} from 'notistack';
import {useStore} from 'laco-react';
import ProductStore from '../store/ProductStore';
import {deleteProduct, updateProduct} from '../Endpoints/product';
import Confirm from '../src/Confirm';
import PropTypes from 'prop-types';

const ProductItem = ({product, index}) => {

    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState(product.name);
    const [price, setPrice] = React.useState(product.price);

    const [loading, setLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const {data: products} = useStore(ProductStore);

    const handleUpdate = () => {
        setLoading(true);
        updateProduct(product._id, name, price)
            .then(response => {
                handleClose();
                setLoading(false);
                products[index] = response;
                ProductStore.set(() => ({data: products}), 'update-product');
                enqueueSnackbar('Update successfully', {variant: 'success'});
            })
            .catch(error => {
                enqueueSnackbar(error.message ? error.message : 'Something went wrong!', {variant: 'error'});
                setLoading(false);
            });
    };

    const handleEnter = (event) => {
        if (event.keyCode === 13) {
            handleUpdate();
        }
    };

    const handleDelete = () => {
        Confirm('Are you sure?', '', 'Yes')
            .then(() => {
                setLoadingDelete(true);
                deleteProduct(product._id)
                    .then(() => {
                        products.splice(index, 1);
                        ProductStore.set((result) => ({data: products, total: result.total - 1}), 'delete-product');
                        enqueueSnackbar('Deleted successfully', {variant: 'success'});
                        setLoadingDelete(false);
                    })
                    .catch(error => {
                        enqueueSnackbar(error.message ? error.message : 'Something went wrong!', {variant: 'error'});
                        setLoadingDelete(false);
                    });
            });
    };

    return (
        <React.Fragment>
            <TableRow>
                <TableCell component="th" scope="row">
                    {product.name}
                </TableCell>
                <TableCell align="right">{product.price}</TableCell>
                <TableCell align="right">
                    <Button onClick={handleClickOpen} style={{marginRight: 8}} variant="outlined" size="small">{'Edit'}</Button>
                    <Button disabled={loadingDelete} variant="outlined" size="small" onClick={handleDelete}>
                        {loadingDelete ? <CircularProgress
                            size={24}
                        /> : 'Delete'}
                    </Button>
                </TableCell>
            </TableRow>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Update Product</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        autoFocus
                        label="Name"
                        margin="normal"
                        onChange={event => setName(event.target.value)}
                        required
                        type="text"
                        variant="outlined"
                        value={name}
                        onKeyDown={handleEnter}
                    />
                    <TextField
                        fullWidth
                        label="Price"
                        margin="normal"
                        onChange={event => setPrice(event.target.value)}
                        required
                        type="number"
                        variant="outlined"
                        value={price}
                        onKeyDown={handleEnter}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} color="primary" disabled={loading}>
                        {loading ? <CircularProgress
                            size={24}
                        /> : 'Update'}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

ProductItem.propTypes = {
    product: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
};

export default ProductItem;
