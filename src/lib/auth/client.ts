"use client";

import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react
import { NEXT_PUBLIC_BASE_PATH, NEXT_PUBLIC_BASE_URL } from "lib/const";

export const authClient = createAuthClient({
    baseURL: NEXT_PUBLIC_BASE_URL,
    basePath: NEXT_PUBLIC_BASE_PATH + "/api/auth",
});

