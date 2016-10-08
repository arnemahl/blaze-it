import React from 'react';
import LinkyButton from 'components/button/LinkyButton';

import store from 'store/Store';
import syncUser from 'store/actions/syncUser';

import './UserPresentationPage.scss';

class UserSettingView extends React.Component {

    render() {
        const {label, value} = this.props;

        return (
            <div className="user-setting">
                <label className="fus-label">{label}</label>
                <div className="fus-value">{value}</div>
            </div>
        );
    }
}

export default class UserPresentationPage extends React.Component {

    componentWillMount() {
        const {uid} = this.props.params;

        if (!store.users[uid]) {
            syncUser(uid);
        }

        store.users.listenWhileMounted(this, uid);
    }

    render() {
        const {uid} = this.props.params;
        const {userName, birthday, interests} = this.state[uid];
        const isCurrentUser = uid === store.currentUser.id;

        return (
            <div className="page-user-settings">
                <h1 className="title">
                    Info about {isCurrentUser ? `you (${userName})` : userName}
                </h1>

                <UserSettingView label="Birthday" value={birthday} />
                <UserSettingView label="Interests" value={interests} />

                { isCurrentUser &&
                    <LinkyButton className="link-edit-info" href="#/user-settings">Edit your info</LinkyButton>
                }
            </div>
        );
    }
}
