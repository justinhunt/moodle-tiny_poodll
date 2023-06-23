// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Tiny Poodll - audio recorder configuration.
 *
 * @module      tiny_poodll/audio_recorder
 * @copyright   2023 Justin Hunt <justin@poodll.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {get_string as getString, get_strings as getStrings} from 'core/str';
import Pending from 'core/pending';
import {getCloudpoodll} from './options';
import uploadFile from 'editor_tiny/uploader';
import {add as addToast} from 'core/toast';
import * as ModalEvents from 'core/modal_events';
import * as ModalFactory from 'core/modal_factory';
import * as Templates from 'core/templates';
import {saveCancelPromise} from 'core/notification';
import {prefetchStrings, prefetchTemplates} from 'core/prefetch';
import Modal from "./modal";
import ModalRegistry from 'core/modal_registry';

import {
    component,
    INSERTMETHOD,
    LANGUAGE,
    CSS,
    SKIN
} from './common';

/**
 * The Poodll base class for audio, video, and any other future types
 */
export default class {

    /**
     * Constructor for the Tiny Poodll Recorder
     *
     * @param {TinyMCE} editor The Editor to which the content will be inserted
     * @param {Modal} modal The Moodle Modal that contains the interface used for recording
     * @param {config} config The data passed to template and used internally for managing plugin state
     */
    constructor(editor, modal, config) {
        this.ready = false;
/*
        if (!this.checkAndWarnAboutBrowserCompatibility()) {
            return;
        }
*/
        this.editor = editor;
        this.config = config;//getData(editor).params;
        this.modal = modal;
        this.modalRoot = modal.getRoot()[0];
   //     this.startStopButton = this.modalRoot.querySelector('button[data-action="startstop"]');
   //     this.uploadButton = this.modalRoot.querySelector('button[data-action="upload"]');

        // Disable the record button untilt he stream is acquired.
    //    this.setRecordButtonState(false);

    //    this.player = this.configurePlayer();
        this.registerEventListeners();
        this.ready = true;

      //  this.captureUserMedia();
      //  this.prefetchContent();
    }

    /**
     * Close the modal and stop recording.
     */
    close() {
        // Closing the modal will destroy it and remove it from the DOM.
        // It will also stop the recording via the hidden Modal Event.
        this.modal.hide();
    }

    /**
     * Register event listeners for the modal.
     */
    registerEventListeners() {
        /*
        this.modalRoot.addEventListener('click', this.handleModalClick.bind(this));
        this.modal.getRoot().on(ModalEvents.outsideClick, this.outsideClickHandler.bind(this));
        this.modal.getRoot().on(ModalEvents.hidden, () => {
            this.cleanupStream();
            this.requestRecordingStop();
        });

         */
    }


    /**
     * Display the widgets dialog
     *
     * @method _displayDialogue
     * @private
     */
    displayWidgetsDialogue(e, clickedicon) {
        e.preventDefault();
        var width = 800;

        var dialogue = this.getDialogue({
            headerContent: M.util.get_string('dialogtitle', COMPONENTNAME),
            width: width + 'px',
            focusAfterHide: clickedicon
        });
        //dialog doesn't detect changes in width without this
        //if you reuse the dialog, this seems necessary
        if (dialogue.width !== width + 'px') {
            dialogue.set('width', width + 'px');
        }


        //create content container
        var bodycontent = Y.Node.create('<div></div>');

        //create and append header
        var template = Y.Handlebars.compile(BUTTONSHEADERTEMPLATE),
            content = Y.Node.create(template({
                headertext: M.util.get_string('chooseinsert', COMPONENTNAME)
            }));
        bodycontent.append(content);

        //get button nodes
        var buttons = this._getButtonsForNames(clickedicon);

        Y.Array.each(buttons, function (button) {
            bodycontent.append(button);
        }, bodycontent);

        //set to bodycontent
        dialogue.set('bodyContent', bodycontent);
        dialogue.show();

        this.markUpdated();
    }

    getButtonsForNames(clickedicon) {
        var allcontent = [];
        Y.Array.each(CLOUDPOODLL.names, function (thename, currentindex) {
            //loop start
            var template = Y.Handlebars.compile(BUTTONTEMPLATE),
                content = Y.Node.create(template({
                    elementid: this.get('host').get('elementid'),
                    name: thename,
                    templateindex: currentindex
                }));
            this._form = content;
            content.one('.' + CSS.NAMEBUTTON + '_' + currentindex).on('click', this._showTemplateForm, this, currentindex);
            allcontent.push(content);
            //loop end
        }, this);

        return allcontent;
    }

    /**
     * Return the widget dialogue content for the tool, attaching any required
     * events.
     *
     * @method _getSubmitButtons
     * @return {Node} The content to place in the dialogue.
     * @private
     */
    getSubmitButtons(templateindex) {

        var template = Y.Handlebars.compile(SUBMITTEMPLATE),

            content = Y.Node.create(template({
                elementid: this.get('host').get('elementid'),
                inserttext: M.util.get_string('insert', COMPONENTNAME)
            }));

        content.one('.' + CSS.INPUTSUBMIT).on('click', this._doWidgetsInsert, this, templateindex);
        return content;
    }

    /**
     * Display the cloud poodll tool.
     *
     * @method _displayDialogue
     * @private
     */
    displayDialogue(e, recorder) {
        e.preventDefault();
        this._currentrecorder = recorder;

        if (recorder == RECORDERS.WIDGETS) {
            this._displayWidgetsDialogue(e, recorder);
            return;
        }

        STATE.currentrecorder = recorder;

        //get title and sizes
        switch (recorder) {
            case RECORDERS.SCREEN:
                var title = M.util.get_string('createscreen', COMPONENTNAME);
                var width = '502';
                var height = "660";
                break;

            case RECORDERS.VIDEO:
                var title = M.util.get_string('createvideo', COMPONENTNAME);
                switch (CLOUDPOODLL.videoskin) {
                    case SKIN.ONETWOTHREE:
                        var width = '500';
                        var height = "660";
                        break;
                    case SKIN.PLAIN:
                        var width = '500';
                        var height = "580";
                        break;
                    case SKIN.BMR:
                        var width = '500';
                        var height = "620";
                        break;
                    default:
                        var width = '500';
                        var height = false;

                }
                break;
            case RECORDERS.AUDIO:
            default:
                var title = M.util.get_string('createaudio', COMPONENTNAME);
                var width = '501';
                var height = false;
                break;
        }

        //set default subtitling flag
        if (CLOUDPOODLL.cansubtitle) {
            if (STATE.currentrecorder == RECORDERS.VIDEO ||
                STATE.currentrecorder == RECORDERS.SCREEN) {
                STATE.subtitling = STATE.subtitlevideobydefault;
            } else {
                STATE.subtitling = STATE.subtitleaudiobydefault;
            }
        }else{
            STATE.subtitling = 0;
        }

        var d_conf = {};
        d_conf.center = true;
        d_conf.headerContent = title;
        d_conf.focusAfterHide = recorder;
        d_conf.width = width + 'px';
        if (height) {
            d_conf.height = height + 'px';
        }

        var dialogue = this.getDialogue(d_conf);

        //if this dialog had a different size and title (it was popped up before as diff media recorder type)
        if (dialogue.get('width') != width + 'px') {
            dialogue.set('headerContent', title);
            //sadly the width and height won't change .. whatever
            dialogue.set('width', width + 'px');
            dialogue.set('height', height + 'px');
        }

        var output = '';
        if (CLOUDPOODLL.token == '') {
            output = M.util.get_string('notoken', COMPONENTNAME);
        } else {
            //this block should be portioned into an async/await and function, but shifter wont allow it.
            var context = this._getContext();
            var that = this;
            require(['core/templates','core/ajax', 'core/notification'], function (templates,ajax, notification) {

                templates.render('atto_cloudpoodll/root', context).then(function (html, js) {
                    output = html;
                    var content = Y.Node.create(output);

                    // Set the dialogue content, and then show the dialogue.
                    dialogue.set('bodyContent', content).show();


                    //store some common elements we will refer to later
                    STATE.elementid = that.get('host').get('elementid');
                    STATE.subtitlecheckbox = Y.one('#' + STATE.elementid + '_' + CSS.SUBTITLE_CHECKBOX);
                    STATE.mediainsertcheckbox = Y.one('#' + STATE.elementid + '_' + CSS.MEDIAINSERT_CHECKBOX);
                    STATE.languageselect = Y.one('#' + STATE.elementid + '_' + CSS.LANG_SELECT);
                    STATE.expiredays = Y.one('#' + STATE.elementid + '_' + CSS.EXPIREDAYS_SELECT);
                    var topnode = Y.one('#' + STATE.elementid + '_' + CSS.ATTO_CLOUDPOODLL_FORM);


                    //this is important?
                    poodllRecorder = that;

                    //subtitle checkbox click event.. reload recorders
                    if (STATE.subtitlecheckbox != null) {
                        //if we can subtitle, handle events, otherwise disable it
                        if (CLOUDPOODLL.cansubtitle) {
                            STATE.subtitlecheckbox.on('click', function (e) {
                                var element = e.currentTarget;
                                //update recorder subtitle setting
                                if (element.get('checked')) {
                                    topnode.all('.' + CSS.CP_SWAP).setAttribute('data-transcribe', '1');
                                    topnode.all('.' + CSS.CP_SWAP).setAttribute('data-subtitle', '1');
                                    topnode.all('.' + CSS.CP_SWAP).setAttribute('data-alreadyparsed', 'false');
                                    STATE.subtitling = true;
                                } else {
                                    topnode.all('.' + CSS.CP_SWAP).setAttribute('data-transcribe', '0');
                                    topnode.all('.' + CSS.CP_SWAP).setAttribute('data-subtitle', '0');
                                    topnode.all('.' + CSS.CP_SWAP).setAttribute('data-alreadyparsed', 'false');
                                    STATE.subtitling = false;
                                }
                                //reload the recorders
                                topnode.all('.' + CSS.CP_SWAP).empty();
                                that._loadRecorders();
                            });
                        } else {
                            this._disableSubtitleCheckbox();
                        }
                    }

                    //insert method checkbox;
                    if (STATE.mediainsertcheckbox != null) {
                        STATE.mediainsertcheckbox.on('click', function (e) {
                            var element = e.currentTarget;
                            //update recorder subtitle setting
                            if (element.get('checked')) {
                                STATE.insertmethod = INSERTMETHOD.TAGS;
                            } else {
                                STATE.insertmethod = INSERTMETHOD.LINK;
                            }
                        });
                    }

                    //language selector
                    if (STATE.languageselect != null) {
                        STATE.languageselect.on('change', function (e) {
                            var element = e.currentTarget;
                            if (element) {
                                CLOUDPOODLL.language =element.get('value');
                                topnode.all('.' + CSS.CP_SWAP).setAttribute('data-language', CLOUDPOODLL.language);
                                topnode.all('.' + CSS.CP_SWAP).setAttribute('data-alreadyparsed', 'false');
                                //reload the recorders
                                topnode.all('.' + CSS.CP_SWAP).empty();
                                that._loadRecorders();
                            }
                        });
                    }

                    //expire days selector
                    if (STATE.expiredays != null) {
                        STATE.expiredays.on('change', function (e) {
                            var element = e.currentTarget;
                            if (element) {
                                CLOUDPOODLL.expiredays = element.get('value');
                                topnode.all('.' + CSS.CP_SWAP).setAttribute('data-expiredays', CLOUDPOODLL.expiredays);
                                topnode.all('.' + CSS.CP_SWAP).setAttribute('data-alreadyparsed', 'false');
                                //reload the recorders
                                topnode.all('.' + CSS.CP_SWAP).empty();
                                that._loadRecorders();
                            }
                        });
                    }

                    //so finally load those recorders
                    that._loadRecorders();


                }).fail(function (ex) {
                    notification.exception(ex);

                });
            });

        }//end of if cloudpoodll token
    }

    disableSubtitleCheckbox() {
        //this function is never called, because if not transcribable, not shown
        STATE.subtitlecheckbox.setAttribute('disabled', true);
        var topnode = Y.one('#' + STATE.elementid + '_' + CSS.ATTO_CLOUDPOODLL_FORM);
        topnode.all('.' + CSS.CP_SWAP).setAttribute('data-transcribe', '0');
        topnode.all('.' + CSS.CP_SWAP).setAttribute('data-subtitle', '0');
    }

    /**
     * Loads the history tab html.
     *
     * @method loadHistory
     */
    loadHistory() {
        require(['core/templates','core/ajax', 'core/notification'], function (templates,ajax, notification) {
            ajax.call([{
                methodname: 'atto_cloudpoodll_history_get_items',
                args: {'recordertype' : STATE.currentrecorder},
                done: function (historyitems) {
                    /**
                     * Takes a mysql unix timestamp (in seconds) and converts to a display date.
                     *
                     * @method _formatUnixDate
                     * @param dateToFormat Date to format
                     */
                    function _formatUnixDate(dateToFormat) {
                        var dateObj = new Date(dateToFormat * 1000);

                        var month = dateObj.getUTCMonth() + 1;
                        var day = dateObj.getUTCDate();
                        var year = dateObj.getUTCFullYear();

                        return month + "/" + day + "/" + year;
                    }

                    if (Array.isArray(historyitems.responses)) {
                        historyitems.responses.forEach(function(item){
                            item.displaydateofentry = _formatUnixDate(item.dateofentry);
                            item.displayfiletitle = item.filetitle.substring(0, STATE.filetitledisplaylength) + '...';
                        });
                        historyitems.responses.formatted = JSON.stringify(historyitems.responses);
                    }

                    var context = {data: historyitems.responses};

                    templates.render('atto_cloudpoodll/historypanel', context)
                        .then(function (html, js) {
                            templates.replaceNodeContents('div[data-field="history"]', html, js);
                        }).fail(function (ex) {
                        notification.exception(ex);
                    });
                }
            }]);
        });
    }

    /**
     * Loads the history video preview tab html.
     *
     * @method loadHistoryPreview
     * @param historyItem History item ID from list.
     */
    loadHistoryPreview(historyItem) {
        require(['core/templates', 'core/ajax', 'core/notification'], function (templates, ajax, notification) {
            ajax.call([{
                methodname: 'atto_cloudpoodll_history_get_item',
                args: {'id': historyItem.dataset.historyId},
                done: function (historyItemData) {
                    var context = {
                        data: historyItemData.responses,
                        isVideo: STATE.currentrecorder === RECORDERS.VIDEO || STATE.currentrecorder === RECORDERS.SCREEN
                    };
                    templates.render('atto_cloudpoodll/historypreview', context)
                        .then(function (html, js) {
                            templates.replaceNodeContents('div[data-field="history"]', html, js);
                        }).fail(function (ex) {
                        notification.exception(ex);
                    });
                }
            }]);
        });
    }

    /**
     * Loads or reloads the recorders
     *
     * @method _loadRecorders
     * @private
     */
    loadRecorders() {
        var that = this;

        that.uploaded = false;
        that.ap_count = 0;
        require(['tiny_poodll/cloudpoodllloader'], function (loader) {
            var recorder_callback = function (evt) {
                switch (evt.type) {
                    case 'recording':
                        if (evt.action === 'started') {
                            //if user toggled subtitle checkbox any time from now, the recording would be lost
                            if (STATE.subtitlecheckbox != null) {
                                STATE.subtitlecheckbox.set('disabled', true);
                            }

                        }
                        break;
                    case 'awaitingprocessing':
                        //we delay  a second to allow the sourcefile to be copied to correct location
                        //the source filename will sometimes be incorrect because we do not know it when creating the dynamo db entry
                        // but an incorrect ext is just confusing. most players will ignore it and deal with contents
                        if (!that.uploaded) {
                            setTimeout(function () {
                                var guessed_ext = loader.fetch_guessed_extension(STATE.currentrecorder );
                                var sourcefilename = evt.sourcefilename.split('.').slice(0, -1).join('.') + '.' + guessed_ext;
                                var sourceurl = evt.s3root + sourcefilename;
                                that._doInsert(evt.mediaurl, evt.mediafilename, sourceurl, evt.sourcemimetype);
                            }, 4000);
                            that.uploaded = true;
                        }
                        break;
                    case 'filesubmitted':
                        //we will probably never get here because awaiting processing will fire first
                        //we do not use this event, but it arrives when the final file is ready. (much earlier in case of non-transcode)

                        break;
                    case 'error':
                        alert('PROBLEM:' + evt.message);
                        break;
                }
            };
            loader.init(CSS.CP_SWAP, recorder_callback);
        });
    }

    /**
     * Inserts the history item info the page.
     *
     * @method insertHistoryItem
     * @param  historyItem object
     * @private
     */
    insertHistoryItem(historyItem) {
        poodllRecorder.getDialogue({
            focusAfterHide: null
        }).hide();

        require(['core/ajax'], function (ajax) {
            ajax.call([{
                methodname: 'atto_cloudpoodll_history_get_item',
                args: {'id': historyItem.dataset.historyId},
                done: function (historyItemData) {
                    //const [first] = historyItemData.responses;
                    //var item = first;
                    var item = historyItemData.responses[0];
                    var mediaLink = poodllRecorder._createMediaLink(
                        item.mediaurl,
                        item.mediafilename,
                        item.sourceurl,
                        item.sourcemimetype
                    );

                    switch (STATE.insertmethod) {

                        case INSERTMETHOD.TAGS:
                            mediaLink.template = poodllRecorder._createMediaTemplate(mediaLink.context, item.sourcemimetype, mediaLink.template);
                            break;

                        case INSERTMETHOD.LINK:
                        default:
                        //do nothing we already made the template as a link
                    }

                    poodllRecorder._insertIntoEditor(mediaLink.template, mediaLink.context);
                }
            }]);
        });
    }

    /**
     * Creates the media link based on the recorder type.
     *
     * @method _createMediaLink
     * @param  mediaurl media URL to the AWS object
     * @param  mediafilename File name of the AWS object
     * @param  sourceurl URL to the AWS object
     * @param  sourcemimetype MimeType of the AWS object
     * @private
     */
    createMediaLink(mediaurl, mediafilename, sourceurl, sourcemimetype) {
        var context = {};
        context.url = mediaurl;
        context.name = mediafilename;
        context.issubtitling = STATE.subtitling && STATE.subtitling !== '0';
        context.includesourcetrack = STATE.transcoding && (mediaurl !== sourceurl) && (sourceurl.slice(-3) !== 'wav') && (sourceurl !== false);
        context.CP = CLOUDPOODLL;
        context.subtitleurl = mediaurl + '.vtt';
        context.sourceurl = sourceurl;
        context.sourcemimetype = sourcemimetype;

        var template = TEMPLATES.HTML_MEDIA.LINK;

        return {context: context, template: template};
    }

    /**
     * Inserts the item into the editor.
     *
     * @method _createMediaLink
     * @param  template HTML template to insert into the editor
     * @param  context Context of the item being inserted
     * @private
     */
    insertIntoEditor(template, context) {
        var content =
            Y.Handlebars.compile(template)(context);
        this.editor.focus();
        this.get('host').insertContentAtFocusPoint(content);
        this.markUpdated();
    }

    /**
     * Creates the media template for audio/video.
     *
     * @method _createMediaTemplate
     * @param  context Context of the item being inserted
     * @param  sourcemimetype MimeType of the AWS object
     * @param  context Context of the item being inserted
     * @private
     */
    createMediaTemplate(context, sourcemimetype, template) {
        if (STATE.currentrecorder === RECORDERS.VIDEO || STATE.currentrecorder === RECORDERS.SCREEN) {
            context.width = false;
            context.height = false;
            context.poster = false;
            if (STATE.transcoding) {
                context.urlmimetype = 'video/mp4';
            } else {
                context.urlmimetype = sourcemimetype;
            }
            template = TEMPLATES.HTML_MEDIA.VIDEO;
        } else {
            context.width = false;
            context.height = false;
            context.poster = false;
            if (STATE.transcoding) {
                context.urlmimetype = 'audio/mp3';
            } else {
                context.urlmimetype = sourcemimetype;
            }
            template = TEMPLATES.HTML_MEDIA.AUDIO;
        }
        return template;
    }

    /**
     * Inserts the link or media element onto the page
     * @method _doInsert
     * @private
     */
    doInsert(mediaurl, mediafilename, sourceurl, sourcemimetype) {
        this.getDialogue({
            focusAfterHide: null
        }).hide();

        //default context values(link) for template
        // var {context, template}
        var medialink = this._createMediaLink(mediaurl, mediafilename, sourceurl, sourcemimetype);
        var context = medialink.context;
        var template = medialink.template;
        function saveToHistory() {
            require(['core/ajax'], function (ajax) {
                ajax.call([{
                    methodname: 'atto_cloudpoodll_history_create',
                    args: {
                        recordertype: STATE.currentrecorder,
                        mediafilename: mediafilename,
                        sourceurl: sourceurl,
                        mediaurl: mediaurl,
                        sourcemimetype: sourcemimetype,
                        subtitling: STATE.subtitling ? 1 : 0,
                        subtitleurl: STATE.subtitling ? mediaurl + '.vtt' : '',
                    },
                }]);
            });
        }

        switch (STATE.insertmethod) {

            case INSERTMETHOD.TAGS:
                template = this._createMediaTemplate(context, sourcemimetype, template);
                break;

            case INSERTMETHOD.LINK:
                break;
            default:
            //do nothing special actually.
        }
        saveToHistory();
        this._insertIntoEditor(template, context);
    } //end of doinsert

    static fetchRecorderDimensions(config) {

        // Get return object
        var sizes = {};

        //get video sizes]
        switch (config.videoskin) {
            case SKIN.ONETWOTHREE:
            case SKIN.SCREEN:
                sizes.videowidth = 441; //(because the @media CSS is for <=440)
                sizes.videoheight = 540;
                break;
            case SKIN.BMR:
                sizes.videowidth = 441; //(because the @media CSS is for <=440)
                sizes.videoheight = 500;
                break;
            default:
                sizes.videowidth = 441;
                sizes.videoheight = 450;

        }
        switch (config.audioskin) {
            default:
                sizes.audiowidth = 450;
                sizes.audioheight = 350;
                break;
        }
        return sizes;
    }

    static getModalClass() {
        const modalType = `${component}/rec_audio`;
        const registration = ModalRegistry.get(modalType);
        if (registration) {
            return registration.module;
        }

        const AudioModal = class extends Modal {
            static TYPE = modalType;
            static TEMPLATE = `${component}/root`;
        };

        ModalRegistry.register(AudioModal.TYPE, AudioModal, AudioModal.TEMPLATE);
        return AudioModal;
    }

    static getModalContext(editor) {

        var context = {};
        var config = getCloudpoodll(editor);
        
        //stuff declared in common
        context.CSS = CSS;

        //insert method
        context.insertmethod = config.insertmethod;

        //subtitle by default
        context.subtitleaudiobydefault = config.subtitleaudiobydefault;
        context.subtitlevideobydefault = config.subtitlevideobydefault;

        //transcoding flag
        context.transcoding = config.cp_transcode == '1';

        //file title display length
        context.filetitledisplaylength = config.filetitle_displaylength;

        //show tabs
        context.showhistory = config.showhistory== '1';
        context.showupload = config.showupload== '1';
        context.showoptions = config.showoptions== '1';
        context.showexpiredays = config.showexpiredays== '1';

        //set up the cloudpoodll div
        context.CP={};
        context.CP.parent = M.cfg.wwwroot;
        context.CP.appid = 'tiny_poodll';
        context.CP.token = config.cp_token;
        context.CP.region = config.cp_region;
        context.CP.owner = config.cp_owner;
        context.CP.expiredays = config.cp_expiredays;
        context.CP.cansubtitle = config.cp_cansubtitle;
        context.CP.language = config.cp_language;
        context.CP.transcode = config.cp_transcode;
        context.CP.audioskin = config.cp_audioskin;
        context.CP.videoskin = config.cp_videoskin;
        context.CP.fallback = config.fallback;
        context.CP.sizes = this.fetchRecorderDimensions(config);
        return context;
    }

    static async display(editor) {
        const ModalClass = this.getModalClass();
        const templatecontext = this.getModalContext(editor);
        templatecontext.isaudio=true;
        const modal = await ModalFactory.create({
            type: ModalClass.TYPE,
            templateContext: templatecontext,
            large: true,
        });

        // Set up the Recorder.
        const recorder = new this(editor, modal, templatecontext);
        recorder.loadRecorders();
       // if (recorder.isReady()) {
            modal.show();
        //}
        return modal;
    }

} //end of class
