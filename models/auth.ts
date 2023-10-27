import { firestore } from "lib/firestore";
import isAfter from "date-fns/isAfter";

const authCollection = firestore.collection("auth");

export class Auth {
    ref: FirebaseFirestore.DocumentReference;
    id: string;
    data: FirebaseFirestore.DocumentData;
    constructor(id: string) {
        this.id = id;
        this.ref = authCollection.doc(id);
    }
    async pullUserData() {
        const snapshot = await this.ref.get();
        this.data = snapshot.data();
    }
    async pushUserData() {
        await this.ref.update(this.data);
    }

    isCodeExpired() {
        const now = new Date();
        const expires = this.data.expires.toDate();
        return isAfter(now, expires);
    }

    static cleanEmail(email) {
        return email.trim().toLowerCase();
    }

    static async createNewAuth(data) {
        const newUserSnap = await authCollection.add(data);
        const newUser = new Auth(newUserSnap.id);
        newUser.data = data;
        return newUser;
    }

    static async findByEmail(email: string) {
        const cleanEmail = Auth.cleanEmail(email);
        const results = await authCollection
            .where("email", "==", cleanEmail)
            .get();
        if (results.docs.length) {
            const firstAuth = results.docs[0];
            const newAuth = new Auth(firstAuth.id);
            newAuth.data = firstAuth.data();
            return newAuth;
        } else {
            return null;
        }
    }

    static async findByUserId(userId: string) {
        const results = await authCollection
            .where("userId", "==", userId)
            .get();
        if (results.docs.length) {
            const firstAuth = results.docs[0];
            const newAuth = new Auth(firstAuth.id);
            newAuth.data = firstAuth.data();
            return newAuth;
        } else {
            return null;
        }
    }

    static async findByEmailAndCode(email: string, code: number) {
        const cleanEmail = Auth.cleanEmail(email);
        const result = await authCollection
            .where("email", "==", cleanEmail)
            .where("code", "==", code)
            .get();
        if (result.empty) {
            return null;
        } else {
            const doc = result.docs[0];
            const auth = new Auth(doc.id);
            auth.data = doc.data();
            return auth;
        }
    }
}
