declare namespace NodeJS {
  export interface ProcessEnv {
    DEBUG: string;
    SERVER_PORT: string;
    NODE_ENV: string;
    JWT_SECRET: string;
    API_KEY: string;
    MAIL_PASSWORD: string;

    MYSQL_USER: string;
    MYSQL_PASSWORD: string;
    DB_HOST: string;
    MYSQL_DATABASE: string;

    IMAGES_LOCATION: string;
    IMAGES_MAX_SIZE: string;
  }
}
