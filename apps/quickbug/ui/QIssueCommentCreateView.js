CLASS({
  name: 'QIssueCommentCreateView',
  extendsModel: 'foam.ui.DetailView',

  imports: [
    'browser'
  ],

  requires: [
    'ActionButton',
    'PropertyView',
    'QIssueComment',
    'QIssueCommentUpdate',
    'QIssueCommentUpdateDetailView',
    'TextFieldView'
  ],

  properties: [
    { name: 'model', factory: function() { return this.QIssueComment; } },
    { model_: 'BooleanPropety', name: 'saving', defaultValue: false },
    { name: 'issue' },
    { name: 'errorView', factory: function() { return this.TextFieldView.create({ mode: 'read-only' }); } },
    { name: 'dao' }
  ],

  methods: {
    makeUpdatesView: function() {
      return this.PropertyView.create({
        innerView: 'QIssueCommentUpdateDetailView',
        prop: this.QIssueComment.UPDATES
      });
      return view;
    }
  },

  templates: [
    { name: 'toHTML' }
  ],

  actions: [
    {
      name: 'save',
      label: 'Save changes',
      isEnabled: function() { return ! this.saving; },
      action: function() {
        var defaultComment = this.issue.newComment();

        var diff = defaultComment.updates.diff(this.data.updates);
        function convertArray(key) {
          if ( ! diff[key] ) {
            diff[key] = [];
            return;
          }

          var delta = diff[key].added;
          for ( var i = 0; i < diff[key].removed.length; i++ )
            delta.push("-" + diff[key].removed[i]);
          diff[key] = delta;
        }

        convertArray('labels');
        convertArray('blockedOn');
        convertArray('cc');

        var comment = this.data.clone();
        comment.updates = this.QIssueCommentUpdate.create(diff);

        // TODO: UI feedback while saving.

        var self = this;
        this.errorView.data = "";
        this.saving = true;
        this.dao.put(comment, {
          put: function(o) {
            self.saving = false;
            self.parent.refresh();
          },
          error: function() {
            self.saving = false;
            self.errorView.data = "Error saving comment.  Try again later.";
          }
        });
      }
    },
    {
      name: 'discard',
      isEnabled: function() { return ! this.saving; },
      action: function() { this.browser.location.id = ''; }
    }
  ]
});
