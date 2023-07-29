/**
 * @author Luuxis
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0/
 */

import nodeFetch from 'node-fetch';
import { ILauncherOptions } from '../Launch';


export default class Json {
    options: ILauncherOptions;

    constructor(options: ILauncherOptions) {
        this.options = options;
    }

    async GetInfoVersion() {
        let version: string = this.options.version;
        const res = await nodeFetch(`https://launchermeta.mojang.com/mc/game/version_manifest_v2.json?_t=${new Date().toISOString()}`);
        let data: IVersionManifest = await res.json();

        if (version == 'latest_release' || version == 'r' || version == 'lr') {
            version = data.latest.release;
        }
        else if (version == 'latest_snapshot' || version == 's' || version == 'ls') {
            version = data.latest.snapshot;
        }

        let InfoVersion = data.versions.find(v => v.id === version);

        if (!data) {
            throw new Error('Minecraft version not found.');
        } 

        return {
            InfoVersion: data,
            json: await nodeFetch(InfoVersion.url).then(res => res.json() as Promise<IVersionData>),
            version: version
        };
    }
}