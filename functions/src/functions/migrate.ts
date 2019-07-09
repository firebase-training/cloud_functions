import * as admin from 'firebase-admin';
import { estimateBirthYear } from '../shared/birthyear';
import { localFunction } from '../shared/functions';

const FieldValue = admin.firestore.FieldValue;

export const estimateBirthday = localFunction.firestore.document('users/{userId}').onUpdate((change, context) => {
    console.log("Estimate birthyear for document", context.params.userId);

    // Retrieve the current and previous value
    const data = change.after.data();
    const previousData = change.before.data();

    // We'll only update if the name has changed.
    // This is crucial to prevent infinite loops.
    if (!data || !previousData || data.age === previousData.age) {
        return null;
    }

    // Then return a promise of a set operation to update the count
    return change.after.ref.update({
        birthyear: estimateBirthYear(data.age)
    });
});


export const migrateAgetoBirthday = localFunction.https.onRequest((request, response) => {
    admin.initializeApp({
        credential: admin.credential.applicationDefault()
    });

    const db = admin.firestore();

    const usersRef = db.collection('users');
    
    usersRef.get().then(snapshot => {
        return Promise.all(snapshot.docs.map(doc => {
            console.log(doc.id, '=>', doc.data())
            return doc.ref.update({
                age: FieldValue.delete(),
                birthyear: estimateBirthYear(doc.data().age)
            })
        }));
    })
    .then(() => response.send("Migrated AgetoBirthday!"))
    .catch(err => {
        console.log('Error getting documents', err);
        response.status(500).send(err);
    });
});

export const migrateAgetoBirthdayWithTransaction = localFunction.https.onRequest((request, response) => {
    admin.initializeApp({
        credential: admin.credential.applicationDefault()
    });

    const db = admin.firestore();

    const usersRef = db.collection('users');

    return db.runTransaction(async transaction => {
        // This code may get re-run multiple times if there are conflicts.
        const snapshot = await transaction.get(usersRef);
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc);
            transaction.update(doc.ref, {
                age: FieldValue.delete(),
                birthyear: estimateBirthYear(doc.data().age)
            });
        });
    })
    .then(() => response.send("Migrated AgetoBirthday!"))
    .catch(err => {
        console.log("Transaction failed: ", err);
        response.status(500).send(err);
    });
});