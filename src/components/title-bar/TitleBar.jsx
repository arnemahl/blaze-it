import React from 'react';
import Button from 'components/button/Button';
import IconWooperate from 'components/icon-wooperate/IconWooperate';

import { FIREBASE_APP } from 'MyFirebase';

import './TitleBar.scss';

export default class TitleBar extends React.Component {

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
        const {logoutErrorMessage} = this.state;

        return (
            <div className="title-bar">
                <a href="#"><IconWooperate /></a>

                <div className="error-message">{logoutErrorMessage}</div>

                <Button className="button-log-out" onClick={this.onLogOut}>
                    Log out
                </Button>
            </div>
        );
    }
}
