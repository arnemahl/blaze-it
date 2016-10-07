import React from 'react';
import { Router, Route, IndexRoute, Redirect }  from 'react-router';
import { createHashHistory } from 'history/lib';

import store from 'store/Store';

import MainPage from 'pages/main/MainPage.jsx';
import LoginPage from 'pages/login/LoginPage.jsx';
import UserSettingsPage from 'pages/user/UserSettingsPage.jsx';

import 'App.scss';

class App extends React.Component {

    componentWillMount() {
        store.currentUser.listenWhileMounted(this, 'id');
    }

    componentWillUpdate() {
        const currentUserId = store.currentUser.id;

        if (!currentUserId) {
            if (window.location.hash !== '#/login') {
                window.location.hash = '/login';
            }
        } else {
            if (window.location.hash === '#/login') {
                window.location.hash = '/';
            }
        }
    }

    render() {
        return this.props.children;
    }
}

export default (
    <Router history={createHashHistory({ queryKey: false })}>
        <Route path="/" component={App}>
            <IndexRoute component={MainPage} />

            <Route path="user-settings" component={UserSettingsPage} />
            <Redirect from="user" to="user-settings" />

            <Route path="login" component={LoginPage}/>
        </Route>
    </Router>
);
