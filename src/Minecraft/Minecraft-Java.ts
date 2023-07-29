/**
 * @author Luuxis
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0/
 */

import os from 'os';
import nodeFetch from 'node-fetch';
import path from 'path';

interface IFile {
    path: string;
    executable: boolean;
    sha1: string;
    size: number;
    url: string;
    type: string;
}

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
        let version: string;
        let files: IFile[] = [];
        let javaVersionsJson: IJavaVersionJson = await nodeFetch("https://launchermeta.mojang.com/v1/products/java-runtime/2ec0cc96c44e5a76b9c8b7c39df7210883d12871/all.json").then(res => res.json())
        let minecraftJavaManifest: [string, IMinecraftVersionManifestFile][]  // indexの0にあたる場所にはファイルの形式が入ってる        

        const platformArchitecture = {
            win32: { x64: "windows-x64", ia32: "windows-x86" },
            darwin: { x64: "mac-os", arm64: "mac-os-arm64" },
            linux: { x64: "linux", ia32: "linux-i386" }
        }
        jsonversion = jsonversion.javaVersion ? 'jre-legacy' : jsonversion.javaVersion.component
        const platform = os.platform();
        const useArchitecture = platformArchitecture[platform];
        if (Object.keys(platformArchitecture).includes(platform) === false) return console.log("OS not supported");

        let url = javaVersionsJson[useArchitecture][jsonversion][0].manifest.url
        minecraftJavaManifest = Object.entries<IMinecraftVersionManifestFile>((await nodeFetch(url).then(res => res.json())).files)

        let java = minecraftJavaManifest.find(file => file[0].endsWith(process.platform == "win32" ? "bin/javaw.exe" : "bin/java"))[0];
        let toDelete = java.replace(process.platform == "win32" ? "bin/javaw.exe" : "bin/java", "");

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