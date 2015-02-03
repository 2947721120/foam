CLASS({
  name: 'CCView',
  extendsModel: 'foam.ui.md.AutocompleteListView',

  requires: [
    'CitationView',
    'PersonView'
  ],

  imports: [
    'PersonDAO as srcDAO'
  ],

  properties: [
    {
      name: 'queryFactory',
      defaultValue: function(data) {
        return STARTS_WITH_IC(IssuePerson.NAME, data);
      }
    },
    {
      name: 'rowView',
      defaultValue: 'CitationView'
    },
    {
      name: 'acRowView',
      defaultValue: 'PersonView'
    }
  ]
});


CLASS({
  name: 'CitationView',
  extendsModel: 'foam.ui.md.DefaultRowView',

  requires: [ 'MDMonogramStringView' ],

  properties: [ { name: 'className', defaultValue: 'CitationView' } ],

  templates: [
    function CSS() {/*
      .CitationView {
        padding: 12px 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        color: #575757;
      }

      .single .CitationView .owner-name {
        border-bottom: 1px solid rgba(0,0,0,.1);
      }

      .single .CitationView .removeRow {
        display: none;
      }
    */},
    function toInnerHTML() {/*
      <%= this.MDMonogramStringView.create({ data: this.data }) %>
      <div class="owner-name">{{ this.data }}</div>
      <span class="removeRow">$$removeRow</span>
    */}
  ]
});


CLASS({
  name: 'PersonView',
  extendsModel: 'DetailView',
  templates: [ function toHTML() {/*
    <div id="%%id" class="CitationView">
      $$name{model_: 'MDMonogramStringView'}
      <div class="owner-name">{{ this.data.name }}</div>
    </div>
  */} ]
});
