// export const API_BASE_URL = process.env.NEXT_PUBLIC_PROJECT_BASE_PATH;
// export const LOCAL_STRAPI_API_BASE_PATH = process.env.NEXT_PUBLIC_LOCAL_STRAPI_API_BASE_PATH;
// export const REMOTE_STRAPI_BASE_PATH = process.env.NEXT_PUBLIC_REMOTE_STRAPI_BASE_PATH;
// export const REMOTE_STRAPI_API_BASE_PATH = process.env.NEXT_PUBLIC_REMOTE_STRAPI_API_BASE_PATH;
// export const LOCAL_STRAPI_API_CONFIG = { headers: { Authorization: process.env.NEXT_PUBLIC_LOCAL_STRAPI_TOKEN } };
// export const REMOTE_STRAPI_API_CONFIG = { headers: { Authorization: process.env.NEXT_PUBLIC_REMOTE_STRAPI_TOKEN } };
import * as env from "./env.json";

export const LOCAL_STRAPI_API_BASE_PATH = `${env.to}api`;
export const REMOTE_STRAPI_API_BASE_PATH = `${env.from}`;
export const LOCAL_STRAPI_API_CONFIG = { headers: { Authorization: `Bearer ${env.toAPIToken}` } };
export const REMOTE_STRAPI_API_CONFIG = { headers: { Authorization: `Bearer ${env.fromAPIToken}` } };