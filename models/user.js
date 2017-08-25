const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
mongoose.Promise = global.Promise;

//Validate email field
let emailLengthChecker = (email) => {
    if (!email) {
        return false;
    } else {
        if (email.length < 5 || email.length > 30) {
            return false;
        } else {
            return true;
        }
    }
};

let validEmailChecher = (email) => {
    if (!email) {
        return false;
    } else {
        const regExp = 
        new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
    }
};

const emailValidators = [
    {
        validator: emailLengthChecker, 
        message: 'Correo electronico debe tener al menos 5 caracteres pero no mas de 30 caracteres'
    },
    {
        validator: validEmailChecher,
        message: 'Por favor ingresa una direccion de correo electronico valida'
    }
];

//Validate Username field
let usernameLengthChecker = (username) => {
    if (!username) {
        return false;
    } else {
        if (username.length < 3 || username.length > 20) {
            return false;
        } else {
            return true;
        }   

    }
};

let validUsername = (username) => {
    if (!username) {
        return false;
    } else {
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
}

const usernameValidators = [
    {
        validator: usernameLengthChecker,
        message: 'Nombre de Usuario debe tener entre 3 y 20 caracteres'
    },
    {
        validator: validUsername,
        message: 'Debe ingresar un nombre de usuario valido'
    }
];

//Validate Password field
let passwordLengthChecker = (password) => {
    if (!password){
        return false;
    } else {
        if (password.length < 8 || password.length > 35) {
            return false;
        } else {
            return true;
        }
    }
};

let validPassword = (password) => {
    if (!password) {
        return false;
    } else {
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        return regExp.test(password);
    }
};

const passwordValidators = [
    {
        validator: passwordLengthChecker,
        message: 'Clave de acceso debe contener al menos 8 caracteres'
    }, 
    {
        validator: validPassword,
        message: 'Clave de acceso debe contener al menos un caracter MAYUSCULAS, minusculas, especial y numerico'
    }
];


const userSchema = new Schema ({
    email: { type:String, required:true, unique:true, lowercase:true, validate: emailValidators },
    username: { type:String, required:true, unique:true, lowercase:true, validate: usernameValidators },
    password: { type:String, required:true, validate: passwordValidators }
});

//Adding CRYPT to password
userSchema.pre('save', function (next){
    if (!this.isModified('password'))
        return next();

    bcrypt.hash(this.password, null, null, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    });
});

//Comparing Password crypted
userSchema.methods.comparePassword = (password) => {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);