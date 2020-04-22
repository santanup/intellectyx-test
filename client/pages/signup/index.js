import React from 'react';
import {Container} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import {createClient} from '../../Endpoints/customer';
import {useRouter} from 'next/router';
import {useSnackbar} from 'notistack';
import Box from '@material-ui/core/Box';
import Link from '../../src/Link';

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '180px',
    },
}));

const SignUp = () => {

    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');

    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const Router = useRouter();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleRegister = () => {
        setLoading(true);
        createClient(name, email, password)
            .then(() => {
                enqueueSnackbar('Registration successfully', {variant: 'success'});
                Router.push('/login');
            })
            .catch(error => {
                enqueueSnackbar(error.message ? error.message : 'Something went wrong!', {variant: 'error'});
                setLoading(false);
            });
    };

    const handleEnter = (event) => {
        if (event.keyCode === 13) {
            handleRegister();
        }
    };

    return(
        <Container maxWidth="xs" className={classes.paper}>
            <Typography component="h1" variant="h5" align="center">
                {'Sign Up'}
            </Typography>
            <TextField
                autoFocus
                fullWidth
                label="Name"
                margin="normal"
                onChange={event => setName(event.target.value)}
                required
                // type={text}
                variant="outlined"
                value={name}
                onKeyDown={handleEnter}
            />
            <TextField
                fullWidth
                label="Email"
                margin="normal"
                onChange={event => setEmail(event.target.value)}
                required
                // type={email}
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
                onClick={handleRegister}
                variant="contained"
                type="submit"
                fullWidth
            >
                {loading ? <CircularProgress
                    size={24}
                /> : 'Register'}
            </Button>
            <Box width="100%" display="flex" mt={1}>
                <span className={classes.root}/>
                <Link href="/login" variant="body2">
                    Already have an account? Sign in
                </Link>
            </Box>
        </Container>
    );
};

SignUp.Layout = null;

export default SignUp;
