Template.demo3d.helpers
    objects: ->
        objs = []

        for i in [2..4]
            objs.push
                imgurl: 'models/'+i+'/'+i+'.obj'

        objs.push
                imgurl: 'models/'+0+'/'+0+'.obj'

        return objs
