(function () {
var code = (function () {
  'use strict';

  var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

  var global$1 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

  var getMinWidth = function (editor) {
    return editor.getParam('code_dialog_width', 600);
  };
  var getMinHeight = function (editor) {
    return editor.getParam('code_dialog_height', Math.min(global$1.DOM.getViewPort().h - 200, 500));
  };
  var $_dajzwh9ojhbq23pz = {
    getMinWidth: getMinWidth,
    getMinHeight: getMinHeight
  };

  var setContent = function (editor, html) {
    editor.focus();
    editor.undoManager.transact(function () {
      editor.setContent(html);
    });
    editor.selection.setCursorLocation();
    editor.nodeChanged();
  };
  var getContent = function (editor) {
    return editor.getContent({ source_view: true });
  };
  var $_as7fx09qjhbq23q0 = {
    setContent: setContent,
    getContent: getContent
  };

  var open = function (editor) {
    var minWidth = $_dajzwh9ojhbq23pz.getMinWidth(editor);
    var minHeight = $_dajzwh9ojhbq23pz.getMinHeight(editor);
    var win = editor.windowManager.open({
      title: 'Source code',
      body: {
        type: 'textbox',
        name: 'code',
        multiline: true,
        minWidth: minWidth,
        minHeight: minHeight,
        spellcheck: false,
        style: 'direction: ltr; text-align: left'
      },
      onSubmit: function (e) {
        $_as7fx09qjhbq23q0.setContent(editor, e.data.code);
      }
    });
    win.find('#code').value($_as7fx09qjhbq23q0.getContent(editor));
  };
  var $_71kc8l9njhbq23py = { open: open };

  var register = function (editor) {
    editor.addCommand('mceCodeEditor', function () {
      $_71kc8l9njhbq23py.open(editor);
    });
  };
  var $_fun2zm9mjhbq23px = { register: register };

  var register$1 = function (editor) {
    editor.addButton('code', {
      icon: 'code',
      tooltip: 'Source code',
      onclick: function () {
        $_71kc8l9njhbq23py.open(editor);
      }
    });
    editor.addMenuItem('code', {
      icon: 'code',
      text: 'Source code',
      onclick: function () {
        $_71kc8l9njhbq23py.open(editor);
      }
    });
  };
  var $_eblmkz9rjhbq23q1 = { register: register$1 };

  global.add('code', function (editor) {
    $_fun2zm9mjhbq23px.register(editor);
    $_eblmkz9rjhbq23q1.register(editor);
    return {};
  });
  function Plugin () {
  }

  return Plugin;

}());
})();
