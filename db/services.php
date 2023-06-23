<?php

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
 * Web service for cloud poodll external functions and service definitions.
 *
 * @package   tiny_poodll
 * @copyright 2023 Justin Hunt {@link http://www.poodll.com}
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

$functions = array(
    'tiny_poodll_history_create' => array(
        'classname' => 'tiny_poodll_history_external',
        'methodname' => 'create_history_item',
        'description' => 'Creates cloud poodll history records.',
        'capabilities' => 'tiny/poodll:allowhistory',
        'type' => 'write',
        'ajax' => true
    ),
    'tiny_poodll_history_archive' => array(
        'classname' => 'tiny_poodll_history_external',
        'methodname' => 'archive_history_item',
        'description' => 'Archives a  poodll history records',
        'capabilities' => 'tiny/poodll:allowhistory',
        'type' => 'write',
        'ajax' => true,
    ),
    'tiny_poodll_history_get_item' => array(
        'classname' => 'tiny_poodll_history_external',
        'methodname' => 'get_history_item',
        'description' => 'Gets a specific cloud poodll history records.',
        'capabilities' => 'tiny/poodll:allowhistory',
        'type' => 'read',
        'ajax' => true,
    ),
    'tiny_poodll_history_get_items' => array(
        'classname' => 'tiny_poodll_history_external',
        'methodname' => 'get_history_items',
        'description' => 'Gets cloud poodll history records.',
        'capabilities' => 'tiny/poodll:allowhistory',
        'type' => 'read',
        'ajax' => true,
    )
);