async function updateDocs() {
    const batchSize = 100; // Update 100 documents at a time
    const totalDocuments = await Students.countDocuments({}, {maxTimeMS: 30000});
    let updatedCount = 0;

    while (updatedCount < totalDocuments) {
        await Students.updateMany({}, { $set: { password: 'pa55@gctu' } }).skip(updatedCount).limit(batchSize);
        updatedCount += batchSize;
    }

    console.log('All documents updated successfully');
}

updateDocs();