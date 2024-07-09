import { initializeApp } from 'firebase/app';
import dotenv from 'dotenv';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
dotenv.config();

const initialiseFirebaseAndExport = () => {
    const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTHDOMAIN,
        projectId: process.env.FIREBASE_PROJECTID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
    }

    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);

    return db;
}

// async function getCities() {
//     const citiesCol = collection(db, 'cities');
//     const citySnapshot = await getDocs(citiesCol);
//     const cityList = citySnapshot.docs.map(doc => doc.data());
//     return cityList;
// }

// (async() => {
//     const cities = await getCities();
//     if (cities.length === 0) {
//         console.log("no cities found");
//     }
//     else {
//         console.log(cities);
//     }
//     return;

// })();

export default initialiseFirebaseAndExport;