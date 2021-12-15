// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();
process.env.GOOGLE_APPLICATION_CREDENTIALS="utils/auth.json";

const deleteFile = async (bucketName, fileName) => {
    try {
        await storage.bucket(bucketName).file(fileName).delete();
    } catch(err) {
        console.log(err);
        return;
    }
    console.log(`gs://${bucketName}/${fileName} deleted`);
}

module.exports = { deleteFile }