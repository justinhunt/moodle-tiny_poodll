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
 * Tiny Poodll - Widgets Page
 *
 * @module      tiny_poodll/widgets page
 * @copyright   2023 Justin Hunt <justin@poodll.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {get_string as getString, get_strings as getStrings} from 'core/str';
import Pending from 'core/pending';
import Log from 'core/log';
import {getConfig} from './options';

import {add as addToast} from 'core/toast';
import * as ModalEvents from 'core/modal_events';
import * as ModalFactory from 'core/modal_factory';
import * as Templates from 'core/templates';
import {saveCancelPromise} from 'core/notification';
import {prefetchStrings, prefetchTemplates} from 'core/prefetch';
import Modal from "./modal";
import ModalRegistry from 'core/modal_registry';
import * as Notification from 'core/notification';

import {
    component,
    CSS,
} from './common';

/**
 * The Poodll base class for audio, video, and any other future types
 */
export default class {

    /**
     * Constructor for the Tiny Poodll Widgets Page
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





    /**
     * Inserts the link or media element onto the page
     * @method doInsert
     * @param  mediaurl media URL to the AWS object
     * @param  mediafilename File name of the AWS object
     * @param  sourceurl URL to the AWS object
     * @param  sourcemimetype MimeType of the AWS object
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
        const modalType = `${component}/widgetpage`;
        const registration = ModalRegistry.get(modalType);
        if (registration) {
            return registration.module;
        }

        const WidgetModal = class extends Modal {
            static TYPE = modalType;
            static TEMPLATE = `${component}/widgetpage`;
        };

        ModalRegistry.register(WidgetModal.TYPE, WidgetModal, WidgetModal.TEMPLATE);
        return WidgetModal;
    }

    static getModalContext(editor) {

        var context = {};
        var config = getConfig(editor);
        Log.debug(config);
        
        //stuff declared in common
        context.CSS = CSS;

        //insert method
      //  context.insertmethod = config.insertmethod;

        return context;
    }

    static async display(editor) {
        const ModalClass = this.getModalClass();
        const templatecontext = this.getModalContext(editor);
        const elementid = this.generateRandomString();

        const modal = await ModalFactory.create({
            type: ModalClass.TYPE,
            templateContext: templatecontext,
            large: true,
        });


        modal.show();
        return modal;
    }

} //end of class
