import { expect } from 'chai';
import { assertFileSystemContract, dirName, fileName } from './implementation-suite';
import { SlowFs } from './slow-fs';
import { FileSystem, MemoryFileSystem, TimeoutFileSystem } from '../src/universal';

describe('the timeout file system proxy', () => {
    const timeout = 200;

    assertFileSystemContract(() =>
        Promise.resolve(new TimeoutFileSystem(timeout, new MemoryFileSystem())),
        { retries: 15, interval: 2, timeout: 40, noExtraEventsGrace: 10 }
    );

    describe(`delayed timeout test`, () => {
        let fs: FileSystem;
        let startTimestamp: number;
        const delay = timeout * 2;

        beforeEach(() => {
            startTimestamp = Date.now();
            fs = new TimeoutFileSystem(timeout, new SlowFs(delay));
        });

        it(`ensureDirectory exit before delay is over`, async () => {
            await expect(fs.ensureDirectory(dirName)).to.eventually.be.rejectedWith('timed out');
            expect(startTimestamp - Date.now()).to.be.below(delay);
        });

        it(`saveFile exit before delay is over`, async () => {
            await expect(fs.saveFile(`${dirName}\\${fileName}`, '#goodnessSquad')).to.eventually.be.rejectedWith('timed out');
            expect(startTimestamp - Date.now()).to.be.below(delay);
        });

        it(`deleteFile exit before delay is over`, async () => {
            await expect(fs.deleteFile(`${dirName}\\${fileName}`)).to.eventually.be.rejectedWith('timed out');
            expect(startTimestamp - Date.now()).to.be.below(delay);
        });

        it(`deleteDirectory exit before delay is over`, async () => {
            await expect(fs.deleteDirectory(dirName)).to.eventually.be.rejectedWith('timed out');
            expect(startTimestamp - Date.now()).to.be.below(delay);
        });

        it(`loadTextFile exit before delay is over`, async () => {
            await expect(fs.loadTextFile(dirName)).to.eventually.be.rejectedWith('timed out');
            expect(startTimestamp - Date.now()).to.be.below(delay);
        });

        it(`loadDirectoryTree exit before delay is over`, async () => {
            await expect(fs.loadDirectoryTree()).to.eventually.be.rejectedWith('timed out');
            expect(startTimestamp - Date.now()).to.be.below(delay);
        });

        it(`stat exit before delay is over`, async () => {
            await expect(fs.stat(dirName)).to.eventually.be.rejectedWith('timed out');
            expect(startTimestamp - Date.now()).to.be.below(delay);
        });
    });
});
