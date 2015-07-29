/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

CLASS({
  package: 'foam.apps.builder',
  name: 'Builder',

  requires: [
    'foam.apps.builder.BrowserConfig',
    'foam.apps.builder.KioskApp',
    'foam.apps.builder.KioskAppConfig',
    'foam.apps.builder.KioskDesignerView',
    'foam.apps.builder.questionnaire.AppConfig as QuestionnaireAppConfig',
    'foam.apps.builder.questionnaire.DesignerView as QuestionnaireDesignerView',
    'foam.browser.ui.BrowserView',
    'foam.dao.EasyDAO',
    'foam.dao.IDBDAO',
    'foam.dao.SeqNoDAO',
    'foam.input.touch.GestureManager',
    'foam.input.touch.TouchManager',
    'foam.ui.DAOListView',
    'foam.ui.ImageView',
    'foam.ui.md.DetailView',
    'foam.ui.md.PopupChoiceView',
    'foam.ui.md.TextFieldView',
  ],
  exports: [
    'touchManager',
    'gestureManager',
    'menuSelection$',
    'menuDAO$',
    'kioskExportManager$',
  ],

  properties: [
    {
      model_: 'FunctionProperty',
      name: 'browserDAOFactory',
      defaultValue: function(model, name) {
        return this.EasyDAO.create({
          model: model,
          name: name,
          daoType: this.IDBDAO,
          cache: true,
          seqNo: true,
          logging: true,
        });
      }
    },
    {
      model_: 'foam.core.types.DAOProperty',
      name: 'menuDAO',
      factory: function() {
        var dao = [
          this.BrowserConfig.create({
            title: 'Kiosk Apps',
            label: 'Kiosk App',
            model: this.KioskAppConfig,
            dao: this.browserDAOFactory(this.KioskAppConfig, 'KioskAppConfigs'),
            innerDetailView: 'foam.apps.builder.KioskDesignerView'
          }),
          this.BrowserConfig.create({
            title: 'Questionnaire Apps',
            label: 'Questionnaire App',
            model: this.QuestionnaireAppConfig,
            dao:
            this.SeqNoDAO.create({ delegate:
              this.IDBDAO.create({
                model: this.QuestionnaireAppConfig,
                name: 'QuestionnaireAppConfigs',
                useSimpleSerialization: false,
              })
            }),
            detailView: { factory_: 'foam.ui.md.UpdateDetailView', liveEdit: true },
            innerDetailView: 'foam.apps.builder.questionnaire.DesignerView'
          }),
        ].dao;
        dao.model = this.BrowserConfig;
        return dao;
      }
    },
    {
      type: 'foam.apps.builder.BrowserConfig',
      name: 'menuSelection',
      view: 'foam.browser.ui.BrowserView',
      defaultValueFn: function() {
        return Array.isArray(this.menuDAO) && this.menuDAO.length > 0 ?
            this.menuDAO[0] : '';
      },
    },
    {
      type: 'foam.apps.builder.KioskExportManager',
      name: 'kioskExportManager'
    },
    {
      type: 'foam.input.touch.TouchManager',
      name: 'touchManager',
      lazyFactory: function() { return this.TouchManager.create(); },
    },
    {
      type: 'foam.input.touch.GestureManager',
      name: 'gestureManager',
      lazyFactory: function() { return this.GestureManager.create(); },
    },
  ],
});