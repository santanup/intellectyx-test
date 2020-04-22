import React, {useEffect, useState} from 'react';
import ContentLayout from '../component/ContentLayout';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {useSnackbar} from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress';
import {createProduct, getProducts} from '../Endpoints/product';
import ProductStore from '../store/ProductStore';
import {useStore} from 'laco-react';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ProductItem from '../component/ProductItem';

function Index() {

    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('');
    const [price, setPrice] = React.useState(0);

    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const {data: products} = useStore(ProductStore);

    const handleCreate = () => {
        setLoading(true);
        createProduct(name, price)
            .then(response => {
                handleClose();
                setLoading(false);
                setName('');
                setPrice(0);
                ProductStore.set(result => ({total: result.total + 1, data: [...result.data, response]}), 'create-product');
                enqueueSnackbar('Create successfully', {variant: 'success'});
            })
            .catch(error => {
                enqueueSnackbar(error.message ? error.message : 'Something went wrong!', {variant: 'error'});
                setLoading(false);
            });
    };

    const handleEnter = (event) => {
        if (event.keyCode === 13) {
            handleCreate();
        }
    };

    useEffect(() => {
        if (!products.length) {
            getProducts(0)
                .then(response => {
                    const {total, data} = response;
                    ProductStore.set(() => ({total, data}), 'get-all');
                });
        }
    }, []);

    return (
        <ContentLayout
            action={
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    {'Add Product'}
                </Button>
            }
        >

            {
                products.length ?
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right"/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product, index) => <ProductItem product={product} index={index} key={index}/>)}
                        </TableBody>
                    </Table> :
                    <Typography variant="body2" align="center">
                        {'You have no Products'}
                    </Typography>
            }
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create Product</DialogTitle>
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
                    <Button onClick={handleCreate} color="primary" disabled={loading}>
                        {loading ? <CircularProgress
                            size={24}
                        /> : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </ContentLayout>
    );
}

Index.title = 'Products';

export default Index;
