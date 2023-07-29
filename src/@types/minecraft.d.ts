type TLibrary = ({
    sha1: string
    size: number
    path: string
    type: 'Native' | 'Libraries',
    url: string
} | {
    path: string
    type: 'CFILE'
    content: string
})

interface IMinecraftVersionManifest {
    files: IMinecraftVersionManifestFile[]
}

interface IFile {
    path: string;
    executable: boolean;
    sha1: string;
    size: number;
    url: string;
    type: string;
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

interface IVersionManifestData {
    id: string
    type: 'release' | 'snapshot'
    url: string
    time: string
    releaseTime: string
    sha1: string
    complianceLevel: number
}

interface IVersionManifest {
    latest: {
        release: string
        snapshot: string
    }
    versions: IVersionManifestData[]
}

interface ILibrarieFile {
    path: string
    sha1: string
    size: number
    url: string
}

interface IAssetIndex {
    id: string
    sha1: string
    size: number
    totalSize: number
    url: string
}

interface IVersionData {
    id: string
    name?: string
    type?: string
    arguments: {
        game: string[]
        jvm: string[]
    }
    client?: {
        argument: string
        file: ILibrarieFile
    }
    assetIndex: IAssetIndex
    assets: string
    complianceLevel: number
    downloads: {
        [key: string]: {
            sha1: string
            size: number
            url: string
        }
    }
    javaVersion: {
        component: string, majorVersion: number
    }
    libraries: {
        natives?: {
            linux: string
            osx: string
            windows: string
        }
        downloads?: {
            artifact?: ILibrarieFile
            classifiers?: {
                [key: string]: ILibrarieFile
            }
        },
        extract?: {
            exclude: string[]
        }
        name: string
        rules?: {action: string, os?: {name: string}}[]
    }[]
}

interface IversionAndNativesListData extends  IVersionData {
    nativesList: boolean
}