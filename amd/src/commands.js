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
    widgetsMenuItemName,
    icon,
} from './common';

/**
 * Handle the action for your plugin.
 * @param {TinyMCE.editor} editor The tinyMCE editor instance.
 */
const handleAction = (editor) => {
    // TODO Handle the action.
    window.console.log(editor);
};

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
        buttonImage,
    ] = await Promise.all([
        getString('button_recaudio', component),
        getString('button_recvideo', component),
        getString('button_recscreen', component),
        getString('button_widgets', component),
        getString('menuitem_recaudio', component),
        getString('menuitem_recvideo', component),
        getString('menuitem_recscreen', component),
        getString('menuitem_widgets', component),
        getButtonImage('icon', component),
    ]);

    return (editor) => {
        // Register the Moodle SVG as an icon suitable for use as a TinyMCE toolbar button.
        editor.ui.registry.addIcon(icon, buttonImage.html);

        // Register the recaudio Toolbar Button.
        editor.ui.registry.addButton(recaudioButtonName, {
            icon,
            tooltip: recaudioButtonNameTitle,
            onAction: () => handleAction(editor),
        });
        // Register the recvideo Toolbar Button.
        editor.ui.registry.addButton(recvideoButtonName, {
            icon,
            tooltip: recvideoButtonNameTitle,
            onAction: () => handleAction(editor),
        });
        // Register the recscreen Toolbar Button.
        editor.ui.registry.addButton(recscreenButtonName, {
            icon,
            tooltip: recscreenButtonNameTitle,
            onAction: () => handleAction(editor),
        });
        // Register the widgets Toolbar Button.
        editor.ui.registry.addButton(widgetsButtonName, {
            icon,
            tooltip: widgetsButtonNameTitle,
            onAction: () => handleAction(editor),
        });

        // Add the recaudio Menu Item.
        // This allows it to be added to a standard menu, or a context menu.
        editor.ui.registry.addMenuItem(recaudioMenuItemName, {
            icon,
            text: recaudioMenuItemNameTitle,
            onAction: () => handleAction(editor),
        });

        // Add the recvideo Menu Item.
        // This allows it to be added to a standard menu, or a context menu.
        editor.ui.registry.addMenuItem(recvideoMenuItemName, {
            icon,
            text: recvideoMenuItemNameTitle,
            onAction: () => handleAction(editor),
        });

        // Add the recscreen Menu Item.
        // This allows it to be added to a standard menu, or a context menu.
        editor.ui.registry.addMenuItem(recscreenMenuItemName, {
            icon,
            text: recscreenMenuItemNameTitle,
            onAction: () => handleAction(editor),
        });

        // Add the widgets Menu Item.
        // This allows it to be added to a standard menu, or a context menu.
        editor.ui.registry.addMenuItem(widgetsMenuItemName, {
            icon,
            text: widgetsMenuItemNameTitle,
            onAction: () => handleAction(editor),
        });
    };
};
