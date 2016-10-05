import React, { Component } from 'react';
import store from 'store/Store';

import Button from 'components/button/Button';
import TextInput from 'components/text-input/TextInput';

import { FIREBASE_APP } from 'MyFirebase';

import './LoginPage.scss';

class AuthInput extends Component {
    componentWillMount() {
        store.auth.listenWhileMounted(this, this.props.field);
    }
    onChange = (event) => {
        store.auth.set({
            [this.props.field]: event.target.value
        });
    }

    render() {
        const {field, label, ...otherProps} = this.props;
        const value = this.state[field];

        return (
            <div className="auth-input">
                <label>{label}</label><br />
                <TextInput value={value} onChange={this.onChange} {...otherProps} />
            </div>
        );
    }
}

class CreateUserForm extends Component {

    state = {
        errorMessage: ''
    }

    componentWillMount() {
        store.auth.listenWhileMounted(this, ['email', 'password', 'passwordRepeat']);
    }

    onCreateUser = () => {
        const {email, password, passwordRepeat} = this.state;

        if (password !== passwordRepeat) {
            this.setState({
                errorMessage: "The passwords don't match"
            });
            return;
        }

        this.setState({
            errorMessage: "Please wait..."
        });

        FIREBASE_APP.auth().createUserWithEmailAndPassword(email, password).catch(error => {
            // Failed to create user
            this.setState({ errorMessage: error.message });
        });
    }

    render() {
        return (
            <form className="form-create-user">
                <h1>Create user</h1>
                <AuthInput field="email" label="E-mail" type="text" />
                <AuthInput field="password" label="Password" type="password" />
                <AuthInput field="passwordRepeat" label="Repeat password" type="password" />
                <Button onClick={this.onCreateUser}>Create user</Button>

                <div className="error-message">{this.state.errorMessage}</div>
            </form>
        );
    }
}

class LogInForm extends Component {

    state = {
        errorMessage: ''
    }

    componentWillMount() {
        store.auth.listenWhileMounted(this, ['email', 'password']);
    }

    onLogin = () => {
        const {email, password} = this.state;

        this.setState({
            errorMessage: "Please wait..."
        });

        FIREBASE_APP.auth().signInWithEmailAndPassword(email, password).catch(error => {
            // Not logged in
            this.setState({
                errorMessage: error.message
            });
        });
    }

    render() {
        return (
            <form className="form-log-in">
                <h1>Log in</h1>
                <AuthInput field="email" label="E-mail" type="text" />
                <AuthInput field="password" label="Password" type="password" />
                <Button onClick={this.onLogin}>Log in</Button>

                <div className="error-message">{this.state.errorMessage}</div>
            </form>
        );
    }
}

FIREBASE_APP.auth().onAuthStateChanged((user) => {
    if (!user) {
        // Not logged in
        store.set({
            currentUserId: ''
        });
    }

    // Logged in
    const { uid } = user;

    // Update currentUserId
    store.set({
        currentUserId: uid
    });
});

export default class LoginPage extends Component {

    state = {
        showLoginForm: true
    }

    onClick = () => {
        const {showLoginForm} = this.state;

        this.setState({
            showLoginForm: !showLoginForm
        });
    }

    render() {
        const {showLoginForm} = this.state;

        return (
            <div className={'page-login ' + (showLoginForm ? 'log-in' : 'create-user')}>
                { showLoginForm ? <LogInForm /> : <CreateUserForm /> }

                <Button onClick={this.onClick}>
                    {showLoginForm ? 'Create user' : 'Log in'} instead
                </Button>
            </div>
        );
    }
}
