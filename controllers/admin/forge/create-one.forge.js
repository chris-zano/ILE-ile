const findUser = (query={}) => {
    return 'find user called { yet to be implemented }';
}

const insertUser = (userObject={})=> {
    return 'insert user called { yet to be implemented }';
}

const createOneUser = (req, res) => {
    if (findUser) {
        insertUser();
    }
    else {
        return 'operation failed';
    }

    return 'operation was successful';
}

module.exports =  createOneUser;