import Pockito from 'pockito';

const {Listenable} = Pockito.Reactito;
const {string, number, undefOr} = Pockito.Validators;
const shape = (obj) => (value) => value && Object.keys(obj).every(key => obj[key](value[key])); // TODO move to pockito

const post = shape({
    content: string,
    author: string,
    timestamp: number
});

const store = new Listenable({
    currentUser: new Listenable({
        initialState: {
            id: '',
            userName: ''
        },
        validators: {
            id: string,
            userName: string
        }
    }),

    users: new Listenable({
        univalidator: shape({
            id: string,
            userName: undefOr(string)
        })
    }),

    auth: new Listenable({
        initialState: {
            email: '',
            password: '',
            passwordRepeat: ''
        },
        validators: {
            email: string,
            password: string,
            passwordRepeat: string
        }
    }),

    posts: new Listenable({
        univalidator: post
    })
});

require('./syncCurrentUser')(store);

export default store;
