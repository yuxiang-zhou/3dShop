// var i = 0;
// var mod_list = [
//     // [
//     //     {
//     //         url : 'models/models/model/model.obj',
//     //         url_map : {},
//     //     },
//     //     {
//     //         url : 'models/models/dress1/dress1.obj',
//     //         url_map : {},
//     //     },
//     // ],
//     // [
//     //     {
//     //         url : 'models/models/model/model.obj',
//     //         url_map : {},
//     //     },
//     //     {
//     //         url : 'models/models/dress2/dress2.obj',
//     //         url_map : {},
//     //     },
//     // ],
//     // [
//     //     {
//     //         url : 'models/models/model/model.obj',
//     //         url_map : {},
//     //     },
//     //     {
//     //         url : 'models/models/dress3/dress3.obj',
//     //         url_map : {},
//     //     },
//     // ],
//     // [
//     //     {
//     //         url : 'models/models/model/model.obj',
//     //         url_map : {},
//     //     },
//     //     {
//     //         url : 'models/models/dress4/dress4.obj',
//     //         url_map : {},
//     //     },
//     // ],
// ];

function show_objs(self, objs) {
    var loading = self.$('.loading-container');
    loading.show();

    self.viewer.show(objs);

    self.viewer._loader_onComplete = function(xhr){
        loading.hide();
    };
}

Template.viewer3d.onCreated(function() {
    this.mod_list = this.data.models;
    this.viewer = new Web3DViewer();
    this.i = new ReactiveVar(0);
});

Template.viewer3d.onRendered(function() {
    this.viewer.initialise(self.$('.container3d').get(0));
    show_objs(this, this.mod_list[0]);
});

Template.viewer3d.helpers({
    curr_id: function() {
        var self = Template.instance();

        return self.i.get()+1;
    },

    is_many: function(){
        var self = Template.instance();

        return self.mod_list.length > 1;
    },

    nModels: function(){
        var self = Template.instance();

        return self.mod_list.length;
    },

    buttons: function(){
        var self = Template.instance();
        var retval = [];

        for (var i = 0; i < self.mod_list.length; i++) {
            retval.push({
                index: i
            });
        };

        return retval;
    },

    active_model: function(){
        var self = Template.instance();

        return this.index == self.i.get() ? 'btn-primary' : 'btn-default';
    },

    support_webgl: function(){
        return window.WebGLRenderingContext;
    },

    debug: function(){return false;},

    preview: function(){
        var self = Template.instance();
        var objs = self.mod_list[this.index];
        var preview = "";

        for(var i in objs){
            var obj = objs[i];

            if(obj.preview) preview = obj.preview;
        }

        return preview;
    },
});

Template.viewer3d.events({
    'click #next-btn' : function(event) {
        var self = Template.instance();

        self.i.set((self.i.get()+1) % self.mod_list.length);
        show_objs(self, self.mod_list[self.i.get()]);
    },

    'click #prev-btn' : function(event) {
        var self = Template.instance();

        self.i.set((self.i.get()-1) % self.mod_list.length);
        show_objs(self, self.mod_list[self.i.get()]);
    },

    'click .switcher' : function(event) {
        var self = Template.instance();

        self.i.set(this.index);
        show_objs(self, self.mod_list[self.i.get()]);
    },

    'mousedown #btn-zoom-in' : function(event) {
        var self = Template.instance();

        self.viewer.state.camera_move_fwd = true;
    },

    'mouseup #btn-zoom-in' : function(event) {
        var self = Template.instance();

        self.viewer.state.camera_move_fwd = false;
    },

    'mousedown #btn-zoom-out' : function(event) {
        var self = Template.instance();

        self.viewer.state.camera_move_bwd = true;
    },

    'mouseup #btn-zoom-out' : function(event) {
        var self = Template.instance();
        
        self.viewer.state.camera_move_bwd = false;
    },

    'click #btn-up' : function(event) {
        var self = Template.instance();

        var kids = self.viewer.three.object_root.children;
        kids[kids.length - 1].position.y += 10;
        console.log(kids[kids.length - 1].position);
    },

    'click #btn-down' : function(event) {
        var self = Template.instance();
        
        var kids = self.viewer.three.object_root.children;
        kids[kids.length - 1].position.y -= 10;
        console.log(kids[kids.length - 1].position);
    },


});