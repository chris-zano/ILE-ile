import { addDoc, collection } from "firebase/firestore";
import { callInitFirebase } from "../../../requireStack.js"

/**
 * store
 * read
 * delete
 * add event listener
 */
export const storeData = async (socket, dataToStore) => {
    const firestoreDB = callInitFirebase();
    const genericCollection = collection(firestoreDB, "generics");
    const docref = await addDoc(genericCollection, {
        data: "generic data" + dataToStore 
    });

    console.log("Document written with id: ", docref.id);
    console.log("Document itself is: ", docref)

    socket.emit("firebase-store-complete", {docref});
}