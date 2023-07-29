interface ISkin {id: string, state: "ACTIVE" | "INACTIVE", url:string, textureKey: string, variant: "SLIM" | "CLASSIC"}

interface ICustomSkin extends ISkin {base64?: string}

interface ICape {id: string, state: "ACTIVE" | "INACTIVE", url:string, alias: string}

interface ICustomCape extends ICape {base64?: string}

interface IProfile {
    id: string;
    name: string;
    skins?: ISkin[]
    capes?: ICape[]
    demo?: boolean
    profileActions?: object
}