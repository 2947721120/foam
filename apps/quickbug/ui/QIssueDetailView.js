CLASS({
  name: 'QIssueDetailView',
  extendsModel: 'DetailView',

  properties: [
    {
      name: 'model',
      factory: function() { return this.X.QIssue; }
    },
    {
      model_: 'BooleanProperty',
      name: 'saveEnabled',
      defaultValue: false
    },
    {
      model_: 'DAOProperty',
      name: 'issueDAO'
    },
    {
      model_: 'DAOProperty',
      name: 'cursorIssueDAO'
    },
    {
      name: 'url'
    },
    {
      name: 'cursorView',
      factory: function() {
        return this.X.CursorView.create({
          data: this.X.Cursor.create({dao: this.cursorIssueDAO$Proxy})}, this.Y);
      }
    },
    {
      name: 'blockingView',
      factory: function() {
        return this.X.BlockView.create({
          property: this.X.QIssue.BLOCKING,
          ids: this.data.blocking}, this.Y);
      }
    },
    {
      name: 'blockedOnView',
      factory: function() {
        return this.X.BlockView.create({
          property: this.X.QIssue.BLOCKED_ON,
          ids: this.data.blockedOn}, this.y);
      }
    },
    'newCommentView'
  ],

  listeners: [
    {
      name: 'doSave',
      code: function() {
        // Don't keep listening if we're no longer around.
        if ( ! this.$ ) throw EventService.UNSUBSCRIBE_EXCEPTION;

        if ( this.saveEnabled ) this.issueDAO.put(this.data);
      }
    }
  ],

  methods: {
    destroy: function() {
      this.SUPER();
      if ( this.data ) this.data.removeListener(this.doSave);
    },
    commentCreateView: function() {
      return this.newCommentView = this.X.QIssueCommentCreateView.create({
        dao: this.data.comments,
        issue$: this.data$,
        data: this.data.newComment()
      }, this.Y);
    },
    clView: function() {
      return this.X.QIssueCLView.create({dao: this.data.comments}, this.Y);
    },
    toHTML: function() {
      return '<div id="' + this.id + '">' + this.toInnerHTML() + '</div>';
    },
    updateSubViews: function() {
      this.SUPER();
      this.newCommentView.data = this.data.newComment();
      this.saveEnabled = true;
    },
    refresh: function() {
      var self = this;
      self.issueDAO.where(EQ(this.X.QIssue.ID, self.data.id)).listen(
        EventService.oneTime(function() {
          self.issueDAO.find(self.data.id, {
            put: function(issue) {
              self.data = issue;
              self.newCommentView.issue
            }
          });
        })
      );
    },
  },

  templates: [
    { name: 'toInnerHTML' }
  ]
});


CLASS({
  name: 'QIssueLabelsView',
  extendsModel: 'View',

  properties: [
    {
      name: 'data',
      factory: function() { return SimpleValue.create([]); },
      postSet: function() { this.update(); }
    }
  ],

  methods: {
    toHTML: function() { return '<div id="' + this.id + '"></div>'; },
    initHTML: function() { this.SUPER(); this.update(); }
  },

  listeners: [
    {
      name: 'update',
      isFramed: true,
      code: function() {
        if ( ! this.$ ) return;

        var value = this.data.sort(function (o1, o2) {
          return o1.toLowerCase().compareTo(o2.toLowerCase());
        });
        var out = "";
        for ( var i = 0; i < value.length; i++ ) {
          var start = value[i].substring(0, value[i].indexOf('-') + 1);
          var rest  = value[i].substring(value[i].indexOf('-') + 1);

          if ( start != 'Restrict-' ) {
            out += '<div><b>' +
              this.strToHTML(start) + '</b>' +
              this.strToHTML(rest) + '</div>';
          }
        }
        this.$.innerHTML = out;
      }
    }
  ]
});
