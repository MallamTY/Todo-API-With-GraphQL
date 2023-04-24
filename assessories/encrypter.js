import { hash } from "bcrypt";



export const encrypter = async (password, salt) => {
    const hashedPassword = await hash(password, salt);

    return hashedPassword;
}