import React from 'react';
import Button from 'components/button/Button';
import { FIREBASE_APP } from 'MyFirebase';

import './LogoutBar.scss';

export default class LogoutBar extends React.Component {

    state = {
        logoutErrorMessage: ''
    }

    onLogOut = () => {
        const logoutSuccess = () => {};
        const logoutError = (error) => {
            this.setState({ logoutErrorMessage: error.message });
        };

        FIREBASE_APP.auth().signOut().then(logoutSuccess, logoutError);
    }

    render() {
        return (
            <div className="logout-bar">
                <Button className="button-log-out" onClick={this.onLogOut}>
                    Log out
                </Button>

                <div className="error-message">{this.state.logoutErrorMessage}</div>
            </div>
        );
    }
}
