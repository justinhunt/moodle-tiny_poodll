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


import * as Ajax from 'core/ajax';
import {component, CSS, INSERTMETHOD, SKIN} from "./common";
import * as Templates from 'core/templates';
import * as Notification from 'core/notification';
import * as ModalFactory from 'core/modal_factory';
import * as ModalEvents from 'core/modal_events';
import Log from 'core/log';
import {get_strings as getStrings} from "core/str";

export default class {

    itemdata= [];
    component = 'tiny_poodll';
    strings = {};

    /**
     * Constructor for the Tiny Poodll Recorder History Tab
     *
     * @param {recorder} recorder The recorder this history is associated with
     */
    constructor(recorder) {
        var that =this;
        var config = recorder.config;
        var processHistoryItems = function (historyitems) {
            /**
             * Takes a mysql unix timestamp (in seconds) and converts to a display date.
             *
             * @method _formatUnixDate
             * @param {integer} dateToFormat Date to format
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
                    if(item.hasOwnProperty('dateofentry')) {
                        item.displaydateofentry = _formatUnixDate(item.dateofentry);
                        item.displayfiletitle = item.filetitle.substring(0, config.filetitledisplaylength) + '...';
                        item.editablefield = [JSON.parse(item.editabletitle)];
                        that.itemdata[item.id] = item;
                    }
                });
            }

            var context = {data: historyitems.responses};
            return Templates.render('tiny_poodll/historypanel', context);

        };

        this.recorder = recorder;
        this.loadHistory()
            .then(processHistoryItems)
            .then(function (html, js) {
                Templates.replaceNodeContents('div[data-field="history"]', html, js);
                that.initDataTables();
                that.registerEvents();
        });
        this.initStrings();
    }

    initStrings() {
        var that =this;
        getStrings([
            { "key": "previewitem", "component": this.component },
            { "key": "deleteitem", "component": this.component },
            { "key": "confirmdelete", "component": this.component },
            { "key": "loading", "component": this.component },
            { "key": "insertitem", "component": this.component }
        ]).done(function (s) {
            var i = 0;
            that.strings.previewitem = s[i++];
            that.strings.deleteitem = s[i++];
            that.strings.confirmdelete = s[i++];
            that.strings.loading = s[i++];
            that.strings.insertitem = s[i++];
        });
    }

    initDataTables() {
        var that=this;
        require(
            ['jquery','https://cdn.datatables.net/1.13.5/js/jquery.dataTables.min.js',], function($, datatable) {

                that.table = $('#tiny_poodll_history_table').DataTable();

                Log.debug('datatable loaded');
                Log.debug(that.table);

            });
    }

   registerEvents() {
        const that = this;
        Log.debug('events registering');

        // Handle the removal of an item from the history table
        document.getElementById('tiny_poodll_history_table').addEventListener('click', function(event) {
            const target = event.target;
            if (target.dataset.actionType === 'delete') {
                Log.debug('delete clicked');
                const clickedLink = target;
                ModalFactory.create({
                    type: ModalFactory.types.SAVE_CANCEL,
                    title: that.strings.deleteitem,
                    body: that.strings.confirmdelete,
                }, clickedLink)
                    .then(function(modal) {
                        modal.setSaveButtonText(that.strings.deleteitem);
                        const root = modal.getRoot();
                        root.on(ModalEvents.cancel, function() { modal.hide(); });
                        root.on(ModalEvents.save, function() {
                            const historyRow = clickedLink.closest('tr').previousElementSibling;
                            const historyItemId = historyRow.dataset.historyId;
                            const childHistoryRow = clickedLink.closest('tr');

                            Ajax.call([{
                                methodname: 'tiny_poodll_history_archive',
                                args: { 'id': historyItemId },
                                done: function() {
                                    childHistoryRow.style.display = 'none';
                                    historyRow.style.display = 'none';
                                }
                            }]);
                            modal.hide();
                        });
                        modal.show();
                    });
            }
        });

        // Handle the insert of an item from history
        document.getElementById('tiny_poodll_history_table').addEventListener('click', function(event) {
            const target = event.target;
            if (target.dataset.actionType === 'add') {
                Log.debug('insert clicked');
                const historyItem = that.fetchHistoryItem(target.dataset.historyId);
                that.recorder.doInsert(historyItem.mediaurl, historyItem.mediafilename,
                    historyItem.sourceurl, historyItem.sourcemimetype);
            }
        });

        // Handle the preview of an item in the history table
        document.getElementById('tiny_poodll_history_table').addEventListener('click', function(event) {
            const target = event.target;
            if (target.dataset.actionType === 'preview') {
                Log.debug('preview clicked');
                const clickedLink = target;
                that.loadHistoryPreview(target.dataset.historyId, clickedLink);
            }
        });

        // Toggle display of row in the history table
        document.querySelector('#tiny_poodll_history_table tbody').addEventListener('click', function(event) {
            const target = event.target;
            if (target.classList.contains('details-control')) {
                Log.debug('details control clicked');
                const tr = target.closest('tr');
                const row = that.table.row(tr);
                if (row.child.isShown()) {
                    row.child.hide();
                    tr.classList.remove('shown');
                } else {
                    const rowdata = { "name": "id", "value": tr.dataset.historyId };
                    Templates.render('tiny_poodll/historyrow', rowdata).then(
                        function(html, js) {
                            row.child(html).show();
                            Log.debug('added ' + html);
                            tr.classList.add('shown');
                        }
                    );
                }
            }
        });
    }
    loadHistory() {
        var that = this;
        var config = that.recorder.config;
        return Ajax.call([{
            methodname: 'tiny_poodll_history_get_items',
            args: {'recordertype': config.recorder},
            async: false, //this means the function is blocking
        }])[0];
    }

    /**
     * Creates the media html5 tags based on the recorder type.
     *
     * @method saveHistoryItem
     * @param  {string} mediaurl The url of the media file
     * @param  {string} mediafilename The name of the media file
     * @param  {string} sourceurl The url of the source file
     * @param  {string} sourcemimetype The mimetype of the source file
     */
    saveHistoryItem(mediaurl, mediafilename, sourceurl, sourcemimetype) {
        Log.debug("ajax saving history item");
        var that=this;
        return Ajax.call([{
            methodname: 'tiny_poodll_history_create',
            args: {
                recordertype: that.recorder.config.recorder,
                mediafilename: mediafilename,
                sourceurl: sourceurl,
                mediaurl: mediaurl,
                sourcemimetype: sourcemimetype,
                subtitling: that.recorder.config.subtitling ? 1 : 0,
                subtitleurl: that.recorder.config.subtitling ? mediaurl + '.vtt' : '',
            },
        }])[0];
    }

    /**
     * Creates the media html5 tags based on the recorder type.
     *
     * @method loadHistoryPreview
     * @param  {integer} historyid The id of the history item
     * @param  {object} clickedLink The link that was clicked
     */
    loadHistoryPreview(historyid, clickedLink){
        var that=this;

        var historyItem = this.fetchHistoryItem(historyid);
        var context = {
            data: historyItem,
            isVideo: that.recorder.config.recorder === 'video' || that.recorder.config.recorder === 'screen'
        };
        Templates.render('tiny_poodll/historypreview', context)
            .then(function (html, js) {
                ModalFactory.create({
                    type: ModalFactory.types.SAVE_CANCEL,
                    title: that.strings.previewitem,
                    body: html,
                }, clickedLink )
                    .then(function(modal) {
                        modal.setSaveButtonText(that.strings.insertitem);
                        var root = modal.getRoot();
                        root.on(ModalEvents.cancel, function() {modal.hide();});
                        root.on(ModalEvents.save, function() {
                                that.recorder.doInsert(historyItem.mediaurl, historyItem.mediafilename,
                                historyItem.sourceurl, historyItem.sourcemimetype);
                                modal.hide();
                        });
                        modal.show();
                    });
            }).fail(function (ex) {
            Notification.exception(ex);
        });
    }

    /**
     * Inserts the histopry item
     *
     * @method insertHistoryItem
     * @param  {integer} historyid The id of the history item
     */
   insertHistoryItem(historyid) {
        var that=this;
        var historyItemData = this.fetchHistoryItem(historyid);
        var context = {
            data: historyItemData.responses,
            isVideo: that.recorder.config.recorder === 'video' || that.recorder.config.recorder === 'screen'
        };
        Templates.render('tiny_poodll/historypreview', context)
            .then(function (html, js) {
                Templates.replaceNodeContents('div[data-field="history"]', html, js);
            }).fail(function (ex) {
            Notification.exception(ex);
        });

    }

    /**
     * Fetches a history item from the itemdata array
     * @method fetchHistoryItem
     * @param {integer} historyid The id of the history item
     * @returns {*}
     */
   fetchHistoryItem(historyid) {
       return this.itemdata[historyid];
       /*
        return Ajax.call([{
            methodname: 'tiny_poodll_history_get_item',
            args: {'id': historyid}
        }])[0];
        */

    }
}
