/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

CLASS({
  package: 'com.google.ow',
  name: 'Client',

  requires: [
    'MDAO',
    'com.google.ow.model.Envelope',
    'com.google.ow.model.ColorableProduct',
    'com.google.ow.model.ProductAd',
    'com.google.ow.ui.EnvelopeCitationView',
    'com.google.plus.ShareList',
    'com.google.plus.Person',
    'com.google.plus.Circle',
    'foam.browser.BrowserConfig',
    'foam.browser.ui.DAOController',
    'foam.dao.EasyDAO',
    'foam.dao.ProxyDAO',
    'foam.mlang.CannedQuery',
    'foam.tutorials.todo.model.Todo',
    'foam.tutorials.todo.ui.TodoCitationView',
    'foam.ui.DAOListView',
    'foam.ui.TextFieldView',
    'foam.ui.Tooltip',
    'foam.ui.md.CannedQueryCitationView',
    'foam.ui.md.CheckboxView',
    'foam.ui.md.PopupView',
    'foam.ui.md.UpdateDetailView',
    'foam.u2.DetailView',
    'com.google.ow.Server', // for fake internal server
    'com.google.ow.examples.VideoA',
    // TODO(markdittmer): Bring this back once we fully u2-ify our MD styles.
    // 'foam.u2.md.SharedStyles',
  ],
  exports: [
    'streamDAO',
    'personDAO',
    'circleDAO', // Note: proxy for currentUser.circles
    'contactsDAO', // Note: proxy for currentUser.contacts
    'currentUser',
  ],

  properties: [
    {
      name: 'browserConfig',
      lazyFactory: function() {
        var UpdateDetailView = this.UpdateDetailView;
        return this.BrowserConfig.create({
          title: 'Lifestream',
          model: this.Envelope,
          dao: this.streamDAO.where(NOT(HAS(this.Envelope.SID))),
          listView: {
            factory_: 'foam.ui.DAOListView',
            rowView: 'com.google.ow.ui.EnvelopeCitationView'
          },
          cannedQueryDAO: [
            this.CannedQuery.create({
              label: 'All',
              expression: TRUE,
            }),
          ],
          detailView: function(args, X) {
            var v = UpdateDetailView.create(args, X);
            v.title = (args.data && args.data.data) ? args.data.data.titleText
                        : this.title;
            return v;
          },
          innerDetailView: function(args, X) {
            // TODO(markdittmer): This should be more robust.
            var d = (args.data || args.data$.get()).data;
            return d && d.toDetailE ? d.toDetailE(X) :
                this.DetailView.create({ data: d }, this.Y);
          }.bind(this)
        });
      },
    },
    {
      name: 'currentUser',
      postSet: function(old, nu) {
        if (nu) {
          this.streamDAO.delegate = this.fakeInternalServer.streamDAO.where(EQ(this.Envelope.OWNER, nu.id));
          this.circleDAO.delegate = nu.circles;
          this.contactsDAO.delegate = nu.contacts;
        }
      }
    },
    {
      name: 'streamDAO',
      lazyFactory: function() {
        return this.ProxyDAO.create({ delegate: [].dao });
      }
    },
    {
      name: 'personDAO',
      lazyFactory: function() {
        return this.fakeInternalServer.personDAO;
      }
    },
    {
      name: 'circleDAO',
      type: 'com.google.plus.Circle',
      factory: function() {
        return this.ProxyDAO.create({ model: this.Circle, delegate: [].dao });
      },
    },
    {
      name: 'contactsDAO',
      type: 'com.google.plus.Person',
      factory: function() {
        return this.ProxyDAO.create({ model: this.Person, delegate: [].dao });
      },
    },
    {
      name: 'testPeople',
      lazyFactory: function() { return [].dao; }
    },
    {
      name: 'testCircles',
      lazyFactory: function() { return [].dao; }
    },
    {
      name: 'fakeInternalServer',
      lazyFactory: function() {
        var sX = GLOBAL.sub({
          exportDAO: function(dao) {
            console.log("Fake-exporting fake server dao", dao.name);
          }.bind(this)
        });

        var serv = this.Server.create({}, sX);

        this.X.setTimeout(function() {
          serv.streamDAO.put(
            this.Envelope.create({
              owner: this.currentUser.id,
              shares: this.ShareList.create({
                circles: [ this.testCircles[0].id ],
                people: [ this.testPeople[3].id, this.testPeople[5].id ],
              }),
              data: this.ProductAd.create({
                titleText: 'FOAM T-shirt',
                summaryText:
                  'Show your FOAM spirit by wearing it on your sleeve!\n' +
                  'Choose from five different colours.',
                imageUrl: 'data:image/png;base64,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',
                products: [
                  this.ColorableProduct.create({
                    id: 'FOAMTShirt',
                    name: 'FOAM T-shirt',
                    summary:
                      multiline(function() {/*Organic Men's Fitted T-Shirt
4.3 oz. Ultra fine combed ring spun 100% organic cotton
Lean fit, size up for loose fit in body
Made in the U.S.A, by American Apparel.
Machine Wash Cold*/}),
                    colorableImageUrl: 'data:image/png;base64,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',
                  }, this.Y),
                ],
              }, this.Y),
            }, this.Y)
          );
        }.bind(this), 1000);

        this.X.setTimeout(function() {
          serv.streamDAO.put(
            this.Envelope.create({
              owner: this.currentUser.id,
              shares: this.ShareList.create({}),
              data: this.ProductAd.create({
                titleText: 'Another Ad',
                summaryText:
                  'Another ad, with different text!\n' +
                  'Share me with stuff!',
                image: 'FOAMLogo',
                products: [
                  this.ColorableProduct.create({
                    id: 'FOAMTShirt',
                    name: 'FOAM T-shirt',
                    summary:
                      multiline(function() {/*Different ad text, very good.*/}),
                    colorableImage: 'FOAMTShirt',
                  }, this.Y),
                ],
              }, this.Y),
            }, this.Y)
          );
        }.bind(this), 1000);

        this.X.setTimeout(function() {
          serv.streamDAO.put(
            this.Envelope.create({
              owner: this.currentUser.id,
              shares: this.ShareList.create({ circles: [ this.testCircles[1].id ], }),
              data: this.VideoA.create(),
            }, this.Y)
          );
        }.bind(this), 2000);


        return serv;
      }
    }
  ],

  methods: [
    function init() {
      this.SUPER();
      // TODO(markdittmer): Bring this back once we fully u2-ify our MD styles.
      // this.SharedStyles.create(null, this.Y);

      this._populate_test_data_();
    },
    function _populate_test_data_() {
      var self = this;

      // create test user pool
      var personTestArray = this.testPeople;
      [
        ['Henry', 'Joe', 'Carvil'],
        ['Sammy', 'Davis', 'Junior'],
        ['Herbert', '', 'Hoover'],
        ['Jerry', '', 'Seinfeld'],
        ['Samwise', '', 'Gamgee'],
        ['Norman', 'J', 'Bates'],
        ['Doctor', '', 'Who'],
        ['Charleton', '', 'Heston'],
      ].forEach(function(name) {
        self.personDAO.put(self.Person.create({
          givenName: name[0],
          middleName: name[1],
          familyName: name[2],
        }), {
          put: function(p) { personTestArray.put(p); self.contactsDAO.put(p.id); }
        });
      });
      self.currentUser = personTestArray[0];

      // create some circles for currentUser
      [
        ['family', [0,1,2]],
        ['friends', [3,4]],
        ['neigbors', [4,5,6,7]],
      ].forEach(function(c) {
        var nu = self.Circle.create({
          //owner: self.currentUser.id,
          id: c[0],
          displayName: c[0],
        });
        c[1].forEach(function(pIdx) {
          nu.people.put(personTestArray[pIdx]);
        });
        self.currentUser.circles.put(nu, self.testCircles);
      });

      // self.streamDAO.put(
//         self.Envelope.create({ source: personTestArray[1].id, owner: self.currentUser.id, data: "Data A" })
//);
    },
  ],
});
