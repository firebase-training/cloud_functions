// Assertion library.
import { expect, use } from 'chai';
// Extends Chai with assertions for the Sinon.JS 
import * as sinonChai from 'sinon-chai';
import { estimateBirthYear } from '../../src/shared/birthyear';

use(sinonChai);

describe('birthyear', () => {

    it('50 year old should be born about 1969', () => {
        const birthyear = estimateBirthYear(50);
        expect(birthyear).to.equal(1969)
    });

    it('1 year old should be born about 2018', () => {
        const birthyear = estimateBirthYear(1);
        expect(birthyear).to.equal(2018)
    });

});