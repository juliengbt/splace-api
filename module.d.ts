declare namespace NodeJS {
  export interface ProcessEnv {
    DEBUG: string

    DB_USER: string
    DB_PASSWORD: string
    DB_HOST: string
    DB_NAME: string

    IMAGES_LOCATION: string
    IMAGES_MAX_SIZE: string
  }
}
