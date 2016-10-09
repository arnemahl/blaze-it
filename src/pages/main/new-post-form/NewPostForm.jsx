import fixPostOrComment from 'util/fixPostOrComment';

import React from 'react';
import Button from 'components/button/Button';
import ButtonUploadImage, {insertImage} from 'components/button/ButtonUploadImage';

import {FIREBASE_REF, TIMESTAMP} from 'MyFirebase';
import store from 'store/Store';

import './NewPostForm.scss';

export default class NewPostForm extends React.Component {

    state = {
        submitting: false,
        content: ''
    }

    onSubmit = () => {
        if (this.state.submitting) {
            return;
        }
        if (!store.currentUser.id) {
            return;
        }
        if (!this.state.content.replace(/\s/g, '').replace(/\n/g, '')) {
            return;
        }

        this.setState({ submitting: true });

        const post = {
            timestamp: TIMESTAMP,
            lastActivity: TIMESTAMP,
            content: this.state.content,
            author: store.currentUser.id
        };

        FIREBASE_REF.child('posts').push(post, this.onSubmitSuccess);
    }

    onSubmitSuccess = () => {
        this.setState({
            submitting: false,
            content: ''
        });
    }

    onContentChange = (event) => {
        this.setState({
            content: fixPostOrComment(event.target.value)
        });
    }

    onImageUploadComplete = (url) => {
        const cursorPos = this.refs.textarea.selectionStart;

        this.setState({
            content: insertImage(this.state.content, url, cursorPos)
        });
    }

    render() {
        return (
            <form className="new-post-form">
                <textarea
                    ref="textarea"
                    value={this.state.content}
                    onChange={this.onContentChange}
                    placeholder="Write a new post for all to see"
                    />

                <span className="buttons">
                    <ButtonUploadImage className="button-add-image-from-disk" onImageUploadComplete={this.onImageUploadComplete}>
                        Add image from disk
                    </ButtonUploadImage>

                    <Button className="button-submit-post" onClick={this.onSubmit}>
                        Submit post
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
