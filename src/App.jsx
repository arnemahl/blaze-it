import React from 'react';
import { Router, Route, IndexRoute, Redirect }  from 'react-router';
import { createHashHistory } from 'history/lib';

import store from 'store/Store';

import TitleBar from 'components/title-bar/TitleBar';

import MainPage from 'pages/main/MainPage.jsx';
import LoginPage from 'pages/login/LoginPage.jsx';
import UserSettingsPage from 'pages/user/UserSettingsPage.jsx';
import UserPresentationPage from 'pages/user-presentation/UserPresentationPage.jsx';

import 'App.scss';

import { FIREBASE_APP } from 'MyFirebase';

function redirectDependingOnAuth(isLoggedIn) {
    if (!isLoggedIn) {
        if (window.location.hash !== '#/login') {
            window.location.hash = '/login';
        }
    } else {
        if (window.location.hash === '#/login') {
            window.location.hash = '/';
        }
    }
}

FIREBASE_APP.auth().onAuthStateChanged((user) => {
    redirectDependingOnAuth(!!user);

    if (!user) {
        // Not logged in
        store.currentUser.set({ id: '' });
    } else {
        // Logged in
        const { uid } = user;

        // Update currentUser.id
        store.currentUser.set({ id: uid });
    }
});

class App extends React.Component {

    componentWillMount() {
        store.currentUser.listenWhileMountedRemap(this, {id: 'currentUserId'});
    }

    componentWillReceiveProps() {
        redirectDependingOnAuth(!!this.state.currentUserId);
    }

    render() {
        return (
            <div className="out-fancy-app">
                <TitleBar />
                {this.props.children}
            </div>
        );
    }
}

export default (
    <Router history={createHashHistory({ queryKey: false })}>
        <Route path="/" component={App}>
            <IndexRoute component={MainPage} />

            <Route path="user-settings" component={UserSettingsPage} />
            <Redirect from="user" to="user-settings" />

            <Route path="user/:uid" component={UserPresentationPage} />

            <Route path="login" component={LoginPage}/>
        </Route>
    </Router>
);
