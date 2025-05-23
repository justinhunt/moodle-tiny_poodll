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
        $cloudpoodll =[];
        $cloudpoodll['cp_expiredays'] = $config->expiredays;
        $cloudpoodll['cp_cansubtitle'] = $cansubtitle;
        $cloudpoodll['cp_token'] = utils::fetch_token($config->apiuser, $config->apisecret);
        $cloudpoodll['cp_region'] = $config->awsregion;
        $cloudpoodll['cp_language'] = $config->language;
        $cloudpoodll['cp_expiredays'] = $config->expiredays;
        $cloudpoodll['cp_transcode'] = $config->transcode;
        $cloudpoodll['cp_audioskin'] = $config->audioskin;
        $cloudpoodll['cp_videoskin'] = $config->videoskin;
        $cloudpoodll['cp_fallback'] = $config->fallback;
        $cloudpoodll['cp_cloudpoodllurl'] = utils::get_cloud_poodll_server();
        $cloudpoodll['cp_owner'] = hash('md5',$USER->username);

        //insert method
        $cloudpoodll['insertmethod'] = $config->insertmethod;
        $cloudpoodll['subtitleaudiobydefault'] = $config->subtitleaudiobydefault;
        $cloudpoodll['subtitlevideobydefault'] = $config->subtitlevideobydefault;

        //add our disabled param
        $cloudpoodll['disabled'] = $disabled;

        $cloudpoodll['filetitle_displaylength'] = constants::FILETITLE_DISPLAYLENGTH;

        //showhistory or not
        $cloudpoodll['showhistory'] =  $canhistory;
        //showoptions or not
        $cloudpoodll['showoptions'] =  $canoptions;
        //showupload or not
        $cloudpoodll['showupload'] =  $canupload;
        //expire days
        $cloudpoodll['showexpiredays'] =  $canexpiredays;


        // If the poodle filter plugin is installed and enabled, add widgets to the toolbar.
        $poodllconfig = get_config('filter_poodll');
        if ($poodllconfig->version) {
            $recorders[] = 'widgets';
            $widgets = self::get_widgets_for_js();
            $cloudpoodll['widgets'] = $widgets;
        }

        $params['cloudpoodll'] = $cloudpoodll;

        //add icons to editor if the permissions and settings are all ok
        $recorders = array('audio', 'video','screen','widgets');



        foreach ($recorders as $recorder) {
            $enablemedia = get_config(constants::M_COMPONENT, 'enable' . $recorder);
            if ($enablemedia && has_capability('tiny/poodll:allow' . $recorder, $context)) {
                $params[$recorder .'allowed'] = true;
            }else{
                $params[$recorder .'allowed'] = false;
            }
        }
        return  $params;
    }

    /**
     * Return the js params required for this module.
     *
     * @return array of additional params to pass to javascript init function for this module.
     */
    private static function get_widgets_for_js() {
        global $USER, $COURSE;

        //init our return value
        $widgets=[];
        //generico specific
        $templates = get_object_vars(get_config('filter_poodll'));

        //get the no. of templates
        if (!array_key_exists('templatecount', $templates)) {
            $templatecount = \filter_poodll\filtertools::FILTER_POODLL_TEMPLATE_COUNT + 1;
        } else {
            $templatecount = $templates['templatecount'] + 1;
        }
        //put our template into a form thats easy to process in JS
        for ($tempindex = 1; $tempindex < $templatecount; $tempindex++) {
            if (empty($templates['template_' . $tempindex]) &&
                empty($templates['templatescript_' . $tempindex]) &&
                empty($templates['templatestyle_' . $tempindex])
            ) {
                continue;
            }

            //make sure its to be shown in TinyMCE (we use the old atto setting, so we can be backwards compat.)
            if (!$templates['template_showatto_' . $tempindex]) {
                continue;
            }
            $widget = new \stdClass();

            //stash the key and name for this template
            $widget->key = $templates['templatekey_' . $tempindex];
            $usename = trim($templates['templatename_' . $tempindex]);
            if ($usename == '') {
                $widget->name = $templates['templatekey_' . $tempindex];
            } else {
                $widget->name = $usename;
            }

            //instructions
            $widget->instructions =$templates['templateinstructions_' . $tempindex];// rawurlencode($templates['templateinstructions_' . $tempindex]);

            //stash the defaults for this template
            $widgetdefaults = self::fetch_widget_properties($templates['templatedefaults_' . $tempindex]);

            //NB each of the $allvariables contains an array of variables (not a string)
            //there might be duplicates where the variable is used multiple times in a template
            //se we uniqu'ify it. That makes it look complicated. But we are just removing doubles
            $allvariables = self::fetch_widget_variables($templates['template_' . $tempindex] .
                $templates['templatescript_' . $tempindex] . $templates['datasetvars_' . $tempindex]);
            $uniquevariables = array_unique($allvariables);
            $usevariables = array();

            //we need to reallocate array keys if the array size was changed in unique'ifying it
            //we also take the opportunity to remove user variables, since they aren't needed here.
            //NB DATASET can be referred to without the :
            while (count($uniquevariables) > 0) {
                $tempvar = array_shift($uniquevariables);
                if (strpos($tempvar, 'COURSE:') === false
                    && strpos($tempvar, 'USER:') === false
                    && strpos($tempvar, 'DATASET:') === false
                    && strpos($tempvar, 'URLPARAM:') === false
                    && strpos($tempvar, 'STRING:') === false
                    && $tempvar != 'MOODLEPAGEID'
                    && $tempvar != 'WWWROOT'
                    && $tempvar != 'AUTOID'
                    && $tempvar != 'CLOUDPOODLLTOKEN') {
                    $usevariables[] = $tempvar;
                }
            }
            $widget->variables =[];
            foreach($usevariables as $var){
                $default = isset($widgetdefaults[$var]) ? $widgetdefaults[$var] : '';
                $isarray=false;
                if(strpos($default,'|')) {
                    $default = explode('|', $default);
                    $isarray=true;
                }
                $display_name = str_replace('_',' ',$var);
                $display_name = str_replace('-',' ',$display_name);
                $display_name =ucwords($display_name);
                $widget->variables[] = ['key'=>$var,'default'=>$default, 'isarray'=>$isarray, 'displayname'=>$display_name];
            }

            //set the template index so we can find it easily later.
            $widget->templateindex = $tempindex;


            $widget->end = !empty($templates['templateend_' . $tempindex]) ? $templates['templateend_' . $tempindex] : false;
            $widgets[]=$widget;
        }

        return $widgets;
    }
    /**
     * Return an array of variable names
     *
     * @param string template containing @@variable@@ variables
     * @return array of variable names parsed from template string
     */
    private static function fetch_widget_variables($template) {
        $matches = array();
        $t = preg_match_all('/@@(.*?)@@/s', $template, $matches);
        if (count($matches) > 1) {
            return ($matches[1]);
        } else {
            return array();
        }
    }

   private static function fetch_widget_properties($propstring) {
        //Now we just have our properties string
        //Lets run our regular expression over them
        //string should be property=value,property=value
        //got this regexp from http://stackoverflow.com/questions/168171/regular-expression-for-parsing-name-value-pairs
        $regexpression = '/([^=,]*)=("[^"]*"|[^,"]*)/';
        $matches = array();

        //here we match the filter string and split into name array (matches[1]) and value array (matches[2])
        //we then add those to a name value array.
        $itemprops = array();
        if (preg_match_all($regexpression, $propstring, $matches, PREG_PATTERN_ORDER)) {
            $propscount = count($matches[1]);
            for ($cnt = 0; $cnt < $propscount; $cnt++) {
                // echo $matches[1][$cnt] . "=" . $matches[2][$cnt] . " ";
                $newvalue = $matches[2][$cnt];
                //this could be done better, I am sure. WE are removing the quotes from start and end
                //this wil however remove multiple quotes id they exist at start and end. NG really
                $newvalue = trim($newvalue, '"');
                $itemprops[trim($matches[1][$cnt])] = $newvalue;
            }
        }
        return $itemprops;
    }
}
