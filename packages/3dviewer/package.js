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
    //core meteor packages
    // api.use("meteor-platform");
    // api.use("oauth-encryption");
    // api.use("accounts-base");
    // api.use("accounts-password");
    // api.use("accounts-ui-unstyled");
    // api.use("less");
    // api.use("http");
    // api.use("coffeescript");
    // api.use("underscore");
    // api.use("blaze");
    // api.use("jquery");
    // api.use("email");
    // api.use("check");
    // api.use("browser-policy");
    // api.use("amplify@1.0.0");
    // api.use("reactive-var");

    api.use("templating", "client");

    api.addFiles("client/compatibility/lib/three.min.js", 'client')
    api.addFiles([
        
        "client/compatibility/first_person_control.js",

        "client/DDSLoader.js",
        "client/MTLLoader.js",
        "client/OBJLoader.js",
        "client/OBJMTLLoader.js",

        "viewer_template.css",
        "viewer_template.html",
        "viewer_template.coffee"
    ], ['client']);

    api.export(['THREE'], 'client');
});