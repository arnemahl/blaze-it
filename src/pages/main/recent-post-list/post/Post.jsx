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

    onSubmitCommentSuccess = () => {
        this.setState({
            submitting: false,
            content: ''
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

class EditCommentForm extends React.Component {

    state = {
        content: '',
        submitting: false
    }

    componentWillMount() {
        this.setState({
            content: this.props.originalComment.content
        });
    }

    onCommentChange = (event) => {
        this.setState({
            content: fixPostOrComment(event.target.value)
        });
    }

    onSubmitCommentSuccess = () => {
        this.props.onEditComplete();
    }

    onSubmitComment = () => {
        if (this.state.submitting) {
            return;
        }
        if (!store.currentUser.id) {
            return;
        }

        this.setState({ submitting: true });

        const {originalComment} = this.props;

        const updatedComment = {
            timestamp: originalComment.timestamp,
            edited: TIMESTAMP,
            content: this.state.content,
            author: store.currentUser.id
        };

        const {post} = this.props;

        FIREBASE_REF.child('comments-to').child(post.id).child(originalComment.id).update(updatedComment, this.onSubmitCommentSuccess);
    }

    render() {
        return (
            <form className="edit-comment-form">
                <textarea
                    value={this.state.content}
                    onChange={this.onCommentChange}
                    placeholder="Write a comment"
                    />
                <Button className="button-submit-changes" onClick={this.onSubmitComment}>
                    Submit changes
                </Button>
                <Button className="button-cancel" onClick={this.props.onEditComplete}>
                    Cancel
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

class EditPostForm extends React.Component {

    state = {
        content: '',
        submitting: false
    }

    componentWillMount() {
        this.setState({
            content: this.props.originalPost.content
        });
    }

    onCommentChange = (event) => {
        this.setState({
            content: fixPostOrComment(event.target.value)
        });
    }

    onSubmitCommentSuccess = () => {
        this.props.onEditComplete();
    }

    onSubmitComment = () => {
        if (this.state.submitting) {
            return;
        }
        if (!store.currentUser.id) {
            return;
        }

        this.setState({ submitting: true });

        const {originalPost} = this.props;

        const updatedPost = {
            timestamp: originalPost.timestamp,
            edited: TIMESTAMP,
            content: this.state.content,
            author: store.currentUser.id
        };

        FIREBASE_REF.child('posts').child(originalPost.id).update(updatedPost, this.onSubmitCommentSuccess);
    }

    render() {
        return (
            <form className="edit-post-form">
                <textarea
                    value={this.state.content}
                    onChange={this.onCommentChange}
                    placeholder="Write a comment"
                    />
                <Button className="button-submit-changes" onClick={this.onSubmitComment}>
                    Submit changes
                </Button>
                <Button className="button-cancel" onClick={this.props.onEditComplete}>
                    Cancel
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
        comments: {},
        isEditingPost: false,
        editCommentId: false
    }

    componentWillMount() {
        store.users.listenWhileMounted(this); // Trigger markdown-reformatting
        this.listenToFirebase('on');
    }
    componentWillUnmount() {
        this.listenToFirebase('off');
    }
    listenToFirebase(on_or_off) {
        const {post} = this.props;

        FIREBASE_REF.child('comments-to').child(post.id)[on_or_off]('child_added', this.receiveComment);
        FIREBASE_REF.child('comments-to').child(post.id)[on_or_off]('child_changed', this.receiveComment);
        FIREBASE_REF.child('comments-to').child(post.id)[on_or_off]('child_removed', this.removeComment);
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

    editOwnComment = (comment) => {
        this.setState({
            editCommentId: comment.id
        });
    }
    finishCommentEdit = () => {
        this.setState({
            editCommentId: false
        });
    }

    editOwnPost = () => {
        this.setState({
            isEditingPost: true
        });
    }
    finishPostEdit = () => {
        this.setState({
            isEditingPost: false
        });
    }

    render() {
        const {post} = this.props;
        const {comments} = this.state;
        const commentsAsArray = Object.keys(comments).map(id => {
            return { id, ...comments[id] };
        });

        return(
            <div className="post">
                {this.state.isEditingPost
                    ? <EditPostForm
                        originalPost={post}
                        onEditComplete={this.finishPostEdit}
                        />
                    : (
                        <div className="actual-post">
                            <AuthorAndLikes
                                item={post}
                                onEdit={post.author === store.currentUser.id && this.editOwnPost}
                                onDelete={post.author === store.currentUser.id && this.deleteOwnPost}
                                />
                            <div className="markdown content" dangerouslySetInnerHTML={{ __html: markdown.render(post.content)}} />
                        </div>
                    )
                }

                <div className="comment-list">
                    {commentsAsArray.map(comment => this.state.editCommentId === comment.id
                        ? <EditCommentForm
                            key={comment.id}
                            post={post}
                            originalComment={comment}
                            onEditComplete={this.finishCommentEdit}
                            />
                        : (
                            <div className="comment" key={comment.id}>
                                <AuthorAndLikes
                                    item={comment}
                                    onEdit={comment.author === store.currentUser.id && this.editOwnComment}
                                    onDelete={comment.author === store.currentUser.id && this.deleteOwnComment}
                                    />
                                <div className="markdown content" dangerouslySetInnerHTML={{ __html: markdown.render(comment.content)}} />
                            </div>
                        )
                    )}
                </div>

                <NewCommentForm post={post} />
            </div>
        );
    }
}

export default Post;
