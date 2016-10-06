import React from 'react';
import Button from 'components/button/Button';

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

        this.setState({ submitting: true });

        const post = {
            timestamp: TIMESTAMP,
            content: this.state.content,
            author: store.currentUserId
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
            content: event.target.value
        });
    }

    render() {
        return (
            <form className="new-post-form">
                <textarea
                    value={this.state.content}
                    onChange={this.onContentChange}
                    placeholder="Write a new messsage for all to see"
                    />
                <Button className="button-submit-post" onClick={this.onSubmit}>
                    Submit post
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
