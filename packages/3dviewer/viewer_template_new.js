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
    this.i = 0;
});

Template.viewer3d.onRendered(function() {
    this.viewer.initialise(this.$('.container3d').get(0));
    this.viewer.show(this.mod_list[0])
});

Template.viewer3d.helpers({
    curr_id : function() {
        var self = Template.instance();
        
        return self.i;
    }.bind(this)
});

Template.viewer3d.events({
    'click #next-btn' : function(event) {
        var self = Template.instance();

        self.i = ++self.i % self.mod_list.length;
        self.viewer.show(self.mod_list[self.i]);
    }
});