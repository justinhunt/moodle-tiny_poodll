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
import {component, INSERTMETHOD, SKIN} from "./common";
import * as Templates from 'core/templates';
import * as Notification from 'core/notification';
import * as ModalFactory from 'core/modal_factory';
import * as ModalEvents from 'core/modal_events';
import Modal from "./modal";
import ModalRegistry from 'core/modal_registry';
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
       var that = this;
       Log.debug('events registering');

       //handle the removal of an item from the history table
       $('#tiny_poodll_history_table').on('click', 'a[data-action-type="delete"]', function() {
           Log.debug('delete clicked');
           var clickedLink = $(this);
           ModalFactory.create({
               type: ModalFactory.types.SAVE_CANCEL,
               title: that.strings.deleteitem,
               body: that.strings.confirmdelete,
           }, clickedLink    )
               .then(function(modal) {
                   modal.setSaveButtonText(that.strings.deleteitem);
                   var root = modal.getRoot();
                   root.on(ModalEvents.cancel, function() {modal.hide();});
                   root.on(ModalEvents.save, function() {
                       let historyRow = clickedLink.parents('table').parents('tr').first().prev('.history-row');
                       let historyItemId = historyRow.data('history-id');
                       let childHistoryRow = clickedLink.parents('table').parents('tr').first();

                       Ajax.call([{
                           methodname: 'tiny_poodll_history_archive',
                           args: {'id': historyItemId},
                           done: function () {
                               childHistoryRow.fadeOut(300, function(){ $(this).remove();});
                               historyRow.fadeOut(300, function(){ $(this).remove();});
                           }
                       }]);
                       modal.hide()
                   });
                   modal.show();
               });
       });

       // Handle the insert of an item from history
       $('#tiny_poodll_history_table').on('click', 'a[data-action-type="add"]', function() {
           Log.debug('insert clicked');
           var historyitem = that.fetchHistoryItem($(this).data('history-id'));
           that.recorder.doInsert(historyitem.mediaurl, historyitem.mediafilename,
               historyitem.sourceurl, historyitem.sourcemimetype);
       });

       // Handle the preview of an item in the history table
       $('#tiny_poodll_history_table').on('click', 'a[data-action-type="preview"]', function() {
           Log.debug('preview clicked');
           const loadingHtml = '<br /><div class="d-flex justify-content-center">\n' +
               '  <div class=\"spinner-border\" role="status">\n' +
               '    <span class=\"sr-only\">' + that.strings.loading + '</span>\n' +
               '  </div>\n' +
               '</div><br />';

         //  $('div[data-field="history"]').html(loadingHtml);
           var clickedLink = $(this);
           that.loadHistoryPreview($(this).data('history-id'),clickedLink);
       });


       //toggle display of row in the history table
       //for some reason fails to fire when parent is table even though table is in DOM
       $('#tiny_poodll_history_table tbody').on('click', 'td.details-control', function () {
           Log.debug('details control clicked');
           var tr = $(this).closest('tr');
           Log.debug(tr);
           var row = that.table.row(tr);
           Log.debug(row);
           if ( row.child.isShown() ) {
               row.child.hide();
               tr.removeClass('shown');
           }
           else {
               var rowdata = {"name": "id", "value": tr.data('history-id') };
               Templates.render('tiny_poodll/historyrow',rowdata).then(
                   function(html,js){
                       row.child($(html)).show();
                       Log.debug('added ' + html);
                       tr.addClass('shown');
                   }
               );
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
     * @param  historyItem
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
     * @param  historyItem
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
     * @param  historyid
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
