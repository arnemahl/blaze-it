import React from 'react';
import LogoutBar from './logout-bar/LogoutBar';
import NewPostForm from './new-post-form/NewPostForm';
import RecentPostList from './recent-post-list/RecentPostList';

import './MainPage.scss';

class MainPage extends React.Component {

    render() {
        return (
            <div className="page-main">
                <LogoutBar />
                <NewPostForm />
                <RecentPostList />
            </div>
        );
    }
}

export default MainPage;
