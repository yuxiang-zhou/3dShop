Template.demo3d.helpers
    objects: ->
        objs = []

        objs.push
            mdlArr : JSON.stringify(['models/models/model/model.obj', 'models/models/dress1/dress1.obj'])

        objs.push
            mdlArr: JSON.stringify(['models/models/model/model.obj', 'models/models/dress2/dress2.obj'])

        return objs
