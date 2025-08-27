"use client";

import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react

const BASE_PATH = process.env.NEXT_BASE_PATH || "";
const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export const authClient = createAuthClient({
    baseURL: NEXT_PUBLIC_BASE_URL + BASE_PATH + "/api/auth",
});
