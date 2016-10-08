import React from 'react';
import Button from 'components/button/Button';

import store from 'store/Store';

import fixPostOrComment from 'util/fixPostOrComment';
import {FIREBASE_REF, TIMESTAMP} from 'MyFirebase';

export default class EditCommentForm extends React.Component {

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
