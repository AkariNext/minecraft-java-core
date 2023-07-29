interface IMinecraftVersionManifest {
    files: IMinecraftVersionManifestFile[]
}

interface IMinecraftVersionManifestFile {
    executable?: boolean;
    downloads: {
        raw: {
            sha1: string;
            size: number;
            url: string;
        }
    }
    type: string;
}

