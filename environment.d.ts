declare namespace NodeJS {
  interface ProcessEnv {
    COMMIT_HASH: string;
    APP_VERSION: string;
  }
}
