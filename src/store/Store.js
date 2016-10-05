import Pockito from 'pockito';

const {Listenable} = Pockito.Reactito;
const {string, object} = Pockito.Validators;

const post = object; // TODO: Shape

const store = new Listenable({
    initialState: {
        currentUserId: ''
    },
    validators: {
        currentUserId: string
    },

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

export default store;
