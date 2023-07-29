/**
 * @author Luuxis
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0/
 */

import nodeFetch from 'node-fetch';
import { ILauncherOptions } from '../Launch';

interface IJsonVersion {
    id: string
    type: 'release' | 'snapshot'
    url: string
    time: string
    sha1: string
    complianceLevel: number
}

export interface IVersionJson {
    latest: {
        release: string
        snapshot: string
    }
    versions: IJsonVersion[]
    
}

export default class Json {
    options: ILauncherOptions;

    constructor(options: ILauncherOptions) {
        this.options = options;
    }

    async GetInfoVersion() {
        let version: string = this.options.version;
        const res = await nodeFetch(`https://launchermeta.mojang.com/mc/game/version_manifest_v2.json?_t=${new Date().toISOString()}`);
        const data: IVersionJson = await res.json();

        if (version == 'latest_release' || version == 'r' || version == 'lr') {
            version = data.latest.release;
        }
        else if (version == 'latest_snapshot' || version == 's' || version == 'ls') {
            version = data.latest.snapshot;
        }

        const InfoVersion = data.versions.find(v => v.id === version);

        if (!data) return {
            error: true,
            message: `Minecraft ${version} is not found.`
        };

        return {
            InfoVersion,
            json: data,
            version: version
        };
    }
}