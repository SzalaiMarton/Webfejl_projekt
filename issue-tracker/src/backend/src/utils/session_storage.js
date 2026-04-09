import session from "express-session";

class SessionStorage extends session.Store {
    constructor() {
        super();
        this.session = {};
    }

    get(sid, callback) {
        const session = this.session[sid];
        callback(null, session ? JSON.parse(session) : null);
    }

    set(sid, sessionData, callback) {
        this.session[sid] = JSON.stringify(sessionData);
        callback(null);
    }

    destroy(sid, callback) {
        delete this.session[sid];
        callback(null);
    }
}

export default SessionStorage;