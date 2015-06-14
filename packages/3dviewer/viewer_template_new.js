Template.viewer3d.onCreated(function() {
    this.viewer = new Web3DViewer();
});

Template.viewer3d.onRendered(function() {
    this.viewer.initialise();
});

Template.viewer3d.helpers({
    model_list : function() {

    }
});