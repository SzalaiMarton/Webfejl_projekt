import session from "express-session";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

class SessionStorage extends session.Store {
    constructor() {
        super();
        this.sessions = {};
        this._ready = false;
        this._loading = this._loadFromFile().then(() => {
            this._ready = true;
        });
    }

    async _ensureReady() {
        if (!this._ready) await this._loading;
    }

    async _ensureFile() {
        await fs.mkdir(DATA_DIR, { recursive: true });
        try {
            await fs.access(SESSIONS_FILE);
        } catch {
            await fs.writeFile(SESSIONS_FILE, JSON.stringify({}, null, 2));
        }
    }

    async _loadFromFile() {
        try {
            await this._ensureFile();
            const raw = await fs.readFile(SESSIONS_FILE, 'utf8');
            this.sessions = JSON.parse(raw || '{}');
        } catch (err) {
            console.error('Failed to load sessions:', err);
            this.sessions = {};
        }
    }

    async _saveToFile() {
        try {
            await fs.writeFile(
                SESSIONS_FILE,
                JSON.stringify(this.sessions, null, 2)
            );
        } catch (err) {
            console.error('Failed to save sessions:', err);
        }
    }

    _pruneExpired() {
        const now = Date.now();
        for (const sid in this.sessions) {
            const sess = this.sessions[sid];
            if (sess?.cookie?.expires && new Date(sess.cookie.expires) < now) {
                delete this.sessions[sid];
            }
        }
    }

    get(sid, callback) {
        this._ensureReady().then(() => {
            const sess = this.sessions[sid] ?? null;

            if (sess?.cookie?.expires && new Date(sess.cookie.expires) < Date.now()) {
                delete this.sessions[sid];
                return callback(null, null);
            }

            callback(null, sess);
        }).catch(callback);
    }

    set(sid, sessionData, callback) {
        this._ensureReady().then(async () => {
            this.sessions[sid] = sessionData;
            await this._saveToFile();
            callback?.(null);
        }).catch(callback);
    }

    destroy(sid, callback) {
        this._ensureReady().then(async () => {
            delete this.sessions[sid];
            await this._saveToFile();
            callback?.(null);
        }).catch(callback);
    }

    touch(sid, sessionData, callback) {
        this._ensureReady().then(async () => {
            if (this.sessions[sid]) {
                this.sessions[sid].cookie = sessionData.cookie;
                await this._saveToFile();
            }
            callback?.(null);
        }).catch(callback);
    }

    async clear(callback) {
        await this._ensureReady();
        this._pruneExpired();
        await this._saveToFile();
        callback?.(null);
    }
}

export default SessionStorage;