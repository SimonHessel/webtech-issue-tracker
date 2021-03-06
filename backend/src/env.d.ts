declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_PORT: string;
    DATABASE_HOST: string;
    DATABASE_USER: string;
    DATABASE_PASS: string;
    DATABASE_NAME: string;
    LOGGING: string;
    DATABASE_SYNCHRONIZE: string;
    ACCESS_TOKEN_EXPIRATION: string;
    REFRESH_TOKEN_EXPIRATION: string;
    REFRESH_TOKEN_COOKIE_NAME: string;
    ACCESS_TOKEN_HEADER_NAME: string;
    FRONTEND_DOMAINS: string;
    JWT_SECRET: string;
    SMTP_USERNAME?: string;
    SMTP_PASSWORD?: string;
    BASE_URL: string;
  }
}
