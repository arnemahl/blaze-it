import React from 'react';
import Button from 'components/button/Button';

import './NewPostForm.scss';

export default class NewPostForm extends React.Component {

    state = {
        content: ''
    }

    onSubmit = () => {
        console.log('TODO: Implement post submit');
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
            </form>
        );
    }
}
