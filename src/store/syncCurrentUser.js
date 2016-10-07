import {FIREBASE_REF} from 'MyFirebase';

export default function(store) {

    function receiveUserData(snap) {
        store.currentUser.set(snap.val());
    }

    function onUid(uid, uidLast) {
        if (uidLast) {
            FIREBASE_REF.child('users').child(uid).off('value', receiveUserData);
        }
        if (uid) {
            FIREBASE_REF.child('users').child(uid).on('value', receiveUserData);
            store.currentUser.set({ userName: uid.slice(0, 7) }); // Use uid as userName while fetching
        } else {
            store.currentUser.reset();
        }
    }

    store.currentUser.addListener(onUid, 'id');

}
