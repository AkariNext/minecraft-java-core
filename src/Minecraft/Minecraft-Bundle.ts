/**
 * @author Luuxis
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0/
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { ILauncherOptions } from '../Launch';

type TBundle = {
    path: string;
    type: "CFILE";
    content: string;
} | {
    sha1?: string;
    size?: number;
    type: string;
    path: string;
    url: string;
}

function isCFILE(file: TBundle): file is { path: string; type: "CFILE"; content: string; } {
    if (file.type !== "CFILE") return false
    return true
}

export default class MinecraftBundle {
    options: ILauncherOptions;
    constructor(options: ILauncherOptions) {
        this.options = options;
    }

    async checkBundle(bundle: ({folder?:string} & TBundle)[]) {
        let todownload: ({
            folder?: string;
        } & TBundle)[] = [];

        for (let file of bundle) {
            if (!file.path) continue;
            file.path = path.resolve(this.options.path, file.path).replace(/\\/g, "/");
            file.folder = file.path.split("/").slice(0, -1).join("/");

            if (isCFILE(file)) {
                if (!fs.existsSync(file.folder)) fs.mkdirSync(file.folder, { recursive: true, mode: 0o777 });
                fs.writeFileSync(file.path, file.content, { encoding: "utf8", mode: 0o755 });
                continue;
            }

            if (fs.existsSync(file.path)) {
                if (this.options.ignored.find(ignored => ignored == file.path.split("/").slice(-1)[0])) continue
                if (file.sha1) if (!(await this.checkSHA1(file.path, file.sha1))) todownload.push(file);
            } else todownload.push(file);
        }
        return todownload;
    }

    async checkSHA1(file: string, sha1: string) {
        const hex = crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex')
        if (hex == sha1) return true;
        return false;
    }

    async getTotalSize(bundle: any) {
        let todownload = 0;
        for (let file of bundle) {
            todownload += file.size;
        }
        return todownload;
    }
}