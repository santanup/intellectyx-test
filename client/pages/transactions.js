import React, {useEffect, useState} from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ContentLayout from '../component/ContentLayout';
import TextField from '@material-ui/core/TextField';
import {createTransaction, getTransactionById, getTransactionList} from '../Endpoints/transaction';
import InfiniteScroll from '../component/InfiniteScroll';
import Loader from '../component/Loader';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import {useSnackbar} from 'notistack';
import {useStore} from 'laco-react';
import UserStore from '../store/UserStore';
import ProductStore from '../store/ProductStore';
import {getProducts} from '../Endpoints/product';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';

function Transactions() {

    const [transaction, setTransaction] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const [product, setProduct] = useState(0);
    const [amount, setAmount] = useState(1);
    const [loading, setLoading] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    const {user} = useStore(UserStore);

    const {data: products} = useStore(ProductStore);

    const handleCreateTransaction = () => {
        if (product === 0) return enqueueSnackbar('Please select a product', {variant: 'error'});
        if (amount < 1) return enqueueSnackbar('Please a valid amount', {variant: 'error'});
        setLoading(true);
        createTransaction(product, user._id, amount)
            .then(response => {
                getTransactionById(response._id)
                    .then(response => {
                        setTransaction([...transaction, response]);
                        setLoading(false);
                        setProduct(0);
                        setAmount(1);
                        enqueueSnackbar('Transaction successful', {variant: 'success'});
                    });
            })
            .catch(error => {
                enqueueSnackbar(error.message ? error.message : 'Something went wrong!', {variant: 'error'});
                setLoading(false);
            });
    };

    const handleEnter = (event) => {
        if (event.keyCode === 13) {
            handleCreateTransaction();
        }
    };

    const LoadTransactions = () => {
        getTransactionList(0)
            .then(response => {
                const {data, total} = response;
                const result = [...transaction, ...data];
                setHasMore(result.length < total);
                setTransaction(result);
            });
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
        <ContentLayout>
            <Grid container spacing={2}>
                <Grid item md={8} sm={6}>
                    <InfiniteScroll
                        hasMore={hasMore}
                        loader={<Loader/>}
                        loadMore={LoadTransactions}
                        pageStart={0}
                    >
                        {
                            transaction.length ?
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Created By</TableCell>
                                            <TableCell align="right">Price</TableCell>
                                            <TableCell align="right">Name</TableCell>
                                            <TableCell align="right">Amount</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            transaction.map((each, index) =>
                                                <TableRow key={index}>
                                                    <TableCell component="th" scope="row">
                                                        {each.createdBy.name}
                                                    </TableCell>
                                                    <TableCell align="right">{each.product.price}</TableCell>
                                                    <TableCell align="right">{each.product.name}</TableCell>
                                                    <TableCell align="right">{each.amount}</TableCell>
                                                </TableRow>
                                            )
                                        }
                                    </TableBody>
                                </Table> :
                                <Typography variant="body2" align="center">
                                    {'Transaction not created'}
                                </Typography>
                        }
                    </InfiniteScroll>
                </Grid>
                <Grid item md={4} sm={6}>
                    <TextField
                        autoFocus
                        fullWidth
                        id="outlined-select-currency-native"
                        select
                        label="Product"
                        value={product}
                        onChange={event => setProduct(event.target.value)}
                        SelectProps={{
                            native: true,
                        }}
                        // helperText="Please select a product"
                        variant="outlined"
                    >
                        <option value={0}>
                            {'-- Select a product --'}
                        </option>
                        {products.map((option) => (
                            <option key={option._id} value={option._id}>
                                {option.name}
                            </option>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        label="Amount"
                        margin="normal"
                        onChange={event => setAmount(event.target.value)}
                        required
                        type="number"
                        variant="outlined"
                        value={amount}
                        onKeyDown={handleEnter}
                    />
                    <Button
                        color="primary"
                        disabled={loading}
                        onClick={handleCreateTransaction}
                        variant="contained"
                        type="submit"
                        fullWidth
                    >
                        {loading ? <CircularProgress
                            size={24}
                        /> : 'Create'}
                    </Button>
                </Grid>
            </Grid>
        </ContentLayout>
    );
}

Transactions.title = 'Transactions';

export default Transactions;
