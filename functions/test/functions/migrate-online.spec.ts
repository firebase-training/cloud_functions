// Assertion library.
import { use } from 'chai';
import * as admin from 'firebase-admin';
import * as functionsTest from 'firebase-functions-test';
// Extends Chai with assertions for the Sinon.JS 
import * as sinonChai from 'sinon-chai';

const test = functionsTest({
  projectId: 'sbb-firebase-playground'
}, 'test/secret-service-key.json');

use(sinonChai);

describe('migrate online', () => {

  before(() => {
    admin.initializeApp();
    admin.firestore().collection('users').doc('11111').set({ age: 20 });
  });

  after(() => {
    test.cleanup();
    admin.firestore().collection('users').listDocuments().then(docs => {
      docs.forEach((doc) => doc.delete());
    });
  });

  it('Migrated AgetoBirthday! message should appear', async () => {
      // TODO
  });

  it('should estimate birthyear from age', () => {
    // TODO
  });

});