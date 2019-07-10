// Assertion library.
import { expect, use } from 'chai';
import * as admin from 'firebase-admin';
import * as functionsTest from 'firebase-functions-test';
import * as sinon from 'sinon';
// Extends Chai with assertions for the Sinon.JS 
import * as sinonChai from 'sinon-chai';
import { estimateBirthday } from '../../src/functions/migrate';
import { migrateAgetoBirthdayRequest } from '../../src/functions/migrate-requests';

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
    const res: any = {
      send: sinon.fake()
    };

    await migrateAgetoBirthdayRequest(null as any, res);
    expect(res.send).to.have.been.calledWith('Migrated AgetoBirthday!');
  });

  it('should estimate birthyear from age', () => {
    const beforeSnap = test.firestore.makeDocumentSnapshot({ age: 20 }, 'users/11111');
    const afterSnap = test.firestore.makeDocumentSnapshot({ age: 50 }, 'users/11111');
    const change = test.makeChange(beforeSnap, afterSnap);

    const wrapped = test.wrap(estimateBirthday);
    return wrapped(change).then(() => {
      return admin.firestore().collection("users").doc("11111").get().then((createdSnap) => {
        expect(createdSnap.data()!!.birthyear).to.equal(1969);
      });
    });
  });

});