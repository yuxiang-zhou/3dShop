Package.describe({
    summary: "3D Object Viewer Plugin",
    name: "3dshop:3d-viewer",
    version: "0.0.0"
});

Package.onUse(function (api) {
    // api.versionsFrom('0.9.0');

    //core meteor packages
    api.use("coffeescript");
    api.use("jquery");

    api.use("templating", "client");

    api.addFiles("client/compatibility/lib/three.min.js", 'client')
    api.addFiles([
        
        "client/compatibility/first_person_control.js",

        "client/DDSLoader.js",
        "client/MTLLoader.js",
        "client/OBJLoader.js",
        "client/OBJMTLLoader.js",
        "client/web3dviewer.js",

        "viewer_template.css",
        "viewer_template_new.html",
        "viewer_template_new.js",
        //"viewer_template.html",
        //"viewer_template.coffee"
    ], ['client']);

    api.export(['THREE'], 'client');
    api.export(['Web3DViewer'], 'client');
});