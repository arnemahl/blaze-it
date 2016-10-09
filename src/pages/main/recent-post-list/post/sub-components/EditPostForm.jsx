import React from 'react';
import Button from 'components/button/Button';
import ButtonUploadImage, {insertImage} from 'components/button/ButtonUploadImage';

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
            lastActivity: TIMESTAMP,
            edited: TIMESTAMP,
            content: this.state.content
        };

        FIREBASE_REF.child('posts').child(originalPost.id).update(updatedPost, this.onSubmitCommentSuccess);
    }

    onImageUploadComplete = (url) => {
        const cursorPos = this.refs.textarea.selectionStart;

        this.setState({
            content: insertImage(this.state.content, url, cursorPos)
        });
    }

    render() {
        return (
            <form className="edit-post-form">
                <textarea
                    ref="textarea"
                    value={this.state.content}
                    onChange={this.onCommentChange}
                    placeholder="Write a comment"
                    />

                <span className="buttons">
                    <ButtonUploadImage className="button-add-image-from-disk" onImageUploadComplete={this.onImageUploadComplete}>
                        Add image from disk
                    </ButtonUploadImage>
                    <Button className="button-submit-changes" onClick={this.onSubmitComment}>
                        Submit changes
                    </Button>
                    <Button className="button-cancel" onClick={this.props.onEditComplete}>
                        Cancel
                    </Button>
                </span>

                {this.state.submitting &&
                    <div className="feedback">
                        Please wait...
                    </div>
                }
            </form>
        );
    }
}
