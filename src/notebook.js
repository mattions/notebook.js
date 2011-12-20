(function() {
  var Cell, Cells, Notebook, Notebooks, root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  Notebook = (function(_super) {

    __extends(Notebook, _super);

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

  })(Backbone.Model);

  Notebooks = (function(_super) {

    __extends(Notebooks, _super);

    function Notebooks() {
      Notebooks.__super__.constructor.apply(this, arguments);
    }

    Notebooks.prototype.model = Notebook;

    Notebooks.prototype.localStorage = new Store('Notebooks');

    return Notebooks;

  })(Backbone.Collection);

  Cell = (function(_super) {

    __extends(Cell, _super);

    function Cell() {
      this.evaluateSuccess = __bind(this.evaluateSuccess, this);
      this.evaluate = __bind(this.evaluate, this);
      this.toggleType = __bind(this.toggleType, this);
      this.defaults = __bind(this.defaults, this);
      Cell.__super__.constructor.apply(this, arguments);
    }

    Cell.prototype.tagName = 'li';

    Cell.prototype.defaults = function() {
      return {
        input: "something",
        type: "javascript",
        output: null,
        position: null
      };
    };

    Cell.prototype.toggleType = function() {
      if (this.get('type') === 'javascript') {
        return this.set({
          type: 'markdown'
        });
      } else {
        return this.set({
          type: 'javascript'
        });
      }
    };

    Cell.prototype.evaluate = function() {
      var handler;
      handler = root.engines[this.get('type')];
      return handler.evaluate(this.get('input'), this.evaluateSuccess);
    };

    Cell.prototype.evaluateSuccess = function(output) {
      this.set({
        output: output
      });
      return this.save();
    };

    return Cell;

  })(Backbone.Model);

  Cells = (function(_super) {

    __extends(Cells, _super);

    function Cells() {
      this.comparator = __bind(this.comparator, this);
      Cells.__super__.constructor.apply(this, arguments);
    }

    Cells.prototype.model = Cell;

    Cells.prototype.posJump = Math.pow(2, 16);

    Cells.prototype.comparator = function(cell) {
      return cell.get('position');
    };

    Cells.prototype.createAtEnd = function() {
      var pos;
      if (this.length) {
        pos = this.at(this.length - 1).get('position') + this.posJump;
      } else {
        pos = this.posJump;
      }
      return this.create({
        position: pos
      });
    };

    Cells.prototype.createBefore = function(cell) {
      var cellIndex, cellPos, prevPos;
      cellIndex = this.indexOf(cell);
      cellPos = cell.get('position');
      if (cellIndex === 0) {
        prevPos = 0;
      } else {
        prevPos = this.at(cellIndex - 1).get('position');
      }
      return this.create({
        position: (cellPos + prevPos) / 2
      });
    };

    return Cells;

  })(Backbone.Collection);

  root.Notebook = Notebook;

  root.Cell = Cell;

  root.Notebooks = Notebooks;

  root.Cells = Cells;

}).call(this);