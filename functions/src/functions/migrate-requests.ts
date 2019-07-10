import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

const FieldValue = admin.firestore.FieldValue;

export const migrateAgetoBirthdayRequest = async (request: Request, response: Response) => {  
    const db = admin.firestore();

    const usersRef = db.collection('users');
    
    // TODO
}

export const migrateAgetoBirthdayWithTransactionRequest = async (request: Request, response: Response) => {  
    const db = admin.firestore();

    const usersRef = db.collection('users');

    // TODO
}