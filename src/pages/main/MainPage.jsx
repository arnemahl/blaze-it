import React from 'react';
import LogoutBar from './logout-bar/LogoutBar';
import NewPostForm from './new-post-form/NewPostForm';

import Button from 'components/button/Button';

import './MainPage.scss';

class MainPage extends React.Component {

    render() {
        return (
            <div className="page-main">
                <LogoutBar />
                <NewPostForm />
            </div>
        );
    }
}

export default MainPage;
