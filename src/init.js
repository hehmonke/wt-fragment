import {copyFragment, dontCopy, getFragmentName, getFragmentPath, getPkg} from './utils/misc';
import * as fs from 'fs';

export async function init(path) {
    if (dontCopy()) {
        return;
    }

    const pkg = getPkg(path);
    const fragmentPath = getFragmentPath(pkg);
    const fragmentName = getFragmentName(fragmentPath);
    const localAppDataPath = process.env.LOCALAPPDATA;
    let copyToPath = localAppDataPath + '/Microsoft';

    if (!fs.existsSync(copyToPath)) {
        fs.mkdirSync(copyToPath);
    }

    copyToPath += '/Windows Terminal';

    if (!fs.existsSync(copyToPath)) {
        fs.mkdirSync(copyToPath);
    }

    copyToPath += '/Fragments';

    if (!fs.existsSync(copyToPath)) {
        fs.mkdirSync(copyToPath);
    }

    copyToPath += '/' + pkg.name;

    if (!fs.existsSync(copyToPath)) {
        fs.mkdirSync(copyToPath);
    }

    copyFragment(fragmentPath, copyToPath + '/' + fragmentName);
}