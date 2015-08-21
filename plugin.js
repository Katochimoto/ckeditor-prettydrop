(function() {
    'use strict';

    CKEDITOR.plugins.add('prettydrop', {
        requires: 'clipboard',
        modes: { 'wysiwyg': 1 },

        init: function(editor) {
            var dropBookmark = null;

            editor.on('paste', function(event) {
                var data = event.data;

				if (data.method === 'drop' && data.dataValue) {
                    if (!data.range) {
                        data.range = this.getSelection().getRanges()[ 0 ];
                    }

                    if (data.range.collapsed) {
                        dropBookmark = data.range.createBookmark(true);
                    }
				}

            }, editor, null, 990);

            editor.on('afterPaste', function() {
                if (dropBookmark) {
                    var bmRange = this.createRange();
                    bmRange.moveToBookmark(dropBookmark);

                    var range = this.getSelection().getRanges()[ 0 ];
                    range.optimize();
                    bmRange.setEnd(range.endContainer, range.endOffset);
                    bmRange.optimize();
                    bmRange.select();

                    dropBookmark = null;
                }

            }, editor, null, -1);
        }
    });
}());
