const UserHandler = require('../handlers/user');
const { USER_ROLES } = require('../utils/constants');

const getAll = async (ctx) => {
    const queryPayload = {
        exclude: ctx.query.exclude
    }
    const response = await UserHandler.getAll(queryPayload);
    ctx.body = {
        meta: {
            status: 200
        },
        data: response
    };
}

const getUser = async (ctx) => {
    const userId = ctx.params.userId;
    const response = await UserHandler.getUser(userId);
    ctx.body = {
        meta: {
            status: 200
        },
        data: response
    }
}

const loginUser = async (ctx) => {
    let payload = {
        email: ctx.request.body.email,
        username: ctx.request.body.username,
        password: ctx.request.body.password,
    }
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key])
    if(!payload.email) {
        const { token, currentUser } = await UserHandler.loginUserWithUsername(payload)
        ctx.body = {
            meta: {
                status: 200,
                token: token
            },
            currentUser
        }
    } else {
        const { token, currentUser } = await UserHandler.loginUserWithEmail(payload)
        ctx.body = {
            meta: {
                status: 200,
                token: token
            },
            currentUser
        }
    }
}

const registerUser = async (ctx) => {
    const payload = {
        name: ctx.request.body.name,
        username: ctx.request.body.username,
        password: ctx.request.body.password,
        email: ctx.request.body.email,
        role: ctx.request.body.role? ctx.request.body.role: USER_ROLES.user,
    }
    const response = await UserHandler.createUser(payload);
    ctx.body = {
        meta: {
            status: 200
        },
        data: response
    };
}

const update = async (ctx) => {
    const payload = {
        userId: ctx.params.userId,
        name: ctx.request.body.name,
        password: ctx.request.body.password,
        role: ctx.request.body.role,
        email: ctx.request.body.email,
    }
    const response = await UserHandler.update(payload);
    ctx.body = {
        meta: {
            status: 200
        },
        data: response
    };
}

const addAudioFile = async (ctx) => {
    const payload = {
        userId: ctx.params.userId,
        description: ctx.request.body.description,
        gcs_uri: ctx.request.body.gcs_uri,
        created: ctx.request.body.created
    }
    const response = await UserHandler.addAudioFile(payload);
    ctx.body = {
        meta: {
            status: 200
        },
        data: response
    };
}

const removeAudioFile = async (ctx) => {
    const payload = {
        userId: ctx.params.userId,
        _id: ctx.request.body._id,
        gcs_uri: ctx.request.body.gcs_uri,
    }
    const response = await UserHandler.removeAudioFile(payload);
    ctx.body = {
        meta: {
            status: 200
        },
        data: response
    };
}

const addSummaryFile = async (ctx) => {
    const payload = {
        userId: ctx.params.userId,
        description: ctx.request.body.description,
        gcs_uri: ctx.request.body.gcs_uri,
        created: ctx.request.body.created,
    }
    const response = await UserHandler.addSummaryFile(payload);
    ctx.body = {
        meta: {
            status: 200
        },
        data: response
    };
}

const removeSummaryFile = async (ctx) => {
    const payload = {
        userId: ctx.params.userId,
        _id: ctx.request.body._id,
        gcs_uri: ctx.request.body.gcs_uri,
    }
    const response = await UserHandler.removeSummaryFile(payload);
    ctx.body = {
        meta: {
            status: 200
        },
        data: response
    };
}

const resetPassword = async (ctx) => {
    const payload = {
        email: ctx.request.body.email
    }
    const response = await UserHandler.resetPassword(payload);
    ctx.body = {
        meta: {
            status: 200
        },
        data: response
    };
}

const remove = async (ctx) => {
    const userId = ctx.params.userId;
    const response = await UserHandler.remove(userId);
    ctx.body = {
        meta: {
            status: 200
        },
        data: response
    };
}

const addFeedback = async (ctx) => {
    const payload = {
        userId: ctx.params.userId,
        feedbackType: ctx.request.body.feedbackType,
        q1: ctx.request.body.q1,
        q2: ctx.request.body.q2,
        q3: ctx.request.body.q3,
        comment: ctx.request.body.comment,
    }
    const response = await UserHandler.addFeedback(payload);
    ctx.body = {
        meta: {
            status: 200
        },
        data: response
    };
}

module.exports = { getAll, getUser, loginUser, registerUser, resetPassword, update, addAudioFile, removeAudioFile, addSummaryFile, removeSummaryFile, remove, addFeedback }