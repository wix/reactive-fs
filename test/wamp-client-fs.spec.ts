import {EventEmitter} from 'eventemitter3';
import * as Promise from 'bluebird';
import {expect} from 'chai';
import {Connection} from 'autobahn';
import {EventsMatcher} from '../test-kit/drivers/events-matcher';
import {FileSystem} from '../src/api';
import {MemoryFileSystem} from '../src/memory-fs';
import wampServerOverFs from '../src/wamp-server-over-fs';
import {WampServer, WampRouter, wampRealm} from '../src/wamp-server-over-fs';
import WampClientFileSystem from '../src/wamp-client-fs';
import {assertFileSystemContract, ignoredDir, ignoredFile} from './implementation-suite'

describe(`the wamp client filesystem implementation`, () => {

    let wampServer: WampServer;

    function server(): Promise<WampServer> {
        return wampServerOverFs(new MemoryFileSystem(undefined, [ignoredDir, ignoredFile]), 3000);
    }

    function getFS(): Promise<FileSystem> {
        return new WampClientFileSystem(`ws://127.0.0.1:3000`, wampRealm).init();
    }

    const eventMatcherOptions: EventsMatcher.Options = {
        interval: 1,
        noExtraEventsGrace: 10,
        timeout: 30
    };

    function retry(callback: () => boolean, delay: number = 100) {
        if (!callback()) setTimeout(callback, delay)
    }

    beforeEach(() => server().then(clientAndServer => wampServer = clientAndServer));

    afterEach(() => {
        return new Promise(resolve => {
            wampServer.router.close();
            resolve();
        });
    });

    assertFileSystemContract(getFS, eventMatcherOptions);
});
