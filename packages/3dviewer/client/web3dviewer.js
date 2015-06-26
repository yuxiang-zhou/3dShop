// Web3DViewer.js
// Encapsulate all logic on the Web3DViewer module.

Web3DViewer = function () {
    // declare all the class members
    this.state = {
        camera_move_fwd   : false,
        camera_move_bwd   : false,
        camera_zoom_speed : 500,

    };

    this.three = {
        renderer     : null,
        scene        : null,
        camera       : null,
        amb_light    : null,
        dir_light    : null,
        clock        : null,
        object_root  : null,
    };

    this.dom_container = null;
    this.url_obj_map = {};   // url -> {obj, info} map
};

Web3DViewer.prototype.constructor = Web3DViewer;

Web3DViewer.prototype.initialise = function(dom_container, overrides) {
    overrides = overrides || {};    // default value

    var width  = dom_container.clientWidth;
    var height = Math.max(dom_container.clientHeight, 300);

    var container = this.dom_container = dom_container;

    var renderer = this.three.renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    var scene = this.three.scene = new THREE.Scene();

    var camera = this.three.camera = new THREE.PerspectiveCamera(60, width / height, 1, 20000);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var amb_light = this.three.amb_light = new THREE.AmbientLight(0x777777);
    var dir_light = this.three.dir_light = new THREE.DirectionalLight(0xffeedd);

    var clock = this.three.clock = new THREE.Clock();

    var object = this.three.object_root = new THREE.Object3D();

    scene.add(amb_light);
    scene.add(dir_light);

    container.appendChild(renderer.domElement);

};

// obj_info = { url : string, url_map : dict, translation : {.x, .y, .z} }
Web3DViewer.prototype._load = function(obj_info_list, on_complete) {
    for (var i = 0, len = obj_info_list.length; i < len; ++i) {

        var obj_info = obj_info_list[i];
        var loader = new THREE.OBJMTLLoader(undefined, obj_info.url_map);

        var load_cnt = 0, load_total = len;

        var self = this;

        loader.load(obj_info.url, function(obj_info, object) {
                console.log("Finish loading " + obj_info.url);

                // translation
                var translation = obj_info['translation']
                if (translation) {
                    object.translateX(translation.x || 0);
                    object.translateY(translation.y || 0);
                    object.translateZ(translation.z || 0);
                }

                // add to url_obj_map
                self.url_obj_map[obj_info.url] = { "obj" : object, "info" : obj_info };

                //------------
                // wait for all to be loaded
                ++load_cnt;
                if (load_cnt === load_total && on_complete) {
                    on_complete();
                }

            }.bind(this, obj_info), this._loader_onProgress, this._loader_onError);
    }
};

Web3DViewer.prototype._process_object = function(object, obj_info) {

    var self = this;
    // translation
    var translation = obj_info['translation']
    if (translation) {
        object.translateX(translation.x || 0);
        object.translateY(translation.y || 0);
        object.translateZ(translation.z || 0);
    }

    console.log(self);

    // add to url_obj_map
    this.url_obj_map[obj_info.url] =  { "obj" : object, "info" : obj_info };
};

Web3DViewer.prototype._loader_onProgress = function(xhr) {
    var percentComplete = xhr.loaded / xhr.total * 100;
    console.log(Math.round(percentComplete, 2) + '% downloaded');
};

Web3DViewer.prototype._loader_onError = function(xhr) {
    console.log("Error loading 3D Models");
};

Web3DViewer.prototype._render = function() {
    if (this.three.object_root) {
        requestAnimationFrame(this._render.bind(this));

        //----------------//
        // animation loop //
        //----------------//

        var delta = this.three.clock.getDelta();

        // rotate all objects
        this.three.object_root.rotation.y += delta;

        if (this.state.camera_move_fwd) {
            this.three.camera.position.z -= this.state.camera_zoom_speed * delta;
        }

        if (this.state.camera_move_bwd) {
            this.three.camera.position.z += this.state.camera_zoom_speed * delta;
        }

        this.three.renderer.render(this.three.scene, this.three.camera);
    }
}

Web3DViewer.prototype.show = function(obj_info_list) {

    // remove old object_root
    this.three.scene.remove(this.three.object_root);
    this.three.object_root = null;

    // figure out which object has been loaded,
    // and generate a list of new objects to load
    var obj_to_load_arr = [];
    for (var i = 0, len = obj_info_list.length; i < len; ++i) {
        var obj_info = obj_info_list[i];

        if (!this.url_obj_map[obj_info.url]) {
            // this object is not in the map.
            obj_to_load_arr.push(obj_info);
        }
    }

    // construct a callback function to show all elements
    var self = this;
    function show_all() {
        // create new object_root
        var object_root = self.three.object_root = new THREE.Object3D();

        // add all objects to object_root
        for (var i = 0, len = obj_info_list.length; i < len; ++i) {
            var obj_info = obj_info_list[i];
            var obj = self.url_obj_map[obj_info.url];

            if (!obj) {
                throw "Empty object encountered while all objects should have been loaded";
            }

            object_root.add(obj.obj);
        }

        // add the object_root back to the scene
        self.three.scene.add(object_root);

        // adjust the camera based on the object_root
        var box = new THREE.Box3().setFromObject(object_root);
        var box_size = box.size();
        var box_cntr = box.center();
        var camera = self.three.camera;
        camera.position.x = box_cntr.x;
        camera.position.y = box_cntr.y;
        camera.position.z = 1 + Math.max(box_size.x, box_size.y, box_size.z);

        // start render
        self._render();
    };

    if (obj_to_load_arr.length === 0) {
        show_all();
    } else {
        this._load(obj_to_load_arr, show_all);
    }

};
