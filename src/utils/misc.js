import isWsl from 'is-wsl';
import isUUID from 'is-uuid';
import * as path from 'path';
import * as fs from 'fs';

export const isWT = () => (process.platform === 'win32' || isWsl) && isUUID.v4(process.env.WT_SESSION);

export const dontCopy = (env = process.env) => {
    // Copy if forced
    if (env.WTFRAGMENT_FORCE) {
        return false;
    }

    // Don't copy after oracle postinstall
    if (env.OC_POSTINSTALL_TEST) {
        return true;
    }

    // Don't copy if on CI
    if (env.CI || env.CONTINUOUS_INTEGRATION) {
        return true;
    }

    // Don't copy if not on windows terminal
    if (!isWT()) {
        return true;
    }

    // Only copy in dev environment
    return Boolean(env.NODE_ENV) && !['dev', 'development'].includes(env.NODE_ENV);
};

export const reportAndThrowError = (msg) => {
    console.error(msg);
    throw new Error(msg);
};

export const getResolvedPath = (rootPath) => {
    return path.resolve(rootPath);
};

export const getPkg = (pathToPkg) => {
    const fullPathToPkg = path.resolve(`${pathToPkg}/package.json`);
    try {
        return JSON.parse(fs.readFileSync(fullPathToPkg, 'utf8'));
    } catch (e) {
        reportAndThrowError(`Could not find package.json at ${fullPathToPkg}`);
    }
};

export const getFragmentPath = (pkg) => {
    return path.resolve(pkg['wt-f'] || './.wt.json');
};

export const getFragmentName = (fragmentPath) => {
    return path.basename(fragmentPath);
};

export const copyFragment = (rootPath, fragmentPath, destPath) => {
    const fragment = JSON.parse(fs.readFileSync(fragmentPath, 'utf8'));

    if (Array.isArray(fragment.profiles)) {
        for (const profile of fragment.profiles) {
            const keysWithPath = ['startingDirectory', 'icon'];

            for (const key of keysWithPath) {
                if (profile[key] && typeof profile[key] === 'string' && profile[key].startsWith('./')) {
                    profile[key] = path.join(rootPath, profile[key].slice(2));
                }
            }
        }
    }

    fs.writeFileSync(destPath, JSON.stringify(fragment));
};

export const getTargetFolderPath = (projectName) => {
    let targetPath = process.env.LOCALAPPDATA;
    const folders = ['Microsoft', 'Windows Terminal', 'Fragments', projectName];

    for (const folder of folders) {
        targetPath = path.join(targetPath, folder);
        if (!fs.existsSync(targetPath)) {
            fs.mkdirSync(targetPath);
        }
    }

    return targetPath;
};