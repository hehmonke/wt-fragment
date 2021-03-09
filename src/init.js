import {
    copyFragment,
    dontCopy,
    getFragmentName,
    getFragmentPath,
    getPkg,
    getResolvedPath,
    getTargetFolderPath
} from './utils/misc';

export async function init(path) {
    if (dontCopy()) {
        return;
    }

    const resolvedPath = getResolvedPath(path);
    const pkg = getPkg(resolvedPath);
    const fragmentPath = getFragmentPath(pkg);
    const fragmentName = getFragmentName(fragmentPath);
    const targetFolderPath = getTargetFolderPath(pkg.name);
    copyFragment(resolvedPath, fragmentPath, targetFolderPath + '/' + fragmentName);
}