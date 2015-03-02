CLASS({
  name: 'QIssueCommentView',
  extendsModel: 'foam.ui.DetailView',

  properties: [
    { name: 'model', factory: function() { return this.X.QIssueComment; } }
  ],

  methods: {
    updateSubViews: function() {
      this.SUPER();
      if ( this.$ && this.data === 0 ) {
        this.$.style.borderTop = 'none';
      }
    }
  },

  templates: [ { name: 'toHTML' } ]
});
