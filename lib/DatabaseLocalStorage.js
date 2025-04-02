
/**
 * Get data from local storage
 * @param {String} key - Storage key
 * @returns 
 */
export const localStorageGetItem = (key) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : [];
}



/**
 * Add new data
 * @param {String} key - Storage key
 * @param {Object} item - JSON Object
 * @returns 
 */
export const localStorageAddItem = (key, item) => {
    try {
        const value = localStorage.getItem(key);
        const data = value ? JSON.parse(value) : [];
        data.push(item);
        localStorage.setItem(key, JSON.stringify(data));
        return `Data saved successfully. New Id: ${item.id} `;
    } catch (error) {
        console.error("Error adding item to localStorage:", error);
        return "Failed to save data.";
    }
}


/**
 * Local storage set item; Usase at upload data
 * @param {String} key  - Storage key
 * @param {Object} data  - JSON data
 * @returns 
 */
export const localStorageSetItem = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return "Data saved successfully.";
    } catch (error) {
        console.error("Error adding item to localStorage:", error);
        return "Failed to save data.";
    }
}



/**
 * Local storage update item
 * @param {String} key  - Storage key
 * @param {Number} id - Unique ID
 * @param {Object} item - Object Data
 * @returns 
 */
export const localStorageUpdateItem = (key, id, item) => {
    try {
        const value = localStorage.getItem(key);
        const data = value ? JSON.parse(value) : [];
        const updatedData = data.map(localData => (localData.id === id ? item : localData));
        localStorage.setItem(key, JSON.stringify(updatedData));
        return `Data updated successfully. Updated Id: ${id} `;
    } catch (error) {
        console.error('Error data updating to local storage.');
        return 'Failed to update data.';
    }
}



/**
 * Local storage delete item
 * @param {String} key  - Storage key
 * @param {Number} id  - Unique ID
 * @returns 
 */
export const localStorageDeleteItem = (key, id) => {
    try {
        const value = localStorage.getItem(key);
        const data = value ? JSON.parse(value) : [];
        const updatedItems = data.filter(item => parseInt(item.id) !== parseInt(id));

        if (updatedItems.length === data.length) {
            return 'Data does not match for deletion';
        }
        localStorage.setItem(key, JSON.stringify(updatedItems));
        return `Data deleted successfully. Deleted Id: ${id} `;
    } catch (error) {
        console.error('Error to deleting data to localstorage.');
        return 'Failed to delete data.';
    }
};



/**
 * Delete all data from local storage
 * @param {String} key  - Storage key
 * @returns 
 */
export const localStorageRemoveItem = (key) => {
    try {
        localStorage.removeItem(key);
        return "All data deleted successfully.";
    } catch (error) {
        console.error('Error to deleting data to localstorage.');
        return 'Failed to delete data.';
    }
};
