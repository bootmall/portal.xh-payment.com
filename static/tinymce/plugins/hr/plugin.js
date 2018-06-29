(function () {
var hr = (function () {
  'use strict';

  var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

  var register = function (editor) {
    editor.addCommand('InsertHorizontalRule', function () {
      editor.execCommand('mceInsertContent', false, '<hr />');
    });
  };
  var $_45f1pvc7jhbq243e = { register: register };

  var register$1 = function (editor) {
    editor.addButton('hr', {
      icon: 'hr',
      tooltip: 'Horizontal line',
      cmd: 'InsertHorizontalRule'
    });
    editor.addMenuItem('hr', {
      icon: 'hr',
      text: 'Horizontal line',
      cmd: 'InsertHorizontalRule',
      context: 'insert'
    });
  };
  var $_19jirlc8jhbq243h = { register: register$1 };

  global.add('hr', function (editor) {
    $_45f1pvc7jhbq243e.register(editor);
    $_19jirlc8jhbq243h.register(editor);
  });
  function Plugin () {
  }

  return Plugin;

}());
})();
