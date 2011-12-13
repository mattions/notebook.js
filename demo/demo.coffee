# use [[]] for underscore templates (i.e. client side templating)
_.templateSettings = {interpolate : /\[\[=(.+?)\]\]/g, evaluate: /\[\[(.+?)\]\]/g}


class Notebook extends Backbone.Model
    defaults: => (title: "untitled")
    
    initialize: =>
        @cells = new Cells()
        @cells.localStorage = new Store('Cells')


class Notebooks extends Backbone.Collection
    localStorage: new Store("Notebooks") 
    model: Notebook


class NotebookView extends Backbone.View
    el: "#notebook"
  
    events: => ( 
        "click #spawner": 'spawnCell'
    )

    initialize: =>
        @title = @$('#title')
        @cells = @$('#cells')
        @render()
        
        @model.cells.bind 'add', @addOne
        @model.cells.bind 'refresh', @addAll
        
        @model.cells.fetch(success: @addAll)

    render: =>
        console.log 'rendering notebook' + @model.get('title')
        @title.html(@model.get("title"))
        
    addOne: (cell) =>
        console.log('adding cell', cell)
        view = new CellView(model: cell)
        newEl = view.render()
        $(newEl).appendTo(@cells)

    addAll: (cells) => 
        cells.each @addOne

    spawnCell: => 
        console.log 'spawning cell'
        @model.cells.create()


class Cell extends Backbone.Model
    tagName: 'li'
    defaults: => (input: "something", type: "javascript", output: null)

    evaluate: =>
        # should we save the model at this point?
        # how to look up handler?
        handler = new JavascriptEval()
        handler.evaluate @get('input'), @evaluateSuccess

    evaluateSuccess: (output) => 
        @set(output: output)
        @save()

class JavascriptEval
    evaluate: (input, onSuccess) -> 
        output = eval(input)
        console.log 'eval produced', input,  output
        onSuccess output
    


class CellView extends Backbone.View

    events: => (
        "click #evaluate":  "evaluate",
        "click #delete": "destroy"
    )

    initialize: => 
        @template =  _.template($('#cell-template').html())
        @model.bind 'all', @render
        @model.bind 'destroy', @remove

    render: =>
        console.log('render cell', @model.toJSON())
        $(@el).html(@template(@model.toJSON()))
        @input = @$('.cell-input') 
        @el

    evaluate: =>
        console.log 'in cellview evaluate handler'
        @model.set(input: @input.val()) 
        @model.evaluate()

    destroy: =>
        console.log 'in cellview destroy handler'
        @model.destroy()

    remove: => 
        $(@el).fadeOut('fast', $(@el).remove)

class Cells extends Backbone.Collection
    model: Cell


$(document).ready ->
    console.log 'creating app'
    notebooks = new Notebooks()
    notebook = notebooks.create()
    app = new NotebookView(model: notebook)
    window.ev = new JavascriptEval()

    window.n = notebook
    window.C = Cell
    window.N = Notebook
