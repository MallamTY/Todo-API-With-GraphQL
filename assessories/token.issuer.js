import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configuration.js";


export const tokenIssuer = (id, username, email) => {
    const token  = jwt.sign({id, email, username}, JWT_SECRET, {expiresIn: "2d"});

    return `Bearer ${token}`;
}