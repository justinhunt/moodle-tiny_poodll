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
 * Commands helper for the Moodle tiny_poodll plugin.
 *
 * @module      plugintype_pluginname/commands
 * @copyright   2023 Justin Hunt <justin@poodll.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getButtonImage} from 'editor_tiny/utils';
import {get_string as getString} from 'core/str';
import {
    component,
    recaudioButtonName,
    recvideoButtonName,
    recscreenButtonName,
    widgetsButtonName,
    recaudioMenuItemName,
    recvideoMenuItemName,
    recscreenMenuItemName,
    widgetsMenuItemName
} from './common';
import {isAllowed} from './options';
import audio_recorder from './audio_recorder';
import video_recorder from './video_recorder';
import screen_recorder from './screen_recorder';
import widget_selector from './widget_selector';


/**
 * Get the setup function for the buttons.
 *
 * This is performed in an async function which ultimately returns the registration function as the
 * Tiny.AddOnManager.Add() function does not support async functions.
 *
 * @returns {function} The registration function to call within the Plugin.add function.
 */
export const getSetup = async() => {
    const [
        recaudioButtonNameTitle,
        recvideoButtonNameTitle,
        recscreenButtonNameTitle,
        widgetsButtonNameTitle,
        recaudioMenuItemNameTitle,
        recvideoMenuItemNameTitle,
        recscreenMenuItemNameTitle,
        widgetsMenuItemNameTitle,
        audioIcon,
        videoIcon,
        screenIcon,
        widgetsIcon,
    ] = await Promise.all([
        getString('button_recaudio', component),
        getString('button_recvideo', component),
        getString('button_recscreen', component),
        getString('button_widgets', component),
        getString('menuitem_recaudio', component),
        getString('menuitem_recvideo', component),
        getString('menuitem_recscreen', component),
        getString('menuitem_widgets', component),
        getButtonImage('audio', component),
        getButtonImage('video', component),
        getButtonImage('screen', component),
        getButtonImage('widgets', component),
    ]);

    return (editor) => {
        // Register the TinyMCE toolbar button.
        editor.ui.registry.addIcon('audioicon', audioIcon.html);
        editor.ui.registry.addIcon('videoicon', videoIcon.html);
        editor.ui.registry.addIcon('screenicon', screenIcon.html);
        editor.ui.registry.addIcon('widgetsicon', widgetsIcon.html);

        // Register the recaudio Toolbar Button.
        if(isAllowed(editor,'audio')) {
            editor.ui.registry.addButton(recaudioButtonName, {
                icon: 'audioicon',
                tooltip: recaudioButtonNameTitle,
                onAction: () => audio_recorder.display(editor),
            });

            // Add the recaudio Menu Item.
            // This allows it to be added to a standard menu, or a context menu.
            editor.ui.registry.addMenuItem(recaudioMenuItemName, {
                icon:  'audioicon',
                text: recaudioMenuItemNameTitle,
                onAction: () => audio_recorder.display(editor),
            });

        }
        // Register the recvideo Toolbar Button.
        if(isAllowed(editor,'video')) {
            editor.ui.registry.addButton(recvideoButtonName, {
                icon: 'videoicon',
                tooltip: recvideoButtonNameTitle,
                onAction: () => video_recorder.display(editor),
            });

            // Add the recvideo Menu Item.
            // This allows it to be added to a standard menu, or a context menu.
            editor.ui.registry.addMenuItem(recvideoMenuItemName, {
                icon: 'videoicon',
                text: recvideoMenuItemNameTitle,
                onAction: () => video_recorder.display(editor),
            });
        }
        // Register the recscreen Toolbar Button.
        if(isAllowed(editor,'screen')) {
            editor.ui.registry.addButton(recscreenButtonName, {
                icon: 'screenicon',
                tooltip: recscreenButtonNameTitle,
                onAction: () => screen_recorder.display(editor),
            });

            // Add the recscreen Menu Item.
            // This allows it to be added to a standard menu, or a context menu.
            editor.ui.registry.addMenuItem(recscreenMenuItemName, {
                icon: 'screenicon',
                text: recscreenMenuItemNameTitle,
                onAction: () => screen_recorder.display(editor),
            });
        }
        // Register the widgets Toolbar Button.
        if(isAllowed(editor,'widgets')) {
            editor.ui.registry.addButton(widgetsButtonName, {
                icon: 'widgetsicon',
                tooltip: widgetsButtonNameTitle,
                onAction: () => widget_selector.display(editor),
            });

            // Add the widgets Menu Item.
            // This allows it to be added to a standard menu, or a context menu.
            editor.ui.registry.addMenuItem(widgetsMenuItemName, {
                icon: 'widgetsicon',
                text: widgetsMenuItemNameTitle,
                onAction: () => widget_selector.display(editor),
            });

        }
    };
};
