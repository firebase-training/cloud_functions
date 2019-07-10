import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { estimateBirthYear } from '../shared/birthyear';

const FieldValue = admin.firestore.FieldValue;

export const migrateAgetoBirthdayRequest = async (request: Request, response: Response) => {  
    const db = admin.firestore();

    const usersRef = db.collection('users');
    
    try {
        const snapshot = await usersRef.get();
        await Promise.all(snapshot.docs.map(doc => {
            const data = doc.data();
            console.log(doc.id, '=>', data);
            return doc.ref.update({
                age: FieldValue.delete(),
                birthyear: estimateBirthYear(data.age)
            });
        }));
        response.send("Migrated AgetoBirthday!");
    }
    catch (err) {
        console.log('Error migrating', err);
        response.status(500).send(err);
    }
}

export const migrateAgetoBirthdayWithTransactionRequest = async (request: Request, response: Response) => {  
    const db = admin.firestore();

    const usersRef = db.collection('users');

    try {
        await db.runTransaction(async (transaction) => {
            // This code may get re-run multiple times if there are conflicts.
            const snapshot = await transaction.get(usersRef);
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc);
                transaction.update(doc.ref, {
                    age: FieldValue.delete(),
                    birthyear: estimateBirthYear(doc.data().age)
                });
            });
        });
        return response.send("Migrated AgetoBirthday!");
    }
    catch (err) {
        console.log("Transaction failed: ", err);
        return response.status(500).send(err);
    }
}