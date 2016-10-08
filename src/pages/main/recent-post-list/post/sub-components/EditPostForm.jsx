import React from 'react';
import Button from 'components/button/Button';

import store from 'store/Store';

import fixPostOrComment from 'util/fixPostOrComment';
import {FIREBASE_REF, TIMESTAMP} from 'MyFirebase';

export default class EditPostForm extends React.Component {

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
