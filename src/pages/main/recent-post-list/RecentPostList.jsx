import React from 'react';
import Post from './post/Post';

import './RecentPostList.scss';

export default class RecentPostList extends React.Component {

    state = {
        recentPosts: [
            {
                id: 'w54gh',
                timestamp: Date.now(),
                content: 'Dummy-post',
                author: 'dummy-user',
                likes: 1
            },
            {
                id: 'b6was',
                timestamp: Date.now(),
                content: 'Dummy-post',
                author: 'dummy-user',
                likes: 5
            }
        ]
    }

    render() {
        return (
            <div className="recent-post-list">
                {this.state.recentPosts.map(post =>
                    <Post key={post.id} post={post} />
                )}
            </div>
        );
    }
}
