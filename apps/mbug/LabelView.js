CLASS({
  name: 'IssueLabelView',
  extendsModel: 'foam.ui.md.AutocompleteListView',
  requires: [
    'LabelCitationView',
    'LabelView'
  ],
  imports: [
    'LabelDAO as srcDAO'
  ],
  properties: [
    {
      name: 'queryFactory',
      defaultValue: function(data) {
        return CONTAINS_IC(QIssueLabel.LABEL, data);
      }
    },
    {
      name: 'rowView',
      defaultValue: 'LabelCitationView'
    },
    {
      name: 'acRowView',
      defaultValue: 'LabelView'
    }
  ]
});


CLASS({
  name: 'LabelCitationView',
  extendsModel: 'foam.ui.md.DefaultRowView',
  traits: ['foam.ui.md.ColoredBackgroundTrait'],
  properties: [ { name: 'className', defaultValue: 'LabelCitationView' } ],
  templates: [
    function CSS() {/*
      .IssueLabel {
        align-items: center;
        border-radius: 50px;
        border: 1px solid rgba(0,0,0,.1);
        color: white;
        display: flex;
        flex-direction: row;
        font-size: 14px;
        margin-right: 12px;
        margin-top: 12px;
        padding: 10px;
        padding-left: 28px;
      }
      .IssueLabel canvas {
        background: rgba(0,0,0,0);
      }
    */},
    function toInnerHTML() {/*
      <div class="IssueLabel" <%= this.generateColorStyle(this.data.match(/[^-]+/)[0]) %>>
        <div style="flex: 1 0 auto;">{{ this.data }}</div>
        $$removeRow{width: 20, height: 20, iconUrl: 'images/ic_clear_24dp.png'}
      </div>
    */}
  ]
});


CLASS({
  name: 'LabelView',
  extendsModel: 'DetailView',
  traits: ['foam.ui.md.ColoredBackgroundTrait'],
  templates: [ function toHTML() {/*
    <div id="%%id" <%= this.generateColorStyle(this.data.label.match(/[^-]+/)[0]) %> class="IssueLabel">{{ this.data.label }}</div>
  */} ]
});
