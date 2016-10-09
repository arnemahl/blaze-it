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
        showDialog: false
    };

    onClick = () => {
        this.refs.fileInput && this.refs.fileInput.click();
    }

    onFileSelected = (event) => {
        const files = event.target.files;

        if (files.length === 0) {
            return;
        }

        const selectedFile = files[0];

        const uploadTask = firebase.storage().ref().child('images').child(selectedFile.name).put(selectedFile);

        uploadTask.on(STATE_CHANGED, this.onUploaStateChanged, this.onUploadError, () => this.onUploadSuccess(uploadTask));
    }

    onUploaStateChanged = (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload progress: ${progress}%`);

        switch (snapshot.state) {
            case PAUSED:
                console.log('Upload is paused');
                break;
            case RUNNING:
                console.log('Upload is running');
                break;
        }
    }

    onUploadError = (error) => {
        switch (error.code) {
            case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;
    
            case 'storage/canceled':
                // User canceled the upload
                break;
    
            case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break;
        }
    }

    onUploadSuccess(uploadTask) {
        const downloadURL = uploadTask.snapshot.downloadURL;

        firebase.database().ref().child('files-uploaded-by').child(store.currentUser.id).push(downloadURL);
        this.props.onImageUploadComplete(downloadURL);
    }

    render() {
        return (
            <span className="our-hacky-file-input">
                <Button onClick={this.onClick} {...this.props} />
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
