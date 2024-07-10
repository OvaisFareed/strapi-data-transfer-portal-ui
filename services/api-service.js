import { LOCAL_STRAPI_API_BASE_PATH, LOCAL_STRAPI_API_CONFIG, REMOTE_STRAPI_API_BASE_PATH, REMOTE_STRAPI_API_CONFIG } from "@/constants/environment";
import axios from "axios";
import { normalizeData } from "./helper";
import { mediaAPIRoutes, strapiAPIRoutesForCollections, strapiAPIRoutesForSingleTypes } from "@/constants/api-routes";

/**
 * Get all collections
 * @returns 
 */
export const getAllCollections = async (type = 'C') => {
    const promises = [];
    const urls = Object.values(type === 'S' ? strapiAPIRoutesForSingleTypes : strapiAPIRoutesForCollections);
    try {
        for (let i = 0; i < urls.length; i++) {
            promises.push(axios.get(`${REMOTE_STRAPI_API_BASE_PATH}${urls[i]}?populate=*&pagination[limit]=500`, REMOTE_STRAPI_API_CONFIG));
        }
        return Promise.allSettled(promises);
    } catch (e) {
        return JSON.parse(JSON.stringify(e));
    }
}

/**
 * Get single collection by url
 * @param {*} url 
 * @returns 
 */
export const getCollectionByUrl = async (url) => {
    try {
        const res = await axios.get(`${REMOTE_STRAPI_API_BASE_PATH}${url}?populate=*`, REMOTE_STRAPI_API_CONFIG);
        if (res.data && res.data.data) {
            res.data = normalizeData(res.data.data);
        }
        return JSON.parse(JSON.stringify(res.data));
    } catch (e) {
        return JSON.parse(JSON.stringify(e));
    }
}

/**
 * Get all media
 * @param {*} url 
 * @returns 
 */
export const getAllMedia = async (url = mediaAPIRoutes.GET) => {
    try {
        const options = {
            headers: {
                Authorization: REMOTE_STRAPI_API_CONFIG.headers.Authorization
            },
        }
        const res = await axios.get(`${REMOTE_STRAPI_API_BASE_PATH}${url}`, options);
        return JSON.parse(JSON.stringify(res.data));
    } catch (e) {
        return JSON.parse(JSON.stringify(e));
    }
}

/**
 * Creates new entry
 * @param {*} url 
 * @param {*} payload 
 * @returns 
 */
export const uploadAllMedia = async (url, payload) => {
    try {
        const options = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: LOCAL_STRAPI_API_CONFIG.headers.Authorization,
            },
        }
        const res = await axios.post(`${LOCAL_STRAPI_API_BASE_PATH}${url}`, payload, options);
        return JSON.parse(JSON.stringify(res.data));
    }
    catch (e) {
        return JSON.parse(JSON.stringify(e));
    }
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
 * Updates an entry
 * @param {*} url 
 * @param {*} payload 
 * @returns 
 */
export const updateData = async (url, payload) => {
    try {
        payload = { data: payload };
        const res = await axios.put(`${LOCAL_STRAPI_API_BASE_PATH}${url}`, payload, LOCAL_STRAPI_API_CONFIG);
        return JSON.parse(JSON.stringify(res.data));
    }
    catch (e) {
        return JSON.parse(JSON.stringify(e));
    }
}

/**
 * Updates media info
 * @param {*} url 
 * @param {*} payload 
 * @returns 
 */
export const updateMediaInfo = async (url, payload) => {
    try {
        const options = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: LOCAL_STRAPI_API_CONFIG.headers.Authorization,
            },
        }
        const res = await axios.post(`${LOCAL_STRAPI_API_BASE_PATH}${url}`, payload, options);
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
    try {
        const response = await axios.get(`${LOCAL_STRAPI_API_BASE_PATH}${url}?pagination[limit]=100`, LOCAL_STRAPI_API_CONFIG);
        let dataHash = {};
        if (response.data.data) {
            response.data.data.forEach((item, index) => {
                dataHash[index] = { id: item['id'], ...item['attributes'] };
            });
        }

        entries = Object.values(dataHash);
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

/**
 * Delete all media
 * @param {*} url 
 * @returns 
 */
export const deleteAllMedia = async (url) => {
    const promises = [];
    try {
        const response = await axios.get(`${LOCAL_STRAPI_API_BASE_PATH}${url}?pagination[limit]=2000`, LOCAL_STRAPI_API_CONFIG);
        for (let i = 0; i < response.data.length; i++) {
            promises.push(axios.delete(`${LOCAL_STRAPI_API_BASE_PATH}${url}/${response.data[i].id}`, LOCAL_STRAPI_API_CONFIG));
        }
        return Promise.all(promises);
    } catch (e) {
        return JSON.parse(JSON.stringify(e));
    }
}