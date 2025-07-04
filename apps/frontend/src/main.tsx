import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.tsx';
import './styles/styles.css';


// Entry point where root component is rendered into the DOM


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Auth0Provider
        useRefreshTokens={true}
        cacheLocation="localstorage"
        domain="dev-b5d68fi8od5s513y.us.auth0.com"
        clientId="jepCXrJUcBq34pKdSGGzd2sidUxVpnsL"
        authorizationParams={{
            redirect_uri: window.location.origin + '/directory',
            audience: '/api',
            scope: 'openid profile email offline_access',
        }}
    >
        <App />
    </Auth0Provider>
);