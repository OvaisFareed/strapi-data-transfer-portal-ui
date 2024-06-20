/**
 * Returns plain object from API response object
 * @param {*} data
 * @returns
 */
export function normalizeData(data) {
    const isObject = (data) =>
        Object.prototype.toString.call(data) === "[object Object]";
    const isArray = (data) =>
        Object.prototype.toString.call(data) === "[object Array]";

    const flatten = (data) => {
        if (!data.attributes) return data;

        return {
            ...data.attributes,
        };
    };

    if (isArray(data)) {
        return data.map((item) => normalizeData(item));
    }

    if (isObject(data)) {
        if (isArray(data.data)) {
            data = [...data.data];
        } else if (isObject(data.data)) {
            data = flatten({ ...data.data });
        } else if (data.data === null) {
            // data = null;
        } else {
            data = flatten(data);
        }

        for (const key in data) {
            data[key] = normalizeData(data[key]);
        }

        return data;
    }

    return data;
}