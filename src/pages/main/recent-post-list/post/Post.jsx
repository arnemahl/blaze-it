import React from 'react';
import Button from 'components/button/Button';

import store from 'store/Store';
import syncUser from 'store/actions/syncUser';

import {FIREBASE_REF, TIMESTAMP} from 'MyFirebase';

import './Post.scss';

class AuthorAndLikes extends React.Component {

    state = {
        likes: []
    }

    componentWillMount() {
        const {item} = this.props;

        FIREBASE_REF.child('likes-to').child(item.id).on('child_added', this.receiveLike);

        if (!store.users[item.author]) {
            syncUser(item.author);
        }

        store.users.listenWhileMounted(this, item.author);
    }

    receiveLike = (snap) => {
        const {likes} = this.state;

        likes.push(snap.val());

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
        const {item, onDelete} = this.props;
        const authorName = this.state[item.author].userName;

        return (
            <div className="author-and-likes">
                <span className="author">
                    @{authorName}&ensp;{onDelete &&
                        <span className="icon-delete" onClick={() => onDelete(item)} />
                    }
                </span>
                <span className="date">{new Date(item.timestamp).toISOString()}</span>
                <span className="likes" onClick={this.addLike}><span>{this.state.likes.length || 0} &#10084;</span></span>
            </div>
        );
    }
}

class Post extends React.Component {

    state = {
        commentContent: '',
        submitting: false,
        comments: {}
    }

    componentWillMount() {
        const {post} = this.props;

        FIREBASE_REF.child('comments-to').child(post.id).on('child_added', this.receiveComment);
        FIREBASE_REF.child('comments-to').child(post.id).on('child_changed', this.receiveComment);
        FIREBASE_REF.child('comments-to').child(post.id).on('child_removed', this.removeComment);
    }

    receiveComment = (snap) => {
        const comments = {
            ...this.state.comments,
            [snap.key]: snap.val()
        };

        this.setState({ comments });
    }
    removeComment = (snap) => {
        const {...comments} = this.state.comments;

        delete comments[snap.key];

        this.setState({ comments });
    }

    onCommentChange = (event) => {
        this.setState({
            commentContent: event.target.value
        });
    }

    onSubmitComment = () => {
        if (this.state.submitting) {
            return;
        }
        if (!store.currentUser.id) {
            return;
        }

        this.setState({ submitting: true });

        const comment = {
            timestamp: TIMESTAMP,
            content: this.state.commentContent,
            author: store.currentUser.id
        };

        const {post} = this.props;

        FIREBASE_REF.child('comments-to').child(post.id).push(comment, this.onSubmitCommentSuccess);
    }

    onSubmitCommentSuccess = () => {
        this.setState({
            submitting: false,
            commentContent: ''
        });
    }

    deleteOwnComment = (comment) => {
        const {post} = this.props;

        FIREBASE_REF.child('comments-to').child(post.id).child(comment.id).remove();
    }

    render() {
        const {post} = this.props;
        const {comments} = this.state;
        const commentsAsArray = Object.keys(comments).map(id => {
            return { id, ...comments[id] };
        });

        return(
            <div className="post">
                <AuthorAndLikes item={post} />
                <div className="content">{post.content}</div>

                <div className="comment-list">
                    {commentsAsArray.map(comment =>
                        <div className="comment" key={comment.id}>
                            <AuthorAndLikes item={comment} onDelete={comment.author === store.currentUser.id && this.deleteOwnComment} />
                            <div className="content">{comment.content}</div>
                        </div>
                    )}
                </div>

                <form className="comment-form">
                    <textarea
                        value={this.state.commentContent}
                        onChange={this.onCommentChange}
                        placeholder="Write a comment"
                        />
                    <Button className="button-submit-comment" onClick={this.onSubmitComment}>
                        Submit comment
                    </Button>

                    {this.state.submitting &&
                        <div className="feedback">
                            Please wait...
                        </div>
                    }
                </form>
            </div>
        );
    }
}

export default Post;
