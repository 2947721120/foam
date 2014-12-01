export BUILD_DIR=~/Downloads/mbug
rm -rf $BUILD_DIR
cp -r . $BUILD_DIR
cp ../../core/foam.css $BUILD_DIR
cp ../../lib/mdui/style.css $BUILD_DIR/mdui.css
cat \
  ../../core/stdlib.js \
  ../../core/WeakMap.js \
  ../../core/io.js \
  ../../core/writer.js \
  ../../core/socket.js \
  ../../core/base64.js \
  ../../core/utf8.js \
  ../../core/parse.js \
  ../../core/event.js \
  ../../core/JSONUtil.js \
  ../../core/XMLUtil.js \
  ../../core/context.js \
  ../../core/FOAM.js \
  ../../core/JSONParser.js \
  ../../core/TemplateUtil.js \
  ../../core/async.js \
  ../../core/oam.js \
  ../../core/FObject.js \
  ../../core/BootstrapModel.js \
  ../../core/mm1Model.js \
  ../../core/mm2Property.js \
  ../../core/mm3Types.js \
  ../../core/mm4Method.js \
  ../../core/mm5Misc.js \
  ../../core/value.js \
  ../../core/view.js \
  ../../core/layout.js \
  ../../core/StackView.js \
  ../../core/daoView.js \
  ../../core/ChoiceView.js \
  ../../core/DetailView.js \
  ../../core/TableView.js \
  ../../core/cview.js \
  ../../core/cview2.js \
  ../../core/MementoMgr.js \
  ../../core/listchoiceview.js \
  ../../core/scroll.js \
  ../../core/mlang.js \
  ../../core/glang.js \
  ../../core/QueryParser.js \
  ../../core/search.js \
  ../../core/visitor.js \
  ../../core/dao.js \
  ../../core/ChromeStorage.js \
  ../../core/arrayDAO.js \
  ../../core/diff.js \
  ../../core/SplitDAO.js \
  ../../core/index.js \
  ../../core/DAOController.js \
  ../../core/ThreePaneController.js \
  ../../core/experimental/protobufparser.js \
  ../../core/experimental/protobuf.js \
  ../../core/models.js \
  ../../core/oauth.js \
  ../../core/touch.js \
  ../../core/ChromeApp.js \
  ../../core/SyncManager.js \
  ../../lib/bookmarks/bookmark.js \
  ../../lib/mdui/AppController.js \
  ../../lib/mdui/view.js \
  ../../lib/mdui/AutocompleteListView.js \
  ../../lib/mdui/DetailView.js \
  ../../core/CORE.js \
  ../quickcompose/google-analytics-bundle.js \
  > "$BUILD_DIR/foam.js"

mkdir -p "$BUILD_DIR/quickbug"
cp -r ../quickbug/* "$BUILD_DIR/quickbug/"

# For code compression, uncomment the following line:
# ~/node_modules/uglify-js/bin/uglifyjs --overwrite "$BUILD_DIR/foam.js"

#  ../../core/ChromeStorage.js \
#  ../../demos/benchmark_data.json \
#  ../../demos/photo.js \
