import markdown from './my-markdown';

import React from 'react';
import AuthorAndLikes from './sub-components/AuthorAndLikes';
import NewCommentForm from './sub-components/NewCommentForm';
import EditCommentForm from './sub-components/EditCommentForm';
import EditPostForm from './sub-components/EditPostForm';

import store from 'store/Store';

import {FIREBASE_REF} from 'MyFirebase';

import './Post.scss';

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
