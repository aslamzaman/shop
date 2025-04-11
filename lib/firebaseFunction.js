import { db } from "./firebaseConfig";
import { collection, addDoc, deleteDoc, doc, getDocs, setDoc, query, where, } from 'firebase/firestore';
import { get, set } from "idb-keyval";



const idbStorageGetItem = async (key, maxAge) => {
    try {
        const idbStorageData = await get(key);
        const now = Date.now();
        if (idbStorageData && idbStorageData.timestamp){
            const isDataFresh = (now - idbStorageData.timestamp) < maxAge;
            return isDataFresh ? idbStorageData.data : null;
        }
        return null;
    }catch (error) {
        console.error("Error retrieving data from IndexedDB:", error);
        return null;
    }
}



const idbStorageSetItem = async (key, data) => {
    try {
        const now = Date.now();
        await set(key, {
            data: data,
            timestamp: now
        });
    }catch (error) {
        console.error("Error retrieving data from IndexedDB:", error);       
    }
}



/**
 * Get data from Firebase. 
 * @param {String} collectionName - Collection Name
 * @returns 
 */
export const getDataFromFirebase = async (collectionName, userId) => {
    try {
        const maxCacheAge = 2 * 60 * 60 * 1000; // 2 hour
        const idbStorageData = await idbStorageGetItem(collectionName, maxCacheAge);

        if (idbStorageData) {
            console.log("Data from IndexDB:", collectionName);
            return idbStorageData;
        }

        const collectionRef = collection(db, collectionName);
        const q = query(
            collectionRef,
            where("userId", "==", userId)
          );

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        })

        await idbStorageSetItem(collectionName, data);
        console.log("Data from remote API:", collectionName);
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}



/**
 * Add new data to firebase
 * @param {String} collectionName - Collection Name
 * @param {Object} data - JS object
 * @returns
 */
export const addDataToFirebase = async (collectionName, data) => {
    try {
        const collectionRef = collection(db, collectionName);
        const docRef = await addDoc(collectionRef, data);

        let updatedData;
        const cachedData = await idbStorageGetItem(collectionName, Number.MAX_SAFE_INTEGER);
        if (cachedData) {
            updatedData = [...cachedData, { id: docRef.id, ...data }];
        } else {
            updatedData = [{ id: docRef.id, ...data }];
        }

        await idbStorageSetItem(collectionName, updatedData);

        return `Data saved successfully. New Id: ${docRef.id}`;
    } catch (err) {
        console.error('Error adding document: ', err);
        return "Data saving error!";
    }
};



/**
 * Update existing data
 * @param {String} collectionName - Collection Name
 * @param {String} id - Uniqute ID
 * @param {Object} data - JS Object
 * @returns
 */
export const updateDataToFirebase = async (collectionName, id, data) => {
    try {
        const collectionRef = collection(db, collectionName);
        const refDoc = doc(collectionRef, id);
        await setDoc(refDoc, data);

        const cachedData = await idbStorageGetItem(collectionName, Number.MAX_SAFE_INTEGER);
        const updatedData = cachedData.map(item => (item.id === id ? { id, ...data } : item));
        await idbStorageSetItem(collectionName, updatedData);

        return `Data updated successfully. Updated Id : ${id}`;
    } catch (err) {
        console.error('Error adding document: ', err);
        return "Data updating error!";
    }
};



/**
 * Delete data from firebase
 * @param {String} collectionName - Collection Name
 * @param {String} id - Unique ID
 * @returns 
 */
export const deleteDataFromFirebase = async (collectionName, id) => {
    try {
        const collectionRef = collection(db, collectionName);
        const refDoc = doc(collectionRef, id);
        await deleteDoc(refDoc);

        const cachedData = await idbStorageGetItem(collectionName, Number.MAX_SAFE_INTEGER);
        const updatedData = cachedData.filter(item => item.id !== id)
        await idbStorageSetItem(collectionName, updatedData);

        return `Data deleted successfully. Deleted Id : ${id}`;
    } catch (err) {
        console.error('Error adding document: ', err);
        return "Data deleting error!";
    }
};



/**
 * Add data to custom id
 * @param {String} collectionName -collection name
 * @param {String} id - Unique id
 * @param {Object} data - Object 
 * @returns 
 */
export const addDataToFirebaseWithCustomId = async (collectionName, id, data) => {
    try {
        const collectionRef = collection(db, collectionName);
        const refDoc = doc(collectionRef, id);
        await setDoc(refDoc, data);
        return `Data updated successfully. Updated Id : ${id}`;
    } catch (err) {
        console.error('Error adding document: ', err);
        return "Data updating error!";
    }
};








