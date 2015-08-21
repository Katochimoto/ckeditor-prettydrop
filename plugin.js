(function() {
    'use strict';

    CKEDITOR.plugins.add('prettydrop', {
        requires: 'clipboard',
        modes: { 'wysiwyg': 1 },

        init: function(editor) {
            var dropBookmarkStart = null;

            // с индексом 1000 выполняется вставка
            // закладку надо создать прямо перед вставкой
            editor.on('paste', function(event) {
                var data = event.data;

				if (data.method === 'drop' && data.dataValue) {
                    // закладка должна быть создана для range, в который будет выполнена вставка
                    // иначе закладка создается не в том месте
                    // поэтому если range нет, создаем его и передаем дальше в data
                    if (!data.range) {
                        data.range = this.getSelection().getRanges()[ 0 ];
                    }

                    // collapsed кажется всегда true
                    // но проверка не лишняя
                    if (data.range.collapsed) {
                        dropBookmarkStart = data.range.createBookmark();
                    }
				}

            }, editor, null, 999);

            editor.on('afterPaste', function() {
                if (dropBookmarkStart) {
                    var range = this.getSelection().getRanges()[ 0 ];
                    // если не создать закладку из текущего range после вставки
                    // выделение будет не точным
                    var dropBookmarkEnd = range.createBookmark();

                    var bmRange = this.createRange();
                    bmRange.setStartBefore(dropBookmarkStart.startNode);
                    bmRange.setEndBefore(dropBookmarkEnd.startNode);
                    bmRange.select();

                    dropBookmarkStart.startNode.remove();
                    dropBookmarkEnd.startNode.remove();

                    dropBookmarkStart = null;
                }

            }, editor, null, -1);
        }
    });
}());
