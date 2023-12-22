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

    static async getCartOfUser(userId: string) {
        const results = await cartCollection
            .where("userId", "==", userId)
            .get();
        if (results.docs.length) {
            const cart = results.docs.map((doc) => {
                const cart = new Cart(doc.id);
                cart.data = doc.data();
                return cart.data;
            });
            return cart;
        } else {
            return null;
        }
    }
}
