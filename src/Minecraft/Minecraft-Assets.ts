/**
 * @author Luuxis
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0/
 */

import nodeFetch from 'node-fetch';
import fs from 'fs';
import { ILauncherOptions } from '../Launch';

export default class MinecraftAssets {
    assetIndex: IAssetIndex;
    options: ILauncherOptions;
    constructor(options: ILauncherOptions) {
        this.options = options;
    }

    async GetAssets(json: IVersionData) {
        this.assetIndex = json.assetIndex;

        let assets: ({
            sha1: string,
            size: number,
            path: string,
            type: "Assets",
            url: string,
        }|{
            type: "CFILE",
            path: string,
            content: string
        })[] = [];
        let data = await nodeFetch(this.assetIndex.url).then(res => res.json());

        assets.push({
            type: "CFILE",
            path: `assets/indexes/${this.assetIndex.id}.json`,
            content: JSON.stringify(data)
        });

        data = Object.values(data.objects);

        for (let asset of data) {
            assets.push({
                sha1: asset.hash,
                size: asset.size,
                type: "Assets",
                path: `assets/objects/${asset.hash.substring(0, 2)}/${asset.hash}`,
                url: `https://resources.download.minecraft.net/${asset.hash.substring(0, 2)}/${asset.hash}`
            });
        }
        return assets
    }

    copyAssets(json: IVersionData) {
        let legacyDirectory = `${this.options.path}/resources`;
        let pathAssets = `${this.options.path}/assets/indexes/${json.assets}.json`;
        if (!fs.existsSync(pathAssets)) return;
        let assets = JSON.parse(fs.readFileSync(pathAssets, 'utf-8'));
        assets = Object.entries(assets.objects);

        for (let [file, hash] of assets) {
            let Hash = hash.hash;
            let Subhash = Hash.substring(0, 2)
            let SubAsset = `${this.options.path}/assets/objects/${Subhash}`
            let legacyAsset = file.split('/')
            legacyAsset.pop()

            if (!fs.existsSync(`${legacyDirectory}/${legacyAsset.join('/')}`)) {
                fs.mkdirSync(`${legacyDirectory}/${legacyAsset.join('/')}`, { recursive: true })
            }

            if (!fs.existsSync(`${legacyDirectory}/${file}`)) {
                fs.copyFileSync(`${SubAsset}/${Hash}`, `${legacyDirectory}/${file}`)
            }
        }
    }
}