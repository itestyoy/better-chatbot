import {
  GitHubConfigSchema,
  GoogleConfigSchema,
  MicrosoftConfigSchema,
  GitHubConfig,
  GoogleConfig,
  MicrosoftConfig,
  AuthConfig,
  AuthConfigSchema,
} from "app-types/authentication";
import { experimental_taintUniqueValue } from "react";
import { parseEnvBoolean } from "../utils";

import { NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_BASE_PATH } from "lib/const";

const redirectBase =
  (process.env.NEXT_PUBLIC_BASE_URL ?? "") +
  (NEXT_PUBLIC_BASE_PATH ?? "") +
  "/api/auth/callback";

function parseSocialAuthConfigs() {
  const configs: {
    github?: GitHubConfig;
    google?: GoogleConfig;
    microsoft?: MicrosoftConfig;
  } = {};

  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {

    const githubConfig: GitHubConfig = {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      redirectUri: `${redirectBase}/github`,
    };

    const googleResult = GoogleConfigSchema.safeParse(githubConfig);
    if (githubResult.success) {
      configs.github = githubResult.data;
      experimental_taintUniqueValue(
        "Do not pass GITHUB_CLIENT_SECRET to the client",
        configs,
        configs.github.clientSecret,
      );
    }
  }

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    const forceAccountSelection = parseEnvBoolean(
      process.env.GOOGLE_FORCE_ACCOUNT_SELECTION,
    );

    const googleConfig: GoogleConfig = {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: `${redirectBase}/google`,
      ...(forceAccountSelection && { prompt: "select_account" as const }),
    };

    const googleResult = GoogleConfigSchema.safeParse(googleConfig);
    if (googleResult.success) {
      configs.google = googleResult.data;
      experimental_taintUniqueValue(
        "Do not pass GOOGLE_CLIENT_SECRET to the client",
        configs,
        configs.google.clientSecret,
      );
    }
  }

  if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
    const forceAccountSelection = parseEnvBoolean(
      process.env.MICROSOFT_FORCE_ACCOUNT_SELECTION,
    );
    const tenantId = process.env.MICROSOFT_TENANT_ID || "common";

    const microsoftConfig: MicrosoftConfig = {
      clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      redirectUri: `${redirectBase}/microsoft`,
      tenantId,
      ...(forceAccountSelection && { prompt: "select_account" as const }),
    };

    const microsoftResult = MicrosoftConfigSchema.safeParse(microsoftConfig);
    if (microsoftResult.success) {
      configs.microsoft = microsoftResult.data;
      experimental_taintUniqueValue(
        "Do not pass MICROSOFT_CLIENT_SECRET to the client",
        configs,
        configs.microsoft.clientSecret,
      );
    }
  }

  return configs;
}

export function getAuthConfig(): AuthConfig {
  const rawConfig = {
    emailAndPasswordEnabled: process.env.DISABLE_EMAIL_SIGN_IN
      ? !parseEnvBoolean(process.env.DISABLE_EMAIL_SIGN_IN)
      : true,
    signUpEnabled: process.env.DISABLE_SIGN_UP
      ? !parseEnvBoolean(process.env.DISABLE_SIGN_UP)
      : true,
    socialAuthenticationProviders: parseSocialAuthConfigs(),
  };

  const result = AuthConfigSchema.safeParse(rawConfig);

  if (!result.success) {
    throw new Error(`Invalid auth configuration: ${result.error.message}`);
  }

  return result.data;
}
