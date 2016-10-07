import {FIREBASE_REF} from 'MyFirebase';

export default function(store) {

    function receiveUserSettings(snap) {
        if (!snap.val()) {
            return;
        }

        store.userSettings.set(snap.val());
    }

    function onUid(uid, uidLast) {
        if (uidLast) {
            FIREBASE_REF.child('users').child(uid).off('value', receiveUserSettings);
        }
        if (uid) {
            FIREBASE_REF.child('users').child(uid).on('value', receiveUserSettings);
        }
    }

    store.addListener(onUid, 'currentUserId');

}
