import React from 'react';
import store from 'store/Store';

import Button from 'components/button/Button';
import TextInput from 'components/text-input/TextInput';

import {FIREBASE_REF} from 'MyFirebase';

import './UserSettingsPage.scss';

class UserSettingForm extends React.Component {

    componentWillMount() {
        store.currentUser.listenWhileMounted(this, this.props.userProperty);
    }

    onChange = (event) => {
        this.setState({
            [this.props.userProperty]: event.target.value
        });
    }

    saveToFirebase = () => {
        const {userProperty} = this.props;
        const value = this.state[userProperty];

        if (!store.currentUser.id || !value) {
            return;
        }

        FIREBASE_REF.child('users').child(store.currentUser.id).child(userProperty).set(value);
    }

    render() {
        const {children, userProperty, ...otherProps} = this.props;
        const value = this.state[userProperty];

        return (
            <form className="form-user-setting">
                <label className="fus-label">{children}</label>
                <TextInput className="fus-input" value={value} onChange={this.onChange} {...otherProps} />
                <Button className="fus-submit" type="submit" onClick={this.saveToFirebase}>&#10003;</Button>
            </form>
        );
    }
}

export default class UserSettingsPage extends React.Component {

    componentWillMount() {
        store.currentUser.listenWhileMounted(this, 'userName');
    }

    render() {
        const {userName} = this.state;

        return (
            <div className="page-user-settings">
                <h1 className="title">
                    Hello {userName}!
                </h1>
                <UserSettingForm userProperty="userName">User name</UserSettingForm>
            </div>
        );
    }
}
