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
                    // выделение будет не правильным
                    var dropBookmarkEnd = range.createBookmark();
                    var startNode = dropBookmarkStart.startNode;
                    var endNode = dropBookmarkEnd.startNode;

                    var bmRange = this.createRange();
                    bmRange.setStartBefore(startNode);
                    bmRange.setEndBefore(endNode);
                    bmRange.select();

                    dropBookmarkStart = null;

                    // в FireFox удаляет ноды слишком быстро
                    // и bmRange.select() выледяет не правильно
                    setTimeout(function() {
                        startNode.remove();
                        endNode.remove();
                    }, 0);
                }

            }, editor, null, -1);
        }
    });
}());
