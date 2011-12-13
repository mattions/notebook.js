(function() {
  var Cell, CellView, Cells, JavascriptEval, Notebook, NotebookView, Notebooks;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  _.templateSettings = {
    interpolate: /\[\[=(.+?)\]\]/g,
    evaluate: /\[\[(.+?)\]\]/g
  };
  Notebook = (function() {
    __extends(Notebook, Backbone.Model);
    function Notebook() {
      this.initialize = __bind(this.initialize, this);
      this.defaults = __bind(this.defaults, this);
      Notebook.__super__.constructor.apply(this, arguments);
    }
    Notebook.prototype.defaults = function() {
      return {
        title: "untitled"
      };
    };
    Notebook.prototype.initialize = function() {
      this.cells = new Cells();
      return this.cells.localStorage = new Store('Cells');
    };
    return Notebook;
  })();
  Notebooks = (function() {
    __extends(Notebooks, Backbone.Collection);
    function Notebooks() {
      Notebooks.__super__.constructor.apply(this, arguments);
    }
    Notebooks.prototype.localStorage = new Store("Notebooks");
    Notebooks.prototype.model = Notebook;
    return Notebooks;
  })();
  NotebookView = (function() {
    __extends(NotebookView, Backbone.View);
    function NotebookView() {
      this.spawnCell = __bind(this.spawnCell, this);
      this.addAll = __bind(this.addAll, this);
      this.addOne = __bind(this.addOne, this);
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      this.events = __bind(this.events, this);
      NotebookView.__super__.constructor.apply(this, arguments);
    }
    NotebookView.prototype.el = "#notebook";
    NotebookView.prototype.events = function() {
      return {
        "click #spawner": 'spawnCell'
      };
    };
    NotebookView.prototype.initialize = function() {
      this.title = this.$('#title');
      this.cells = this.$('#cells');
      this.render();
      this.model.cells.bind('add', this.addOne);
      this.model.cells.bind('refresh', this.addAll);
      return this.model.cells.fetch({
        success: this.addAll
      });
    };
    NotebookView.prototype.render = function() {
      console.log('rendering notebook' + this.model.get('title'));
      return this.title.html(this.model.get("title"));
    };
    NotebookView.prototype.addOne = function(cell) {
      var newEl, view;
      console.log('adding cell', cell);
      view = new CellView({
        model: cell
      });
      newEl = view.render();
      return $(newEl).appendTo(this.cells);
    };
    NotebookView.prototype.addAll = function(cells) {
      return cells.each(this.addOne);
    };
    NotebookView.prototype.spawnCell = function() {
      console.log('spawning cell');
      return this.model.cells.create();
    };
    return NotebookView;
  })();
  Cell = (function() {
    __extends(Cell, Backbone.Model);
    function Cell() {
      this.evaluateSuccess = __bind(this.evaluateSuccess, this);
      this.evaluate = __bind(this.evaluate, this);
      this.defaults = __bind(this.defaults, this);
      Cell.__super__.constructor.apply(this, arguments);
    }
    Cell.prototype.tagName = 'li';
    Cell.prototype.defaults = function() {
      return {
        input: "something",
        type: "javascript",
        output: null
      };
    };
    Cell.prototype.evaluate = function() {
      var handler;
      handler = new JavascriptEval();
      return handler.evaluate(this.get('input'), this.evaluateSuccess);
    };
    Cell.prototype.evaluateSuccess = function(output) {
      this.set({
        output: output
      });
      return this.save();
    };
    return Cell;
  })();
  JavascriptEval = (function() {
    function JavascriptEval() {}
    JavascriptEval.prototype.evaluate = function(input, onSuccess) {
      var output;
      output = eval(input);
      console.log('eval produced', input, output);
      return onSuccess(output);
    };
    return JavascriptEval;
  })();
  CellView = (function() {
    __extends(CellView, Backbone.View);
    function CellView() {
      this.remove = __bind(this.remove, this);
      this.destroy = __bind(this.destroy, this);
      this.evaluate = __bind(this.evaluate, this);
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      this.events = __bind(this.events, this);
      CellView.__super__.constructor.apply(this, arguments);
    }
    CellView.prototype.events = function() {
      return {
        "click #evaluate": "evaluate",
        "click #delete": "destroy"
      };
    };
    CellView.prototype.initialize = function() {
      this.template = _.template($('#cell-template').html());
      this.model.bind('all', this.render);
      return this.model.bind('destroy', this.remove);
    };
    CellView.prototype.render = function() {
      console.log('render cell', this.model.toJSON());
      $(this.el).html(this.template(this.model.toJSON()));
      this.input = this.$('.cell-input');
      return this.el;
    };
    CellView.prototype.evaluate = function() {
      console.log('in cellview evaluate handler');
      this.model.set({
        input: this.input.val()
      });
      return this.model.evaluate();
    };
    CellView.prototype.destroy = function() {
      console.log('in cellview destroy handler');
      return this.model.destroy();
    };
    CellView.prototype.remove = function() {
      return $(this.el).fadeOut('fast', $(this.el).remove);
    };
    return CellView;
  })();
  Cells = (function() {
    __extends(Cells, Backbone.Collection);
    function Cells() {
      Cells.__super__.constructor.apply(this, arguments);
    }
    Cells.prototype.model = Cell;
    return Cells;
  })();
  $(document).ready(function() {
    var app, notebook, notebooks;
    console.log('creating app');
    notebooks = new Notebooks();
    notebook = notebooks.create();
    app = new NotebookView({
      model: notebook
    });
    window.ev = new JavascriptEval();
    window.n = notebook;
    window.C = Cell;
    return window.N = Notebook;
  });
}).call(this);
