import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import {SnackbarProvider} from 'notistack';
import DefaultLayout from '../component/Layout';
import app, {cookieStorage} from '../Endpoints';
import UserStore from '../store/UserStore';
import Loader from '../component/Loader';

const Noop = ({ children }) => children;

export default function MyApp(props) {

    const { Component, pageProps } = props;

    let Layout = DefaultLayout;

    if (typeof Component.Layout !== 'undefined') {
        Layout = Component.Layout ? Component.Layout : Noop;
    }

    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
    // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }

        const token = cookieStorage.getItem('feathers-jwt');
        // console.log(token);
        if (token) {
            app
                .authenticate({
                    strategy: 'jwt',
                    accessToken: token
                })
                .then(response => {
                    const {accessToken, customer} = response;
                    UserStore.set(() => ({token: accessToken, user: customer}), 'check-login');
                    setLoading(false);
                })
                .catch(() => {
                    app.logout();
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }

    }, []);


    return (
        <React.Fragment>
            <Head>
                <title>Project</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>
            <ThemeProvider theme={theme}>
                <SnackbarProvider>
                    <CssBaseline />
                    {
                        loading ?
                            <Loader/> :
                            <Layout title={Component.title ? Component.title : ''}>
                                <Component {...pageProps} />
                            </Layout>
                    }
                </SnackbarProvider>
            </ThemeProvider>
        </React.Fragment>
    );
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
};
