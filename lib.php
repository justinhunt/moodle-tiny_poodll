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