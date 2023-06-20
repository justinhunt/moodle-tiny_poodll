<?php
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
 * Tiny Poodll for TinyMCE plugin for Moodle.
 *
 * @package     tiny_poodll
 * @copyright   2023 Justin Hunt <justin@poodll.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace tiny_poodll;

use context;
use editor_tiny\plugin;
use editor_tiny\plugin_with_buttons;
use editor_tiny\plugin_with_menuitems;
use editor_tiny\plugin_with_configuration;

class plugininfo extends plugin implements plugin_with_configuration, plugin_with_buttons, plugin_with_menuitems {

    public static function get_available_buttons(): array {
        return [
            'tiny_poodll/plugin',
        ];
    }

    public static function get_available_menuitems(): array {
        return [
            'tiny_poodll/plugin',
        ];
    }

    public static function get_plugin_configuration_for_context(
        context $context,
        array $options,
        array $fpoptions,
        ?\editor_tiny\editor $editor = null
    ): array {
        return [
            // Your values go here.
            // These will be mapped to a namespaced EditorOption in Tiny.
            'cp_cansubtitle' => 'TODO Calculate your values here',
            'cp_token' => 'TODO Calculate your values here',
            'cp_region' => 'TODO Calculate your values here',
            'cp_expiredays' => 'TODO Calculate your values here',
            'cp_language' => 'TODO Calculate your values here',
            'cp_transcode' => 'TODO Calculate your values here',
            'cp_audioskin' => 'TODO Calculate your values here',
            'cp_videoskin' => 'TODO Calculate your values here',
            'cp_fallback' => 'TODO Calculate your values here',
            'cp_owner' => 'TODO Calculate your values here',
            'subtitleaudiobydefault' => 'TODO Calculate your values here',
            'subtitlevideobydefault' => 'TODO Calculate your values here',
            'disabled' => 'TODO Calculate your values here',
            'filetitle_displaylength' => 'TODO Calculate your values here',
            'showhistory' => 'TODO Calculate your values here',
            'showoptions' => 'TODO Calculate your values here',
            'showupload' => 'TODO Calculate your values here',
            'showexpiredays' => 'TODO Calculate your values here',
        ];
    }
}
