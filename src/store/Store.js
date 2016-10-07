import Pockito from 'pockito';

const {Listenable} = Pockito.Reactito;
const {string, object} = Pockito.Validators;

const post = object; // TODO: Shape

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
        univalidator: post,
        initialState: {}
    })
});

require('./syncCurrentUser')(store);

export default store;
