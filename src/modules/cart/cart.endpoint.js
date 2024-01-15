import {roles} from "../../middleware/auth.js";
export const endpoint = {
    create: [roles.User],
    delete: [roles.User,roles.Admin],
    clear: [roles.User],
    get: [roles.User],
    getAll:[roles.Admin]
  };