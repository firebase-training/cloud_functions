import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const FieldValue = admin.firestore.FieldValue;

export const estimateBirthday = functions.firestore.document('TODO').onUpdate((change, context) => {
    console.log("Estimate birthyear for document", context.params.userId);

    // TODO implementation

    // Retrieve the current and previous value

    // We'll only update if the age has changed.
    // This is crucial to prevent infinite loops.

    // Then return a promise of a update operation to update the count
});


export const migrateAgetoBirthday = functions.https.onRequest((request, response) => {
    admin.initializeApp({
        credential: admin.credential.applicationDefault()
    });

    const db = admin.firestore();

    const usersRef = db.collection('users');

     // TODO do migration
});

export const migrateAgetoBirthdayWithTransaction = functions.https.onRequest((request, response) => {
    // TODO same as above with transactions
});