import React, {useEffect, useState} from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import {useSnackbar} from 'notistack';
import {authenticate} from '../../Endpoints/authentication';
import {useRouter} from 'next/router';
import {Box} from '@material-ui/core';
import Link from '../../src/Link';
import {useStore} from 'laco-react';
import UserStore from '../../store/UserStore';
import Loader from '../../component/Loader';

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '200px',
    },
}));

const Login = () => {

    const classes = useStyles();

    const Router = useRouter();

    const [email, setEmail] = React.useState('');

    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);

    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();


    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const {user} = useStore(UserStore);

    useEffect(() => {
        if (user) {
            Router.push('/');
        }
    }, []);

    if (user) return <Loader/>;

    const handleLogin = () => {
        setLoading(true);
        authenticate(email, password)
            .then((response) => {
                const {accessToken, customer} = response;
                enqueueSnackbar('Login successfully', {variant: 'success'});
                UserStore.set(() => ({token: accessToken, user: customer}), 'login');
                Router.push('/');
            })
            .catch(error => {
                enqueueSnackbar(error.message ? error.message : 'Something went wrong!', {variant: 'error'});
                setLoading(false);
            });
    };

    const handleEnter = (event) => {
        if (event.keyCode === 13) {
            handleLogin();
        }
    };

    return(
        <Container maxWidth="xs" className={classes.paper}>
            <Typography component="h1" variant="h5" align="center">
                {'Welcome'}
            </Typography>
            <TextField
                autoFocus
                fullWidth
                label="Email"
                margin="normal"
                onChange={event => setEmail(event.target.value)}
                required
                type={'email'}
                variant="outlined"
                value={email}
                onKeyDown={handleEnter}
            />
            <TextField
                fullWidth
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={handleClickShowPassword}
                            >
                                {showPassword ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                label="Password"
                margin="normal"
                name="password"
                onChange={event => setPassword(event.target.value)}
                required
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onKeyDown={handleEnter}
            />
            <Button
                className={classes.button}
                color="primary"
                disabled={loading}
                onClick={handleLogin}
                variant="contained"
                type="submit"
                fullWidth
            >
                {loading ? <CircularProgress
                    size={24}
                /> : 'Login'}
            </Button>
            <Box width="100%" display="flex" mt={1}>
                <span className={classes.root}/>
                <Link href="/signup" variant="body2">
                    {'Don\'t have an account? Sign Up'}
                </Link>
            </Box>
        </Container>
    );
};

Login.Layout = null;

export default Login;
