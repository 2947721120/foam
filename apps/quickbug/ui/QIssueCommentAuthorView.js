CLASS({
  name: 'QIssueCommentAuthorView',
  extendsModel: 'foam.ui.DetailView',

  properties: [
    { name: 'model', defaultValue: IssuePerson }
  ],

  methods: {
    updateSubViews: function() {
      this.SUPER();
      if ( ! this.$ ) return;
      this.$.firstElementChild.href = this.data.htmlLink;
    }
  },

  templates: [ { name: 'toHTML', template: function() {/*
    <span id="<%= this.id %>" class="qissuecommentauthor">
      <a>$$name{ mode: 'read-only' }</a>
    </span>
  */} } ]
});
