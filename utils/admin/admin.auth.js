import { AdminsDB } from '../global/db.utils.js';

const Admins = AdminsDB();

const acceptRequest = () => {
    return {
        status: 'verified-user',
        authToken: 'valid-auth-token',
        data: doc
    }
}

const rejectRequest = () => {
    return {
        error: error,
        status: 'verified-user',
        authToken: 'invalid-auth-token'
    }
}

export default validateRequest = async (requestObject) => {

    try {
        const authKey = requestObject.headers['u-a-k'];
        const documentMatch = await Admins.findOne({ adminId: authKey });

        if (!documentMatch) return rejectRequest();

        return acceptRequest();
    }
    catch(error) {
        console.log(error);
    }
}