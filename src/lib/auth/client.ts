"use client";

import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react
import { NEXT_PUBLIC_BASE_PATH } from "lib/const";

export const authClient = createAuthClient({
    basePath: NEXT_PUBLIC_BASE_PATH + "/api/auth",
});

