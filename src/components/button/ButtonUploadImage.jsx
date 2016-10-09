import React from 'react';
import Button from 'components/button/Button';
import firebase from 'firebase';
import store from 'store/Store';

import './ButtonUploadImage.scss';

const {STATE_CHANGED} = firebase.storage.TaskEvent;
const {PAUSED, RUNNING} = firebase.storage.TaskState;

export default class ButtonUploadImage extends React.Component {

    static propTypes = {
        onImageUploadComplete: React.PropTypes.func.isRequired
    }

    state = {
        upload: {
            task: null,
            paused: false,
            progress: 0
        },
        feedback: false
    };

    onClick = () => {
        if (this.state.upload.task) {
            // Only allow one upload at a time
            return;
        }

        this.refs.fileInput && this.refs.fileInput.click();
    }

    onFileSelected = (event) => {
        const files = event.target.files;

        if (files.length === 0) {
            return;
        }

        const selectedFile = files[0];

        const uploadTask = firebase.storage().ref().child('images').child(selectedFile.name).put(selectedFile);

        uploadTask.on(STATE_CHANGED, this.onUploaStateChanged, this.onUploadError, this.onUploadSuccess);

        this.setState({
            upload: {
                task: uploadTask,
                paused: false,
                progress: 0
            },
            feedback: {
                short: 'Starting upload'
            }
        });
    }

    onUploaStateChanged = (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        switch (snapshot.state) {
            case PAUSED:
                this.setState({
                    upload: {
                        task: this.state.upload.task,
                        paused: true,
                        progress
                    },
                    feedback: {
                        short: `Upload paused`,
                        details: `Upload paused at ${progress}%`
                    }
                });
                break;
            case RUNNING:
                this.setState({
                    upload: {
                        task: this.state.upload.task,
                        paused: false,
                        progress
                    },
                    feedback: {
                        short: `Uploading: ${progress}%`,
                        details: `Click to pause upload`
                    }
                });
                break;
        }
    }

    onUploadError = (error) => {
        switch (error.code) {
            case 'storage/unauthorized':
                // User doesn't have permission to access the object
                this.setState({
                    upload: {},
                    feedback: {
                        short: 'Upload error',
                        details: 'Upload error: It seems you are trying to overwrite an image. Try changing the file-name.'
                    }
                });
                break;
    
            case 'storage/canceled':
                // User canceled the upload
                this.setState({
                    upload: {},
                    feedback: false
                });
                break;
    
            case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                this.setState({
                    upload: {},
                    feedback: {
                        short: 'Upload error',
                        details: 'Upload error: An unknown error occurred. ¯\_(ツ)_/¯'
                    }
                });
                break;
        }
    }

    onUploadSuccess = () => {
        const downloadURL = this.state.upload.task.snapshot.downloadURL;

        this.setState({
            upload: {},
            feedback: false
        });

        firebase.database().ref().child('files-uploaded-by').child(store.currentUser.id).push(downloadURL);
        this.props.onImageUploadComplete(downloadURL);
    }

    pauseOrResumeUpload = () => {
        const { upload } = this.state;

        if (!upload.task) {
            return;
        }

        upload.paused
            ? upload.task.resume()
            : upload.task.pause();
    }

    cancelUpload = () => {
        const { upload } = this.state;

        if (!upload.task) {
            return;
        }
        if (upload.paused) {
            upload.task.resume(); // Cannot cancel a paused task for some reason
        }
        upload.task.cancel();
    }

    render() {
        const {upload, feedback} = this.state;

        return (
            <span className="our-hacky-file-input">
                { !upload.task
                    ? <Button onClick={this.onClick} {...this.props} />
                    : (
                        <span className="upload-status">
                            <span className="upload-feedback" title={feedback.details} onClick={this.pauseOrResumeUpload}>
                                {feedback.short}
                            </span>
                            { upload.task &&
                                <span className="icon-cancel-upload" onClick={this.cancelUpload} />
                            }
                        </span>
                    )
                }
                <input type="file" ref="fileInput" onChange={this.onFileSelected} />
            </span>
        );
    }
}

export function insertImage(text, imageUrl, cursorPos = 1000, altTag = 'uploaded-image') {
    const textBeforeCursor = text.slice(0, cursorPos);
    const textAfterCursor = text.slice(cursorPos);

    return (
        (textBeforeCursor ? `${textBeforeCursor}\n` : '') +
        `![${altTag}](${imageUrl})` +
        (textAfterCursor ? `\n${textAfterCursor}` : '')
    );
}
