import addMinutes from "date-fns/addMinutes";
import { User } from "models/user";
import { Auth } from "models/auth";
import { Cart } from "models/cart";
import { sendCodeToEmail } from "lib/resend";

export async function findOrCreateUser(email: string): Promise<Auth> {
    const cleanEmail = email.trim().toLowerCase();
    const auth = await Auth.findByEmail(cleanEmail);
    if (auth) {
        return auth;
    } else {
        const newUser = await User.createNewUser({
            email: cleanEmail,
            personalInformation: {
                fullName: "",
                phone: "",
                address: "",
            },
            likedItems: [],
        });
        const newAuth = await Auth.createNewAuth({
            email: cleanEmail,
            userId: newUser.id,
            code: "",
            expires: new Date(),
        });
        const newCart = await Cart.createNewCart({
            userId: newUser.id,
            items: [],
        });
        return newAuth;
    }
}

export async function sendCodeToUser(email: string): Promise<boolean> {
    const auth = await findOrCreateUser(email);
    const code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    const dateNow = new Date();
    const dateThirtyMinsLater = addMinutes(dateNow, 30);
    auth.data.code = code;
    auth.data.expires = dateThirtyMinsLater;
    await auth.pushUserData();
    await sendCodeToEmail(email, code);
    return true;
}
