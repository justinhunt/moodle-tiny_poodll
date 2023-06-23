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
use editor_tiny\editor;
use editor_tiny\plugin;
use editor_tiny\plugin_with_buttons;
use editor_tiny\plugin_with_menuitems;
use editor_tiny\plugin_with_configuration;

class plugininfo extends plugin implements plugin_with_configuration, plugin_with_buttons, plugin_with_menuitems {

    /**
     * Whether the plugin is enabled
     *
     * @param context $context The context that the editor is used within
     * @param array $options The options passed in when requesting the editor
     * @param array $fpoptions The filepicker options passed in when requesting the editor
     * @param editor $editor The editor instance in which the plugin is initialised
     * @return boolean
     */
    public static function is_enabled(
        context $context,
        array $options,
        array $fpoptions,
        ?editor $editor = null
    ): bool {
        global $COURSE;
        //coursecontext

        if (!$context) {
            $context = \context_course::instance($COURSE->id);
        }

        //If they have permission, lets go!!
        return has_capability('tiny/poodll:visible', $context);
    }


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

        global $COURSE,$USER;

        $config = get_config(constants::M_COMPONENT);

        //coursecontext
        $context = $options['context'];
        if (!$context) {
            $context = \context_course::instance($COURSE->id);
        }
        $disabled = false;

        //If they don't have permission don't show it
        if (!has_capability('tiny/poodll:visible', $context)) {
            $disabled = true;
        }

        //subitling ok
        $cansubtitle = utils::can_transcribe($config) &&
            $config->enablesubtitling &&
            has_capability('tiny/poodll:allowsubtitling', $context);

        //expire days
        $canexpiredays = has_capability('tiny/poodll:allowexpiredays', $context);

        //upload
        $canupload =  $config->showupload && has_capability('tiny/poodll:allowupload', $context);

        //history
        $canhistory = $config->showhistory && has_capability('tiny/poodll:allowhistory', $context);

        //options
        $canoptions = $config->showoptions && has_capability('tiny/poodll:allowoptions', $context);

        //cloudpoodll params
        $params['cp_expiredays'] = $config->expiredays;
        $params['cp_cansubtitle'] = $cansubtitle;
        $params['cp_token'] = utils::fetch_token($config->apiuser, $config->apisecret);
        $params['cp_region'] = $config->awsregion;
        $params['cp_language'] = $config->language;
        $params['cp_expiredays'] = $config->expiredays;
        $params['cp_transcode'] = $config->transcode;
        $params['cp_audioskin'] = $config->audioskin;
        $params['cp_videoskin'] = $config->videoskin;
        $params['cp_fallback'] = $config->fallback;
        $params['cp_owner'] = hash('md5',$USER->username);

        //insert method
        $params['insertmethod'] = $config->insertmethod;
        $params['subtitleaudiobydefault'] = $config->subtitleaudiobydefault;
        $params['subtitlevideobydefault'] = $config->subtitlevideobydefault;

        //add our disabled param
        $params['disabled'] = $disabled;

        $params['filetitle_displaylength'] = constants::FILETITLE_DISPLAYLENGTH;

        //showhistory or not
        $params['showhistory'] =  $canhistory;
        //showoptions or not
        $params['showoptions'] =  $canoptions;
        //showupload or not
        $params['showupload'] =  $canupload;
        //expire days
        $params['showexpiredays'] =  $canexpiredays;

        //add icons to editor if the permissions and settings are all ok
        $recorders = array('audio', 'video','screen','widgets');

        // If the poodle filter plugin is installed and enabled, add widgets to the toolbar.
        /*
        $poodllconfig = get_config('filter_poodll');
        if ($poodllconfig->version) {
            $recorders[] = 'widgets';

            $widgetparams = atto_cloudpoodll_widgets_params_for_js();
            $params['keys'] = $widgetparams['keys'];
            $params['names'] = $widgetparams['names'];
            $params['instructions'] = $widgetparams['instructions'];
            $params['defaults'] = $widgetparams['defaults'];
            $params['variables'] = $widgetparams['variables'];
            $params['ends'] = $widgetparams['ends'];
        }
        */

        foreach ($recorders as $recorder) {
            $enablemedia = get_config(constants::M_COMPONENT, 'enable' . $recorder);
            if ($enablemedia && has_capability('tiny/poodll:allow' . $recorder, $context)) {
                $params[$recorder .'allowed'] = true;
            }else{
                $params[$recorder .'allowed'] = false;
            }
        }
        return $params;
    }
}
