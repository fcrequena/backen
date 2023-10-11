const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
//import j from 'jsonwebtoken';

import { MESSAGE_INVALID_CREDENTIALS } from "../helpers/messages";

export const createHashPassword = async (password) => {
    const hashedPassword =await bcrypt.hash(password, 10);
    return hashedPassword;
}

export const validarHashPassword = async (username, password, user_password, codigo) => {

    const jwtSecret = '4pp_Y4d1r4_'

    const isPasswordValid = await bcrypt.compare(password, user_password);
    if(!isPasswordValid){
        return {
            response: false,
            message: MESSAGE_INVALID_CREDENTIALS
        }
    }

    const token = jwt.sign({userId: username, codigo:codigo}, 
                            jwtSecret, 
                            {expiresIn: '1h'});

    return  {
        response: true,
        message: token
    };
}
