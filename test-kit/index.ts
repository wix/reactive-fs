/// <reference path="../node_modules/@types/mocha/index.d.ts" />
import * as cap from 'chai-as-promised';
import * as chai from 'chai';

export const hasFsModule = (typeof window === 'undefined');

chai.use(cap);
