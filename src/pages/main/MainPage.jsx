import React from 'react';
import NewPostForm from './new-post-form/NewPostForm';
import RecentPostList from './recent-post-list/RecentPostList';

import './MainPage.scss';

class MainPage extends React.Component {

    render() {
        return (
            <div className="page-main">
                <NewPostForm />
                <RecentPostList />
            </div>
        );
    }
}

export default MainPage;
