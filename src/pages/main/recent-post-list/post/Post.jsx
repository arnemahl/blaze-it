import moment from 'moment';
import markdown from './my-markdown';
import fixPostOrComment from 'util/fixPostOrComment';

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
        const {item, onDelete} = this.props;
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
                <span className="date" title={moment(item.timestamp).format('LLL')}>
                    {moment(item.timestamp).fromNow()}
                </span>
                <span className="likes" onClick={this.addLike} title={peopleWhoLiked}>
                    <span>{this.state.likes.length} &#10084;</span>
                </span>
            </div>
        );
    }
}


class NewCommentForm extends React.Component {

    state = {
        content: '',
        submitting: false
    }

    onCommentChange = (event) => {
        this.setState({
            content: fixPostOrComment(event.target.value)
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
            content: this.state.content,
            author: store.currentUser.id
        };

        const {post} = this.props;

        FIREBASE_REF.child('comments-to').child(post.id).push(comment, this.onSubmitCommentSuccess);
    }

    onSubmitCommentSuccess = () => {
        this.setState({
            submitting: false,
            content: ''
        });
    }

    render() {
        return (
            <form className="comment-form">
                <textarea
                    value={this.state.content}
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
        );
    }
}

class Post extends React.Component {

    state = {
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

    deleteOwnComment = (comment) => {
        const {post} = this.props;

        FIREBASE_REF.child('comments-to').child(post.id).child(comment.id).remove();
    }

    deleteOwnPost = (post) => {
        FIREBASE_REF.child('posts').child(post.id).remove();
    }

    render() {
        const {post} = this.props;
        const {comments} = this.state;
        const commentsAsArray = Object.keys(comments).map(id => {
            return { id, ...comments[id] };
        });

        return(
            <div className="post">
                <AuthorAndLikes item={post} onDelete={post.author === store.currentUser.id && this.deleteOwnPost} />
                <div className="markdown content" dangerouslySetInnerHTML={{ __html: markdown.render(post.content)}} />

                <div className="comment-list">
                    {commentsAsArray.map(comment =>
                        <div className="comment" key={comment.id}>
                            <AuthorAndLikes item={comment} onDelete={comment.author === store.currentUser.id && this.deleteOwnComment} />
                            <div className="markdown content" dangerouslySetInnerHTML={{ __html: markdown.render(comment.content)}} />
                        </div>
                    )}
                </div>

                <NewCommentForm post={post} />
            </div>
        );
    }
}

export default Post;
