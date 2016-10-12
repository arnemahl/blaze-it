import store from 'store/Store';
import {FIREBASE_REF} from 'MyFirebase';

const syncedUsers = [];

export default function syncUser(uid) {
    if (!uid) {
        throw Error(`syncUser was called with invalid argument: ${typeof uid} ${uid}`);
    } else if (syncedUsers.indexOf(uid) > -1) {
        return;
    } else {
        syncedUsers.push(uid);
    }

    if (!store.users[uid]) {
        const tmpUser = {
            id: uid,
            userName: uid.slice(0, 7) // Use uid as userName while fetching
        };

        store.users.set({ [uid]: tmpUser });
    }

    FIREBASE_REF.child('users').child(uid).on('value', (snap) => {
        const user = snap.val();

        if (user) {
            store.users.set({
                [uid]: {id: uid, ...user}
            });
        }
    });
}
