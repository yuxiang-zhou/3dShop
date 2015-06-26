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

Template.viewer3d.onCreated(function() {
    this.mod_list = this.data.models;
    this.viewer = new Web3DViewer();
    this.i = new ReactiveVar(0);
});

Template.viewer3d.onRendered(function() {
    this.viewer.initialise(this.$('.container3d').get(0));
    this.viewer.show(this.mod_list[0])
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
    }
});

Template.viewer3d.events({
    'click #next-btn' : function(event) {
        var self = Template.instance();

        self.i.set((self.i.get()+1) % self.mod_list.length);
        self.viewer.show(self.mod_list[self.i.get()]);
    },

    'click #prev-btn' : function(event) {
        var self = Template.instance();

        self.i.set((self.i.get()-1) % self.mod_list.length);
        self.viewer.show(self.mod_list[self.i.get()]);
    },

    'click .switcher' : function(event) {
        var self = Template.instance();

        self.i.set(this.index);
        self.viewer.show(self.mod_list[self.i.get()]);
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
    }
});