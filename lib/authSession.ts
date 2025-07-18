import { getServerSession } from "next-auth";
import { authConfig } from "./auth";

export const getAuthSession = () => getServerSession(authConfig);
