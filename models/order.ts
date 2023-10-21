import { firestore } from "lib/firestore";

type OrderData = {
    status: "pending" | "approved" | "rejected";
    userId: string;
    productId: string;
    aditionalInfo: {};
};

const orderCollection = firestore.collection("orders");

export class Order {
    ref: FirebaseFirestore.DocumentReference;
    id: string;
    data: FirebaseFirestore.DocumentData;
    constructor(id) {
        this.id = id;
        this.ref = orderCollection.doc(id);
    }

    async pullOrderData() {
        const snapshot = await this.ref.get();
        this.data = snapshot.data();
    }

    async updateOrderData() {
        await this.ref.update(this.data);
    }

    static async createNewOrder(data: OrderData) {
        const newOrderSnap = await orderCollection.add(data);
        const newOrder = new Order(newOrderSnap.id);
        newOrder.data = data;
        newOrder.data.createdAt = new Date();
        newOrder.data.updatedAt = new Date();
        newOrder.data.backupDataFromTilopay = [];
        return newOrder;
    }

    static async getOrderById(orderId: string) {
        const order = new Order(orderId);
        await order.pullOrderData();
        return order;
    }

    static async getOrdersOfUser(userId: string) {
        const results = await orderCollection
            .where("userId", "==", userId)
            .get();
        if (results.docs.length) {
            const allOrders = results.docs.map((doc) => {
                const order = new Order(doc.id);
                order.data = doc.data();
                return order;
            });
            return allOrders;
        } else {
            return null;
        }
    }
}
