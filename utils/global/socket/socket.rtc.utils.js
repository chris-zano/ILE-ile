export const watchRtcCollection = async (db) => {
    try {
        const changeStream = db.watch([], {fullDocument: 'updateLookup'});

        changeStream.on('change', (change) => {
            console.log(change);
        })
        console.log("Listening for cchanges in DB");
    } catch (error) {
        console.log("Error adding listener to db");
        console.log(error);
    }
}