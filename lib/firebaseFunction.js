import { db } from "./firebaseConfig";
import { collection, addDoc, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { get, set, del } from "idb-keyval";



const idbStorageGetItem = async (key, maxAge) => {
    try {
        const idbStorageData = await get(key);
        const now = Date.now();
        if (idbStorageData && idbStorageData.timestamp) {
            const isDataFresh = (now - idbStorageData.timestamp) < maxAge;
            return isDataFresh ? idbStorageData.data : null;
        }
        return null;
    } catch (error) {
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
    } catch (error) {
        console.error("Error retrieving data from IndexedDB:", error);
    }
}


const idbStorageDeleteItem = async (key) => {
    try {
        await del(key);
    } catch (error) {
        console.error("Error retrieving data from IndexedDB:", error);
    }
}



/**
 * Get data from Firebase. 
 * @param {String} collectionName - Collection Name
 * @returns 
 */
export const getDataFromFirebase = async (collectionName) => {
    try {
        const maxCacheAge = 2 * 60 * 60 * 1000; // 2 hour
        const idbStorageData = await idbStorageGetItem(collectionName, maxCacheAge);

        if (idbStorageData) {
            console.log("Data from IndexDB:", collectionName);
            return idbStorageData;
        }

        const collectionRef = collection(db, collectionName);
        const querySnapshot = await getDocs(collectionRef);
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



export const getSingleDataFromFirebase = async (collectionName, id) => {
    try {

        const maxCacheAge = 2 * 60 * 60 * 1000; // 2 hour
        const catcheKey = `${collectionName}_${id}`;
        const idbStorageData = await idbStorageGetItem(catcheKey, maxCacheAge);

        if (idbStorageData) {
            console.log("Data from IndexDB:", collectionName);
            return idbStorageData;
        }


        const docRef = doc(db, collectionName, id);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            const data = {
                id: docSnapshot.id,
                ...docSnapshot.data(),
            };
            console.log("Data from firestore:");
            return data;
        } else {
            console.log("No document found with ID:", id);
            return null;
        }
    } catch (error) {
        console.error("Error fetching document:", error);
        return null;
    };
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
        await idbStorageDeleteItem(collectionName);
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

        const catcheKey = `${collectionName}_${id}`;
        await idbStorageDeleteItem(collectionName);
        await idbStorageDeleteItem(catcheKey);
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

        const catcheKey = `${collectionName}_${id}`;
        await idbStorageDeleteItem(collectionName);
        await idbStorageDeleteItem(catcheKey);
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





