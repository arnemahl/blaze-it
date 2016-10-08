import React from 'react';
import moment from 'moment';

import store from 'store/Store';
import syncUser from 'store/actions/syncUser';

import {FIREBASE_REF, TIMESTAMP} from 'MyFirebase';

export default class AuthorAndLikes extends React.Component {

    state = {
        likes: []
    }

    componentWillMount() {
        const {item} = this.props;

        FIREBASE_REF.child('likes-to').child(item.id).on('child_added', this.receiveLike);

        if (!store.users[item.author]) {
            syncUser(item.author);
        }

        store.users.listenWhileMounted(this);
    }

    receiveLike = (snap) => {
        const like = snap.val();

        // Sync like.author
        syncUser(like.author);

        // Add like to state
        const {likes} = this.state;

        likes.push(like);

        this.setState({ likes });
    }

    addLike = () => {
        if (!store.currentUser.id) {
            return;
        }

        const {item} = this.props;

        FIREBASE_REF.child('likes-to').child(item.id).push({
            author: store.currentUser.id,
            timestamp: TIMESTAMP
        });
    }

    render() {
        const {item, onEdit, onDelete} = this.props;
        const authorName = this.state[item.author].userName;

        const peopleWhoLiked = this.state.likes
            .map(like => this.state[like.author])
            .map(likeAuthor => likeAuthor.userName)
            .join('\n');

        return (
            <div className="author-and-likes">
                <span className="author">
                    @{authorName}&ensp;{onDelete &&
                        <span className="icon-delete" onClick={() => onDelete(item)} />
                    }
                </span>
                <span className="date">
                    <span
                        onClick={() => onEdit && onEdit(item)}
                        className={"date-created " + (onEdit ? 'edit-on-click' : '')}
                        title={moment(item.timestamp).format('LLL')}
                        >
                        {moment(item.timestamp).fromNow()}
                    </span>
                    { item.edited &&
                        <span
                            className="date-edited"
                            title={moment(item.edited).format('LLL')}
                            >
                            (Edited: {moment(item.edited).fromNow()})
                        </span>
                    }
                </span>
                <span className="likes" onClick={this.addLike} title={peopleWhoLiked}>
                    <span>{this.state.likes.length} &#10084;</span>
                </span>
            </div>
        );
    }
}
