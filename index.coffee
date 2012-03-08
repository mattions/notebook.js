doctype 5
html ->
  head ->
    title 'notebook.js demo'
    script src: "/lib/jquery-1.7.1.js" 
    script src: "/lib/underscore.js" 
    script src: "/lib/backbone.js" 
    script src: "/lib/backbone.localStorage.js"
    script src: "/lib/showdown.js"
    script src: "/lib/ace/ace.js"
    script src: "/lib/ace/mode-javascript.js"
    script src: "/src/engine.js" 
    script src: "/src/notebook.js" 
    script src: "/src/views.js" 
    script src: "/src/ace-events.js"

    link rel: 'stylesheet', href: '/css/base.css'
    link rel: 'stylesheet', href: '/css/skeleton.css'
    link rel: 'stylesheet', href: '/css/layout.css'
    link rel: 'stylesheet', href: '/css/notebook.css'

  body ->
    
    div '.container', ->
      div '#notebook', ->
        div '#navbar', ->
          div '#logo', -> 'notebook.js'
          div '#title', -> ''
        ul id: "cells" 
        button '#spawner .full-width', -> 'Insert cell'


    script type: "text/template", id: "cell-template", ->
      div '.cell', id: "[[= id ]]", ->
        div '.type', -> '[[= type ]]'
        button '.full-width .spawn-above', tabindex: '[[= position ]]a', -> 'Insert cell'
        div '.controls', ->
          button '.full-width .evaluate', -> 'evaluate'
          button '.full-width .delete', -> 'delete'
          button '.full-width .toggle', -> 'toggle'
        # we can control the container size, but not the editor
        div '.ace-container', ->
          div class: "cell-input", style: "top:0;bottom:0;left:0;right:0;", id: "input-[[= id ]]", ->
            '[[= input ]]'
        div '.cell-output', tabindex: "[[= position ]]c", ->
          '[[= output ]]'


