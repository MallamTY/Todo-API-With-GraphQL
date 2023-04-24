import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configuration.js";


export const tokenVerifier = (token) => {
    const payload = jwt.verify(token, JWT_SECRET);

    return payload;
}