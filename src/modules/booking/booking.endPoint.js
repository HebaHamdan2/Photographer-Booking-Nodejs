import {roles} from "../../middleware/auth.js";
export const endPoint={
create:[roles.User],
cancel:[roles.Admin,roles.User],
get:[roles.User],
getAll:[roles.Admin],
}