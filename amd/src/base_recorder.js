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


import Log from 'core/log';
import {getConfig} from './options';
import * as ModalFactory from 'core/modal_factory';
import * as Templates from 'core/templates';
import {prefetchStrings, prefetchTemplates} from 'core/prefetch';
import Modal from "./modal";
import ModalRegistry from 'core/modal_registry';
import History from 'tiny_poodll/history';

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
     * @param {elementid} elementid
     * @param {Modal} modal The Moodle Modal that contains the interface used for recording
     * @param {config} config The data passed to template and used internally for managing plugin state
     */
    constructor(editor,elementid, modal, config) {
        this.ready = false;

        this.editor = editor;
        this.elementid = elementid;
        this.config = config;//getData(editor).params;
        this.modal = modal;
        this.modalRoot = modal.getRoot()[0];
        this.registerEvents();
        this.ready = true;
    }

    /**
     * Get the name of the template used when embedding the URL in the editor content.
     *
     * @returns {string}
     */
    fetchMediaTags() {
        throw new Error(`fetchMediaTags() must be implemented in ${this.constructor.name}`);
    }

    /**
     * Close the modal and stop recording.
     */
    close() {
        // Closing the modal will destroy it and remove it from the DOM.
        // It will also stop the recording via the hidden Modal Event.
        this.modal.hide();
    }

    getElement(component){
        return this.modalRoot.querySelector('#' + this.elementid + '_' + component);
    }

    /**
     * Register event listeners for the modal.
     */
    registerEvents() {
        var that =this;
        const $root = this.modal.getRoot();
        const root = $root[0];
        const recorders = root.querySelectorAll('.' + CSS.CP_SWAP);


        root.addEventListener('click', (e) => {
            const cbox = e.target.closest('[type="checkbox"]');
           // if (cbox) {
            Log.debug(e.target.id);
                switch (e.target.id) {
                    case that.elementid + '_' + CSS.SUBTITLE_CHECKBOX:
                        //update recorder subtitle setting
                        if (cbox.checked) {
                            recorders.forEach((recorder) => {
                                recorder.setAttribute('data-transcribe', '1');
                                recorder.setAttribute('data-subtitle', '1');
                                recorder.setAttribute('data-alreadyparsed', 'false');
                                recorder.innerHTML = "";
                            });
                            that.config.subtitling = true;
                        } else {
                            recorders.forEach((recorder) => {
                                recorder.setAttribute('data-transcribe', '0');
                                recorder.setAttribute('data-subtitle', '0');
                                recorder.setAttribute('data-alreadyparsed', 'false');
                                recorder.innerHTML = "";
                            });
                            that.config.subtitling = false;
                        }
                        //reload the recorders
                        that.loadRecorders();
                        break;
                    case  that.elementid + '_' + CSS.MEDIAINSERT_CHECKBOX:
                        //update recorder subtitle setting
                        if (cbox.checked) {
                            that.config.insertmethod = INSERTMETHOD.TAGS;
                        } else {
                            that.config.insertmethod = INSERTMETHOD.LINK;
                        }
                        break;
                }
           // }
        });
        root.addEventListener('change', (e) => {
            const dropdown = e.target;
            if(dropdown){
                switch(dropdown.id){
                    case that.elementid + '_' + CSS.LANG_SELECT:
                        //TO DO - save this value, or leave it as is ... do we need to keep track of it, for insert method?
                        that.config.CP.language =dropdown.get('value');
                        recorders.forEach((recorder) => {
                            recorder.setAttribute('data-language', that.config.CP.language);
                            recorder.setAttribute('data-alreadyparsed', 'false');
                            recorder.innerHTML="";
                        });
                        that.loadRecorders();
                        break;
                    case that.elementid + '_' + CSS.EXPIREDAYS_SELECT:
                        //do something
                        recorders.forEach((recorder) => {
                            recorder.setAttribute('data-expiredays', that.config.CP.expiredays);
                            recorder.setAttribute('data-alreadyparsed', 'false');
                            recorder.innerHTML="";
                        });
                        that.loadRecorders();
                }

            }

        });

    }

    /**
     * Initialises history tab and events
     *
     * @method initHistory
     * @private
     */
    initHistory() {
        this.history = new History(this);
    }

    /**
     * Loads or reloads the recorders
     *
     * @method _loadRecorders
     * @private
     */
    loadRecorders() {
        var that = this;
        Log.debug('loading recorders');
        that.uploaded = false;
        that.ap_count = 0;
        require(['tiny_poodll/cloudpoodllloader'], function (loader) {
            var recorder_callback = function (evt) {
                switch (evt.type) {
                    case 'recording':
                        if (evt.action === 'started') {
                            //if user toggled subtitle checkbox any time from now, the recording would be lost
                            var subtitlecheckbox= that.getElement(CSS.SUBTITLE_CHECKBOX);
                            if (subtitlecheckbox !== null) {
                                subtitlecheckbox.disabled = true;
                            }
                        }
                        break;
                    case 'awaitingprocessing':
                        //we delay  a second to allow the sourcefile to be copied to correct location
                        //the source filename will sometimes be incorrect, we do not know it when creating the db entry
                        // but its ok. Most players ignore the extension and deal with contents
                        if (!that.uploaded) {
                            setTimeout(function () {
                                var guessed_ext = loader.fetch_guessed_extension(that.recorder );
                                var sourcefilename = evt.sourcefilename.split('.').slice(0, -1).join('.')
                                    + '.' + guessed_ext;
                                var sourceurl = evt.s3root + sourcefilename;
                                //save history
                                Log.debug("saving history item");
                                that.history.saveHistoryItem(evt.mediaurl,evt.mediafilename, sourceurl, evt.sourcemimetype).then(
                                    function(){Log.debug("ajax SAVED history item");}
                                );
                                that.doInsert(evt.mediaurl, evt.mediafilename, sourceurl, evt.sourcemimetype);
                            }, 4000);
                            that.uploaded = true;
                        }
                        break;
                    case 'filesubmitted':
                        //we will probably never get here because awaiting processing will fire first
                        //we do not use this event, but it arrives when the final file is ready.

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
     * Creates the media link based on the recorder type.
     *
     * @method fetchMediaLink
     * @param {string} mediaurl media URL to the AWS object
     * @param {string} mediafilename File name of the AWS object
     * @param {string} sourceurl URL to the AWS object
     * @param {string} sourcemimetype MimeType of the AWS object
     * @private
     */
    fetchMediaLink(mediaurl, mediafilename, sourceurl, sourcemimetype) {
        var context = {};
        context.url = mediaurl;
        context.name = mediafilename;
        context.issubtitling = this.config.subtitling && this.config.subtitling !== '0';
        context.includesourcetrack = this.config.transcoding && (mediaurl !== sourceurl)
            && (sourceurl.slice(-3) !== 'wav') && (sourceurl !== false);
        context.CP = this.config.CP;
        context.subtitleurl = mediaurl + '.vtt';
        context.sourceurl = sourceurl;
        context.sourcemimetype = sourcemimetype;
        return Templates.renderForPromise(
            'tiny_poodll/medialink',
            context
        );
    }

    /**
     * Inserts the link or media element onto the page
     * @method doInsert
     * @param {string} mediaurl media URL to the AWS object
     * @param {string} mediafilename File name of the AWS object
     * @param {string} sourceurl URL to the AWS object
     * @param {string} sourcemimetype MimeType of the AWS object
     * @private
     */
    doInsert(mediaurl, mediafilename, sourceurl, sourcemimetype) {

        var that = this;

        //do the actual inserting
        switch (this.config.insertmethod) {

            case INSERTMETHOD.TAGS:
                this.fetchMediaTags(mediaurl, mediafilename, sourceurl, sourcemimetype).then(
                    function(insert){
                        Log.debug('inserting into editor');
                        that.editor.insertContent(insert.html);
                        that.close();
                        //addToast(await getString('recordinguploaded', component));
                    }
                );
                break;

            case INSERTMETHOD.LINK:
            default:
                this.fetchMediaLink(mediaurl, mediafilename, sourceurl, sourcemimetype).then(
                    function(insert){
                        Log.debug('inserting into editor');
                        Log.debug(insert.html);
                        that.editor.insertContent(insert.html);
                        that.close();
                    }
                );

        }

    } //end of doinsert


    static generateRandomString() {
        var length = 8;
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';

        for (var i = 0; i < length; i++) {
            var randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return result;
    }

    static getModalClass() {
        const modalType = `${component}/media_recorder`;
        const registration = ModalRegistry.get(modalType);
        if (registration) {
            return registration.module;
        }

        const MediaModal = class extends Modal {
            static TYPE = modalType;
            static TEMPLATE = `${component}/recorders`;
        };

        ModalRegistry.register(MediaModal.TYPE, MediaModal, MediaModal.TEMPLATE);
        return MediaModal;
    }

    static getModalContext(editor) {

        var context = {};
        var config = getConfig(editor);
        Log.debug(config);
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
        context.cansubtitle = config.cp_cansubtitle;

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

        //get defaults for expire days and subtitle language
        context['expire_' + config.cp_expiredays] =true;
        context['lang_' + config.cp_language] =true;

        return context;
    }

    static async display(editor) {
        const ModalClass = this.getModalClass();
        const templatecontext = this.getModalContext(editor);
        const elementid = this.generateRandomString();
        templatecontext.elementid = elementid;

        const modal = await ModalFactory.create({
            type: ModalClass.TYPE,
            templateContext: templatecontext,
            large: true,
        });

        // Set up the Recorder.
        const recorder = new this(editor, elementid, modal, templatecontext);
        recorder.loadRecorders();
        recorder.initHistory();

        modal.show();
        return modal;
    }
}