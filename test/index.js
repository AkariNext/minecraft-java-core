const {launch, Authenticator} = require('../index');
const login = require('./login');
const launcher = new launch();


let opts = {
    url: "http://uzurion.luuxis.fr/test/",
    authorization: Authenticator.getAuth(login['E-mail'], login['PassWord']),
    path: "./.Minecraft",
    version: "1.12.2",

    java: true,
    custom: false,

    verify: true,
    ignored: ["config", "logs", "runtime", "saves", "resourcepacks", "shaderpacks", "options.txt", "servers.dat"]
}

launcher.launch(opts)

launcher.on('progress', (DL, totDL) => {
    console.log(`${(DL / 1067008).toFixed(2)} Mb to ${(totDL / 1067008).toFixed(2)} Mb`);
});

launcher.on('speed', (speed) => {
    console.log(`${(speed / 1067008).toFixed(2)} Mb/s`)
})

launcher.on('data', (e) => {
    console.log(e)
})

launcher.on('close', () => {
    console.log("[CLOSE]")
})