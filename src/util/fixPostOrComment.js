import store from 'store/Store';

const uidRegExp = new RegExp(
    '^([a-zA-Z0-9_]){1,30}(?!_)'
);
const getFunctionToReplaceUserNameWithUserId = (text, pos) => {
    const tail = text.slice(pos);

    if (!uidRegExp.test(tail)) {
        return; // Not a valid userName
    }

    const userName = tail.match(uidRegExp)[0];

    if (store.users[userName]) {
        return; // A userId, our job is already done
    }

    const userId = Object.keys(store.users).find(key => store.users[key] && store.users[key].userName === userName);

    if (!userId) {
        return; // Not a recognized userName
    } else {
        return (text) => text.replace(userName, userId);
    }
};

const replaceAtUserNameWithAtUserId = (text) => {
    const replacers = [];
    let index = text.indexOf('@');

    let i = 0;

    while (index > -1 && i++ < 5) {
        index++; // Move past the '@'

        const replace = getFunctionToReplaceUserNameWithUserId(text, index);

        if (typeof replace === 'function') {
            replacers.push(replace);
        }

        // Reiterate unless end of text
        if (index < text.length) {
            index = text.indexOf('@', index);
        } else {
            break;
        }
    }

    replacers.map(replace => text = replace(text));

    return text;
};

export default replaceAtUserNameWithAtUserId;
