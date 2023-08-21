<?php
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
 * TinyMCE text editor Poodll  integration.
 *
 * @package    tiny_poodll
 * @copyright  2023 Justin Hunt <poodllsupport@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

use tiny_poodll\constants;
use tiny_poodll\utils;
use core\output\inplace_editable;

/**
 * Return the js params required for this module.
 *
 * @return array of additional params to pass to javascript init function for this module.
 */
function xxxxtiny_poodll_widgets_params_for_js() {
    global $USER, $COURSE;

    //generico specific
    $templates = get_object_vars(get_config('filter_poodll'));

    $instructions = array();
    $names = array();
    $keys = array();
    $variables = array();
    $defaults = array();
    $ends = array();

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

        //make sure its to be shown in Tiny (we use the old Atto setting so we can be backwards compat.)
        if (!$templates['template_showatto_' . $tempindex]) {
            continue;
        }

        //stash the key and name for this template
        $keys[] = $templates['templatekey_' . $tempindex];
        $usename = trim($templates['templatename_' . $tempindex]);
        if ($usename == '') {
            $names[] = $templates['templatekey_' . $tempindex];
        } else {
            $names[] = $usename;
        }

        //instructions
        //stash the instructions for this template
        $instructions[] = rawurlencode($templates['templateinstructions_' . $tempindex]);

        //NB each of the $allvariables contains an array of variables (not a string)
        //there might be duplicates where the variable is used multiple times in a template
        //se we uniqu'ify it. That makes it look complicated. But we are just removing doubles
        $allvariables = tiny_poodll_widgets_fetch_variables($templates['template_' . $tempindex] .
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
        $variables[] = $usevariables;

        //stash the defaults for this template
        //$defaults[] = $templates['templatedefaults_' . $tempindex];
        $defaults[] = tiny_poodll_widgets_fetch_filter_properties($templates['templatedefaults_' . $tempindex]);

        $ends[] = $templates['templateend_' . $tempindex];
    }

    //config our array of data
    $params['keys'] = $keys;
    $params['names'] = $names;
    $params['instructions'] = $instructions;
    $params['variables'] = $variables;
    $params['defaults'] = $defaults;
    $params['ends'] = $ends;

    return $params;
}
/**
 * Return an array of variable names
 *
 * @param string template containing @@variable@@ variables
 * @return array of variable names parsed from template string
 */
function xxxxtiny_poodll_widgets_fetch_variables($template) {
    $matches = array();
    $t = preg_match_all('/@@(.*?)@@/s', $template, $matches);
    if (count($matches) > 1) {
        return ($matches[1]);
    } else {
        return array();
    }
}

function xxxtiny_poodll_widgets_fetch_filter_properties($propstring) {
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



function tiny_poodll_inplace_editable($itemtype, $itemid, $newvalue) {
    if ($itemtype === 'filetitle') {
        global $DB, $USER;
        $record = $DB->get_record(constants::M_TABLE, array('id' => $itemid), '*', MUST_EXIST);
        \core_external\external_api::validate_context(context_system::instance());
        require_capability('tiny/poodll:visible', context_system::instance());
        $newvalue = clean_param($newvalue, PARAM_TEXT);

        $updateditem = new stdClass();
        $updateditem->id = $itemid;
        $updateditem->filetitle = $newvalue;
        $updateditem->dateofchange = time();
        $updateditem->userofchange = $USER->id;

        $history = new tiny_poodll\history();
        $history->update($updateditem);

        $record->name = $newvalue;
        return new inplace_editable('tiny_poodll',
            'filetitle',
            $itemid,
            true,
            shorten_text(format_string($newvalue), constants::FILETITLE_DISPLAYLENGTH),
            $newvalue,
            'Edit file DISPLAY title',
            'New value for ' . format_string($newvalue)
        );
    }
    return true;
}