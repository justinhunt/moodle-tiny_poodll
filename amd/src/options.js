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
const cloudpoodllName = getPluginOptionName(pluginName, 'cloudpoodll');
const audioallowedName = getPluginOptionName(pluginName, 'audioallowed');
const videoallowedName = getPluginOptionName(pluginName, 'videoallowed');
const screenallowedName = getPluginOptionName(pluginName, 'screenallowed');
const widgetsallowedName = getPluginOptionName(pluginName, 'widgetsallowed');

/**
 * Options registration function.
 *
 * @param {tinyMCE} editor
 */
export const register = (editor) => {
    const registerOption = editor.options.register;

    // For each option, register it with the editor.
    // Valid type are defined in https://www.tiny.cloud/docs/tinymce/6/apis/tinymce.editoroptions/
    registerOption(cloudpoodllName, {
        processor: 'object',
    });

    registerOption(audioallowedName, {
        processor: 'boolean',
        default: false
    });
    registerOption(videoallowedName, {
        processor: 'boolean',
        default: false
    });
    registerOption(screenallowedName, {
        processor: 'boolean',
        default: false
    });
    registerOption(widgetsallowedName, {
        processor: 'boolean',
        default: false
    });
};

/**
 * Fetch the requested datavalue
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {object} The value of the audioallowed option
 */
export const getCloudpoodll = (editor) => editor.options.get(cloudpoodllName);


/**
 * Fetch the isAllowed value for this editor instance.
 *
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @param {string} rec_type type one of audio/video/screen/widgets
 * @returns {object} The value of the audioallowed option
 */
export const isAllowed = function(editor,rec_type) {
    switch(rec_type){
        case 'audio':
            return editor.options.get(audioallowedName);
        case 'video':
            return editor.options.get(videoallowedName);
        case 'screen':
            return editor.options.get(screenallowedName);
        case 'widgets':
            return editor.options.get(widgetsallowedName);
        default:
            false;
    }
}
