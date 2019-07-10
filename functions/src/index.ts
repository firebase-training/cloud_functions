import * as admin from 'firebase-admin';

admin.initializeApp();

export * from './functions/hello-world';
export * from './functions/migrate';

