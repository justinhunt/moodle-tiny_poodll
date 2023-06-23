// This file is part of Moodle - https://moodle.org/
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
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Options helper for the Moodle tiny_poodll plugin.
 *
 * @module      plugintype_pluginname/options
 * @copyright   2023 Justin Hunt <justin@poodll.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getPluginOptionName} from 'editor_tiny/options';
import {pluginName} from './common';

// Helper variables for the option names.
const cp_cansubtitleName = getPluginOptionName(pluginName, 'cp_cansubtitle');
const cp_tokenName = getPluginOptionName(pluginName, 'cp_token');
const cp_regionName = getPluginOptionName(pluginName, 'cp_region');
const cp_expiredaysName = getPluginOptionName(pluginName, 'cp_expiredays');
const cp_languageName = getPluginOptionName(pluginName, 'cp_language');
const cp_transcodeName = getPluginOptionName(pluginName, 'cp_transcode');
const cp_audioskinName = getPluginOptionName(pluginName, 'cp_audioskin');
const cp_videoskinName = getPluginOptionName(pluginName, 'cp_videoskin');
const cp_fallbackName = getPluginOptionName(pluginName, 'cp_fallback');
const cp_ownerName = getPluginOptionName(pluginName, 'cp_owner');
const subtitleaudiobydefaultName = getPluginOptionName(pluginName, 'subtitleaudiobydefault');
const subtitlevideobydefaultName = getPluginOptionName(pluginName, 'subtitlevideobydefault');
const disabledName = getPluginOptionName(pluginName, 'disabled');
const filetitle_displaylengthName = getPluginOptionName(pluginName, 'filetitle_displaylength');
const showhistoryName = getPluginOptionName(pluginName, 'showhistory');
const showoptionsName = getPluginOptionName(pluginName, 'showoptions');
const showuploadName = getPluginOptionName(pluginName, 'showupload');
const showexpiredaysName = getPluginOptionName(pluginName, 'showexpiredays');
const audioallowed = getPluginOptionName(pluginName, 'audioallowed');
const videoallowed = getPluginOptionName(pluginName, 'videoallowed');
const screenallowed = getPluginOptionName(pluginName, 'screenallowed');
const widgetsallowed = getPluginOptionName(pluginName, 'widgetsallowed');

/**
 * Options registration function.
 *
 * @param {tinyMCE} editor
 */
export const register = (editor) => {
    const registerOption = editor.options.register;

    // For each option, register it with the editor.
    // Valid type are defined in https://www.tiny.cloud/docs/tinymce/6/apis/tinymce.editoroptions/
    registerOption(cp_cansubtitleName, {
        processor: 'int',
    });
    registerOption(cp_tokenName, {
        processor: 'string',
    });
    registerOption(cp_regionName, {
        processor: 'string',
    });
    registerOption(cp_expiredaysName, {
        processor: 'int',
    });
    registerOption(cp_languageName, {
        processor: 'string',
    });
    registerOption(cp_transcodeName, {
        processor: 'int',
    });
    registerOption(cp_audioskinName, {
        processor: 'string',
    });
    registerOption(cp_videoskinName, {
        processor: 'string',
    });
    registerOption(cp_fallbackName, {
        processor: 'int',
    });
    registerOption(cp_ownerName, {
        processor: 'string',
    });
    registerOption(subtitleaudiobydefaultName, {
        processor: 'int',
    });
    registerOption(subtitlevideobydefaultName, {
        processor: 'int',
    });
    registerOption(disabledName, {
        processor: 'int',
    });
    registerOption(filetitle_displaylengthName, {
        processor: 'int',
    });
    registerOption(showhistoryName, {
        processor: 'int',
    });
    registerOption(showoptionsName, {
        processor: 'int',
    });
    registerOption(showuploadName, {
        processor: 'int',
    });
    registerOption(showexpiredaysName, {
        processor: 'int',
    });
    registerOption(audioallowed, {
        processor: 'boolean',
    });
    registerOption(videoallowed, {
        processor: 'boolean',
    });
    registerOption(screenallowed, {
        processor: 'boolean',
    });
    registerOption(widgetsallowed, {
        processor: 'boolean',
    });
};

/**
 * Fetch the cp_cansubtitle value for this editor instance.
 *
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {object} The value of the cp_cansubtitle option
 */
export const getCp_cansubtitle = (editor) => editor.options.get(cp_cansubtitleName);

/**
 * Fetch the cp_token value for this editor instance.
 *
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {object} The value of the cp_token option
 */
export const getCp_token = (editor) => editor.options.get(cp_tokenName);

/**
 * Fetch the cp_region value for this editor instance.
 *
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {object} The value of the cp_region option
 */
export const getCp_region = (editor) => editor.options.get(cp_regionName);

/**
 * Fetch the cp_expiredays value for this editor instance.
 *
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {object} The value of the cp_expiredays option
 */
export const getCp_expiredays = (editor) => editor.options.get(cp_expiredaysName);

/**
 * Fetch the cp_language value for this editor instance.
 *
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {object} The value of the cp_language option
 */
export const getCp_language = (editor) => editor.options.get(cp_languageName);

/**
 * Fetch the cp_transcode value for this editor instance.
 *
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {object} The value of the cp_transcode option
 */
export const getCp_transcode = (editor) => editor.options.get(cp_transcodeName);

/**
 * Fetch the cp_audioskin value for this editor instance.
 *
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {object} The value of the cp_audioskin option
 */
export const getCp_audioskin = (editor) => editor.options.get(cp_audioskinName);

/**
 * Fetch the cp_videoskin value for this editor instance.
 *
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {object} The value of the cp_videoskin option
 */
export const getCp_videoskin = (editor) => editor.options.get(cp_videoskinName);

/**
 * Fetch the cp_fallback value for this editor instance.
 *
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {object} The value of the cp_fallback option
 */
export const getCp_fallback = (editor) => editor.options.get(cp_fallbackName);

/**
 * Fetch the cp_owner value for this editor instance.
 *
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {object} The value of the cp_owner option
 */
export const getCp_owner = (editor) => editor.options.get(cp_ownerName);

/**
 * Fetch the subtitleaudiobydefault value for this editor instance.
 *
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {object} The value of the subtitleaudiobydefault option
 */
export const getSubtitleaudiobydefault = (editor) => editor.options.get(subtitleaudiobydefaultName);

/**
 * Fetch the subtitlevideobydefault value for this editor instance.
 *
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {object} The value of the subtitlevideobydefault option
 */
export const getSubtitlevideobydefault = (editor) => editor.options.get(subtitlevideobydefaultName);

/**
 * Fetch the disabled value for this editor instance.
 *
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {object} The value of the disabled option
 */
export const getDisabled = (editor) => editor.options.get(disabledName);

/**
 * Fetch the filetitle_displaylength value for this editor instance.
 *
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {object} The value of the filetitle_displaylength option
 */
export const getFiletitle_displaylength = (editor) => editor.options.get(filetitle_displaylengthName);

/**
 * Fetch the showhistory value for this editor instance.
 *
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {object} The value of the showhistory option
 */
export const getShowhistory = (editor) => editor.options.get(showhistoryName);

/**
 * Fetch the showoptions value for this editor instance.
 *
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {object} The value of the showoptions option
 */
export const getShowoptions = (editor) => editor.options.get(showoptionsName);

/**
 * Fetch the showupload value for this editor instance.
 *
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {object} The value of the showupload option
 */
export const getShowupload = (editor) => editor.options.get(showuploadName);

/**
 * Fetch the showexpiredays value for this editor instance.
 *
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {object} The value of the showexpiredays option
 */
export const getShowexpiredays = (editor) => editor.options.get(showexpiredaysName);

/**
 * Fetch the audioallowed value for this editor instance.
 *
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {object} The value of the audioallowed option
 */
export const getAudioallowed = (editor) => editor.options.get(audioallowed);

/**
 * Fetch the videoallowed value for this editor instance.
 *
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {object} The value of the videoallowed option
 */
export const getVideoallowed = (editor) => editor.options.get(videoallowed);

/**
 * Fetch the screenallowed value for this editor instance.
 *
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {object} The value of the screenallowed option
 */
export const getScreenallowed = (editor) => editor.options.get(screenallowed);

/**
 * Fetch the widgetsallowed value for this editor instance.
 *
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {object} The value of the widgetsallowed option
 */
export const getWidgetsallowed = (editor) => editor.options.get(widgetsallowed);
