import { firestore } from "lib/firestore";

const userCollection = firestore.collection("users");
export class User {
    ref: FirebaseFirestore.DocumentReference;
    id: string;
    data: any;
    constructor(id: string) {
        this.id = id;
        this.ref = userCollection.doc(id);
    }
    async pullUserData() {
        const snapshot = await this.ref.get();
        this.data = snapshot.data();
    }
    async pushUserData() {
        await this.ref.update(this.data);
    }

    static async createNewUser(data) {
        const newUserSnap = await userCollection.add(data);
        const newUser = new User(newUserSnap.id);
        newUser.data = data;
        return newUser;
    }
}
