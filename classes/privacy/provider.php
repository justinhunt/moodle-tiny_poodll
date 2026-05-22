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

namespace tiny_poodll\privacy;

use core_privacy\local\metadata\collection;
use core_privacy\local\request\approved_contextlist;
use core_privacy\local\request\approved_userlist;
use core_privacy\local\request\contextlist;
use core_privacy\local\request\userlist;
use core_privacy\local\request\writer;

/**
 * Privacy API implementation for the Poodll for TinyMCE plugin.
 *
 * @package     tiny_poodll
 * @category    privacy
 * @copyright   2023 Justin Hunt <justin@poodll.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class provider implements
    \core_privacy\local\metadata\provider,
    \core_privacy\local\request\plugin\provider,
    \core_privacy\local\request\core_userlist_provider {

    /**
     * Return metadata about this plugin's data stores.
     *
     * @param collection $collection The initialised collection to add items to.
     * @return collection
     */
    public static function get_metadata(collection $collection): collection {
        $collection->add_database_table('tiny_poodll_history', [
            'userid' => 'privacy:metadata:tiny_poodll_history:userid',
            'courseid' => 'privacy:metadata:tiny_poodll_history:courseid',
            'filetitle' => 'privacy:metadata:tiny_poodll_history:filetitle',
            'recordertype' => 'privacy:metadata:tiny_poodll_history:recordertype',
            'mediafilename' => 'privacy:metadata:tiny_poodll_history:mediafilename',
            'mediaurl' => 'privacy:metadata:tiny_poodll_history:mediaurl',
            'sourceurl' => 'privacy:metadata:tiny_poodll_history:sourceurl',
            'sourcemimetype' => 'privacy:metadata:tiny_poodll_history:sourcemimetype',
            'subtitling' => 'privacy:metadata:tiny_poodll_history:subtitling',
            'subtitleurl' => 'privacy:metadata:tiny_poodll_history:subtitleurl',
            'language' => 'privacy:metadata:tiny_poodll_history:language',
            'archived' => 'privacy:metadata:tiny_poodll_history:archived',
            'dateofentry' => 'privacy:metadata:tiny_poodll_history:dateofentry',
            'userofentry' => 'privacy:metadata:tiny_poodll_history:userofentry',
            'dateofchange' => 'privacy:metadata:tiny_poodll_history:dateofchange',
            'userofchange' => 'privacy:metadata:tiny_poodll_history:userofchange',
        ], 'privacy:metadata:tiny_poodll_history');

        $collection->add_external_location_link('cloudpoodll', [
            'userid' => 'privacy:metadata:external:userid',
            'mediafilename' => 'privacy:metadata:external:mediafilename',
            'mediaurl' => 'privacy:metadata:external:mediaurl',
        ], 'privacy:metadata:external');

        return $collection;
    }

    /**
     * Get the list of contexts that contain user information for the specified user.
     *
     * @param int $userid The user to search.
     * @return contextlist
     */
    public static function get_contexts_for_userid(int $userid): contextlist {
        $contextlist = new contextlist();

        $sql = "SELECT ctx.id
                  FROM {tiny_poodll_history} tph
                  JOIN {context} ctx
                    ON ctx.instanceid = tph.courseid
                   AND ctx.contextlevel = :contextcourse
                 WHERE tph.userid = :userid
                    OR tph.userofentry = :userofentry
                    OR tph.userofchange = :userofchange";
        $params = [
            'contextcourse' => CONTEXT_COURSE,
            'userid' => $userid,
            'userofentry' => $userid,
            'userofchange' => $userid,
        ];

        $contextlist->add_from_sql($sql, $params);
        return $contextlist;
    }

    /**
     * Get the list of users who have data within a context.
     *
     * @param userlist $userlist The userlist containing the list of users who have data in this context/plugin combination.
     */
    public static function get_users_in_context(userlist $userlist) {
        $context = $userlist->get_context();
        if (!$context instanceof \context_course) {
            return;
        }

        $sql = "SELECT tph.userid
                  FROM {tiny_poodll_history} tph
                 WHERE tph.courseid = :courseid
              GROUP BY tph.userid";
        $params = ['courseid' => $context->instanceid];
        $userlist->add_from_sql('userid', $sql, $params);

        $sql = "SELECT tph.userofentry
                  FROM {tiny_poodll_history} tph
                 WHERE tph.courseid = :courseid
              GROUP BY tph.userofentry";
        $userlist->add_from_sql('userofentry', $sql, $params);

        $sql = "SELECT tph.userofchange
                  FROM {tiny_poodll_history} tph
                 WHERE tph.courseid = :courseid
                   AND tph.userofchange IS NOT NULL
              GROUP BY tph.userofchange";
        $userlist->add_from_sql('userofchange', $sql, $params);
    }

    /**
     * Export all user data for the specified user, in the specified contexts.
     *
     * @param approved_contextlist $contextlist The approved contexts to export information for.
     */
    public static function export_user_data(approved_contextlist $contextlist) {
        global $DB;

        if (!$contextlist->count()) {
            return;
        }

        $user = $contextlist->get_user();
        $courseids = [];
        foreach ($contextlist->get_contexts() as $context) {
            if ($context instanceof \context_course) {
                $courseids[] = $context->instanceid;
            }
        }

        if (empty($courseids)) {
            return;
        }

        [$courseidsql, $courseparams] = $DB->get_in_or_equal($courseids, SQL_PARAMS_NAMED);
        $params = [
            'userid' => $user->id,
            'userofentry' => $user->id,
            'userofchange' => $user->id,
        ] + $courseparams;

        $sql = "SELECT *
                  FROM {tiny_poodll_history}
                 WHERE courseid {$courseidsql}
                   AND (userid = :userid OR userofentry = :userofentry OR userofchange = :userofchange)
              ORDER BY id";

        $records = $DB->get_records_sql($sql, $params);
        foreach ($records as $record) {
            $context = \context_course::instance($record->courseid);
            writer::with_context($context)->export_data([
                get_string('pluginname', 'tiny_poodll'),
                'history',
                $record->id,
            ], (object) [
                'filetitle' => $record->filetitle,
                'recordertype' => $record->recordertype,
                'mediafilename' => $record->mediafilename,
                'mediaurl' => $record->mediaurl,
                'sourceurl' => $record->sourceurl,
                'sourcemimetype' => $record->sourcemimetype,
                'subtitling' => $record->subtitling,
                'subtitleurl' => $record->subtitleurl,
                'language' => $record->language,
                'archived' => $record->archived,
                'dateofentry' => \core_privacy\local\request\transform::datetime($record->dateofentry),
                'dateofchange' => \core_privacy\local\request\transform::datetime($record->dateofchange),
                'userid' => $record->userid,
                'userofentry' => $record->userofentry,
                'userofchange' => $record->userofchange,
            ]);
        }
    }

    /**
     * Delete all user data for all users in the specified context.
     *
     * @param \context $context The context to delete data from.
     */
    public static function delete_data_for_all_users_in_context(\context $context) {
        global $DB;

        if (!$context instanceof \context_course) {
            return;
        }

        $DB->delete_records('tiny_poodll_history', ['courseid' => $context->instanceid]);
    }

    /**
     * Delete all user data for the specified user, in the supplied contexts.
     *
     * @param approved_contextlist $contextlist The approved contexts and user information to delete information for.
     */
    public static function delete_data_for_user(approved_contextlist $contextlist) {
        global $DB;

        if (!$contextlist->count()) {
            return;
        }

        $user = $contextlist->get_user();
        $courseids = [];
        foreach ($contextlist->get_contexts() as $context) {
            if ($context instanceof \context_course) {
                $courseids[] = $context->instanceid;
            }
        }

        if (empty($courseids)) {
            return;
        }

        [$courseidsql, $courseparams] = $DB->get_in_or_equal($courseids, SQL_PARAMS_NAMED);
        $params = [
            'userid' => $user->id,
            'userofentry' => $user->id,
            'userofchange' => $user->id,
        ] + $courseparams;

        // Entries owned by, or created by, the user cannot be meaningfully retained.
        $DB->delete_records_select(
            'tiny_poodll_history',
            "courseid {$courseidsql} AND (userid = :userid OR userofentry = :userofentry)",
            $params
        );

        // Preserve records owned by other users, but remove this user's changer attribution.
        $DB->set_field_select(
            'tiny_poodll_history',
            'userofchange',
            null,
            "courseid {$courseidsql} AND userofchange = :userofchange AND userid <> :userid AND userofentry <> :userofentry",
            $params
        );
        $DB->set_field_select(
            'tiny_poodll_history',
            'dateofchange',
            null,
            "courseid {$courseidsql} AND userofchange = :userofchange AND userid <> :userid AND userofentry <> :userofentry",
            $params
        );
    }

    /**
     * Delete multiple users within a single context.
     *
     * @param approved_userlist $userlist The approved context and user information to delete information for.
     */
    public static function delete_data_for_users(approved_userlist $userlist) {
        global $DB;

        $context = $userlist->get_context();
        if (!$context instanceof \context_course) {
            return;
        }

        $userids = $userlist->get_userids();
        if (empty($userids)) {
            return;
        }

        [$useridsql, $userparams] = $DB->get_in_or_equal($userids, SQL_PARAMS_NAMED);
        $params = ['courseid' => $context->instanceid] + $userparams;

        // Entries owned by, or created by, these users cannot be meaningfully retained.
        $DB->delete_records_select(
            'tiny_poodll_history',
            "courseid = :courseid AND (userid {$useridsql} OR userofentry {$useridsql})",
            $params
        );

        // Preserve records owned by other users, but remove changer attribution.
        $DB->set_field_select(
            'tiny_poodll_history',
            'userofchange',
            null,
            "courseid = :courseid AND userofchange {$useridsql} AND userid NOT {$useridsql} AND userofentry NOT {$useridsql}",
            $params
        );
        $DB->set_field_select(
            'tiny_poodll_history',
            'dateofchange',
            null,
            "courseid = :courseid AND userofchange {$useridsql} AND userid NOT {$useridsql} AND userofentry NOT {$useridsql}",
            $params
        );
    }
}
