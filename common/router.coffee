###
# General Route Declarations
###
Router.map ->
  # default index route, normally overriden parent meteor app
  @route "index-test",
    path:'/test'
    layoutTemplate: "complexLayout"
    template: "index"
    yieldTemplates:
        "hello":
            to: 'menu'