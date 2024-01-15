import { roles } from "../../middleware/auth.js";
export const endPoint={
    create:[roles.Admin],
    get:[roles.Admin,roles.User],
    update:[roles.Admin],
    delete:[roles.Admin],
    restore:[roles.Admin]
}