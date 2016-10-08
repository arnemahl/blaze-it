import store from 'store/Store';

const markdown = require('markdown-it')({
    highlight: (str/*, lang*/) => {
        return `<span class="code-block">${str}</span>`;
    },
    linkify: true
});

const uidRegExp = new RegExp(
    '^([a-zA-Z0-9_]){1,30}(?!_)'
);

markdown.linkify.add('@', {
    validate: (text, pos/*, self*/) => {
        const tail = text.slice(pos);

        if (!uidRegExp.test(tail)) {
            return 0;
        }

        const uid = tail.match(uidRegExp)[0];

        if (store.users[uid]) {
            return uid.length;
        } else {
            return 0;
        }
    },
    normalize: (match) => {
        const uid = match.text.replace(match.schema, ''); // match.schema = '@' for user mentions
        const user = store.users[uid];

        match.text = `${match.schema}${user.userName}`;
        match.url = `#/user/${user.id}`;
    }
});

export default markdown;
