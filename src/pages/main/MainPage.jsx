import React from 'react';
import LogoutBar from './logout-bar/LogoutBar';

import Button from 'components/button/Button';

import './MainPage.scss';

class MainPage extends React.Component {

    render() {
        return (
            <div className="page-main">
                <LogoutBar />
            </div>
        );
    }
}

export default MainPage;
