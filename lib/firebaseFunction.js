import { db } from "./firebaseConfig";
import { collection, addDoc, deleteDoc, doc, getDocs, setDoc, query, where, } from 'firebase/firestore';
import { get, set } from "idb-keyval";


/**
 * Get data from Firebase. 
 * @param {String} collectionName - Collection Name
 * @returns 
 */
export const getDataFromFirebase = async (collectionName) => {
    try {
        const collectionRef = collection(db, collectionName);
        const querySnapshot = await getDocs(collectionRef);
        const data = querySnapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        })
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








