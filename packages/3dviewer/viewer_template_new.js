var i = 0;
var mod_list = [
    // [
    //     {
    //         url : 'models/models/model/model.obj',
    //         url_map : {},
    //     },
    //     {
    //         url : 'models/models/dress1/dress1.obj',
    //         url_map : {},
    //     },
    // ],
    // [
    //     {
    //         url : 'models/models/model/model.obj',
    //         url_map : {},
    //     },
    //     {
    //         url : 'models/models/dress2/dress2.obj',
    //         url_map : {},
    //     },
    // ],
    // [
    //     {
    //         url : 'models/models/model/model.obj',
    //         url_map : {},
    //     },
    //     {
    //         url : 'models/models/dress3/dress3.obj',
    //         url_map : {},
    //     },
    // ],
    // [
    //     {
    //         url : 'models/models/model/model.obj',
    //         url_map : {},
    //     },
    //     {
    //         url : 'models/models/dress4/dress4.obj',
    //         url_map : {},
    //     },
    // ],
];

Template.viewer3d.onCreated(function() {
    mod_list.push(this.data.models);
    this.viewer = new Web3DViewer();
});

Template.viewer3d.onRendered(function() {
    this.viewer.initialise(this.$('.container3d').get(0));

    this.viewer.show(mod_list[0])
});

Template.viewer3d.helpers({
    curr_id : function() {
        return i;
    }
});

Template.viewer3d.events({
    'click #next-btn' : function(event) {
        i = ++i % mod_list.length;
        Template.instance().viewer.show(mod_list[i]);
    }
});