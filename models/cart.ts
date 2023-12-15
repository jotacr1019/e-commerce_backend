import { firestore } from "lib/firestore";

const cartCollection = firestore.collection("carts");
export class Cart {
    ref: FirebaseFirestore.DocumentReference;
    id: string;
    data: any;
    constructor(id: string) {
        this.id = id;
        this.ref = cartCollection.doc(id);
    }
    async pullCartData() {
        const snapshot = await this.ref.get();
        this.data = snapshot.data();
    }
    async pushCartData() {
        await this.ref.update(this.data);
    }

    static async createNewCart(data) {
        const newCartSnap = await cartCollection.add(data);
        const newCart = new Cart(newCartSnap.id);
        newCart.data = data;
        return newCart;
    }
}
