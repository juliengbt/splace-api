declare namespace NodeJS {
  export interface ProcessEnv {
    DEBUG: string;
    NODE_ENV: string;
    JWT_SECRET: string;
    COOKIE_SECRET: string;
    DOMAIN_CLIENT?: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_ROOT_PASSWORD: string;
    DB_DATABASE: string;
    DB_TEST_DATABASE: string;
    DB_HOST: string;
    DB_PORT: string;
    PORT: string;
  }
}
