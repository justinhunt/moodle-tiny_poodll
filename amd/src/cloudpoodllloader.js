define(['jquery', 'core/log', 'tiny_poodll/cloudpoodll', 'core/str'],
    function ($, log, CloudPoodll, str) {
    return {
        init: function (recorderclass, thecallback) {
                CloudPoodll.autoCreateRecorders(recorderclass);
                CloudPoodll.theCallback = thecallback;
                CloudPoodll.initEvents();
                },
        fetch_guessed_extension(mediatype) {
            if (mediatype === 'screen') {
                mediatype = 'video';
            }
            var mimetype = CloudPoodll.guess_mimetype(mediatype, 0, false);
            if (mimetype) {
                var bits = mimetype.split('/');
                if (bits.length === 2) {
                    return bits[1];
                }
            }
            return false;
        }
    };
});