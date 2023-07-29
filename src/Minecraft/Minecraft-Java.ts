/**
 * @author Luuxis
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0/
 */

import os from 'os';
import nodeFetch from 'node-fetch';
import path from 'path';



interface IJavaOptions {
    path: string;
}

export interface IJavaVersionJson {
    gamecore: IGamecore;
    linux: IGamecore;
    "linux-i386": IGamecore;
    "mac-os": IGamecore;
    "mac-os-arm64": IGamecore;
    "windows-arm64": IGamecore;
    "windows-x64": IGamecore;
    "windows-x86": IGamecore;
}

export interface IGamecore {
    "java-runtime-alpha": IJavaRuntimeAlpha[];
    "java-runtime-beta": IJavaRuntimeAlpha[];
    "java-runtime-gamma": IJavaRuntimeAlpha[];
    "jre-legacy": IJavaRuntimeAlpha[];
    "minecraft-java-exe": IJavaRuntimeAlpha[];
}

export interface IJavaRuntimeAlpha {
    availability: IAvailability;
    manifest: IManifest;
    version: IVersion;
}

export interface IAvailability {
    group: number;
    progress: number;
}

export interface IManifest {
    sha1: string;
    size: number;
    url: string;
}

export interface IVersion {
    name: string;
    released: Date;
}


export default class java {
    options: IJavaOptions;
    constructor(options: IJavaOptions) {
        this.options = options;
    }

    async GetJsonJava(jsonversion: any) {
        let files: IFile[] = [];
        let javaVersionsJson: IJavaVersionJson = await nodeFetch("https://launchermeta.mojang.com/v1/products/java-runtime/2ec0cc96c44e5a76b9c8b7c39df7210883d12871/all.json").then(res => res.json())

        const platformArchitecture = {
            win32: { x64: "windows-x64", ia32: "windows-x86" },
            darwin: { x64: "mac-os", arm64: "mac-os-arm64" },
            linux: { x64: "linux", ia32: "linux-i386" }
        }
        jsonversion = jsonversion.javaVersion ? jsonversion.javaVersion.component : 'jre-legacy'
        const platform = os.platform();
        const useArchitecture = platformArchitecture[platform][os.arch()];
        if (Object.keys(platformArchitecture).includes(platform) === false) throw new Error("OS not supported");
        const url = javaVersionsJson[useArchitecture][jsonversion][0].manifest.url
        const minecraftJavaManifest = Object.entries<IMinecraftVersionManifestFile>((await nodeFetch(url).then(res => res.json())).files)
        
        const version = `jre-${javaVersionsJson[useArchitecture][jsonversion][0].version.name}`

        let java = minecraftJavaManifest.find(file => file[0].endsWith(platform == "win32" ? "bin/javaw.exe" : "bin/java"))[0];
        let toDelete = java.replace(platform == "win32" ? "bin/javaw.exe" : "bin/java", "");

        for (let [path, info] of minecraftJavaManifest) {
            if (info.type == "directory") continue;
            if (!info.downloads) continue;  // IMinecraftVersionManifestFile
            let file: IFile = {
                path: `runtime/${version}/${path.replace(toDelete, "")}`,
                executable: info.executable,
                sha1: info.downloads.raw.sha1,
                size: info.downloads.raw.size,
                url: info.downloads.raw.url,
                type: "Java",
            };

            files.push(file);
        }
        return {
            files: files,
            path: path.resolve(this.options.path, `runtime/${version}/bin/java${process.platform == "win32" ? ".exe" : ""}`).replace(/\\/g, "/"),
        };
    }
}