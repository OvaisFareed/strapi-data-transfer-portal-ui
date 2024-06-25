import { LOCAL_STRAPI_API_BASE_PATH, LOCAL_STRAPI_API_CONFIG, REMOTE_STRAPI_API_BASE_PATH, REMOTE_STRAPI_API_CONFIG } from "@/constants/environment";
import axios from "axios";
import { normalizeData } from "./helper";
import { strapiAPIRoutes } from "@/constants/api-routes";

/**
 * Get all data 
 * @returns 
 */
export const getAllData = async () => {
    const promises = [];
    const urls = Object.values(strapiAPIRoutes);
    try {
        for (let i = 0; i < urls.length; i++) {
            promises.push(axios.get(`${REMOTE_STRAPI_API_BASE_PATH}${urls[i]}?populate=*&pagination[limit]=50`, REMOTE_STRAPI_API_CONFIG));
        }
        return Promise.all(promises);
    } catch (e) {
        return JSON.parse(JSON.stringify(e));
    }
}

/**
 * Get all data
 * @param {*} url 
 * @returns 
 */
export const getData = async (url) => {
    const res = await axios.get(`${REMOTE_STRAPI_API_BASE_PATH}${url}?populate=*`, REMOTE_STRAPI_API_CONFIG);
    if (res.data && res.data.data) {
        res.data = normalizeData(res.data.data);
    }
    return JSON.parse(JSON.stringify(res.data));
}

/**
 * Creates new entry
 * @param {*} url 
 * @param {*} payload 
 * @returns 
 */
export const createData = async (url, payload) => {
    try {
        payload = { data: payload };
        const res = await axios.post(`${LOCAL_STRAPI_API_BASE_PATH}${url}`, payload, LOCAL_STRAPI_API_CONFIG);
        return JSON.parse(JSON.stringify(res.data));
    }
    catch (e) {
        return JSON.parse(JSON.stringify(e));
    }
}

/**
 * Creates bulk entries
 * @param {*} url 
 * @param {*} entries 
 * @returns 
 */
export const createMany = async (url, entries) => {
    const promises = [];
    let payload = {};
    try {
        for (let i = 0; i < entries.length; i++) {
            delete entries[i].id;
            payload = { data: entries[i] }
            promises.push(axios.post(`${LOCAL_STRAPI_API_BASE_PATH}${url}`, payload, LOCAL_STRAPI_API_CONFIG));
        }
        return Promise.all(promises);
    } catch (e) {
        return JSON.parse(JSON.stringify(e));
    }
}

/**
 * Delete all data
 * @param {*} url 
 * @returns 
 */
export const deleteAllData = async (url) => {
    const promises = [];
    let entries = [];
    const response = await axios.get(`${LOCAL_STRAPI_API_BASE_PATH}${url}?pagination[limit]=100`, LOCAL_STRAPI_API_CONFIG);
    let dataHash = {};
    if (response.data.data) {
        response.data.data.forEach((item, index) => {
            dataHash[index] = { id: item['id'], ...item['attributes'] };
        });
    }

    entries = Object.values(dataHash);
    try {
        for (let i = 0; i < entries.length; i++) {
            promises.push(axios.delete(`${LOCAL_STRAPI_API_BASE_PATH}${url}/${entries[i].id}`, LOCAL_STRAPI_API_CONFIG));
        }
        Promise.all(promises)
            .then(res => {
                return JSON.parse(JSON.stringify(res));
            })
            .catch(err => {
                return JSON.parse(JSON.stringify(err));
            })
    } catch (e) {
        return JSON.parse(JSON.stringify(e));
    }
}