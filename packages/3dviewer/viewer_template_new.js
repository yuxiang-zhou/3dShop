Template.viewer3d.onCreated(function() {
    this.viewer = new Web3DViewer();
});

Template.viewer3d.onRendered(function() {
    this.viewer.initialise(this.$('.container3d').get(0));

    this.viewer.show(mod_list()[0])
});

Template.viewer3d.helpers({
    model_list : function() {

    }
});

function mod_list() {
    return [
    [
        {
            url : 'models/models/model/model.obj',
            url_map : {},
        },
        {
            url : 'models/models/dress1/dress1.obj',
            url_map : {},
        },
    ],
    [
        {
            url : 'models/models/model/model.obj',
            url_map : {},
        },
        {
            url : 'models/models/dress2/dress2.obj',
            url_map : {},
        },
    ],
    ];
}