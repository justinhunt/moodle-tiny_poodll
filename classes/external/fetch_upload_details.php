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

namespace tiny_poodll\external;

use tiny_poodll\constants;
use tiny_poodll\localrecorder\upload_details;
use tiny_poodll\utils;
use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_single_structure;
use core_external\external_value;

/**
 * Gets the S3 upload details for one recording made with the new recorders in the editor.
 *
 * The browser never talks to Cloud Poodll for this. The choices the dialog offers (subtitles, language
 * and how long to keep the recording) come from the browser, so each is checked against the site
 * settings and the user's capabilities in the editor's context.
 *
 * @package    tiny_poodll
 * @copyright  2026 Justin Hunt <justin@poodll.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class fetch_upload_details extends external_api {
    /**
     * Describes the parameters.
     *
     * @return external_function_parameters
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'contextid' => new external_value(PARAM_INT, 'The context of the editor'),
            'mediatype' => new external_value(PARAM_ALPHA, 'audio or video'),
            'subtitle' => new external_value(PARAM_BOOL, 'Whether to make subtitles'),
            'language' => new external_value(PARAM_TEXT, 'The language spoken, for subtitles'),
            'expiredays' => new external_value(PARAM_INT, 'How many days to keep the recording'),
            'sourcemimetype' => new external_value(PARAM_TEXT, 'The mime type of the recorded file'),
        ]);
    }

    /**
     * Gets the upload details for a new recording.
     *
     * @param int $contextid The context of the editor.
     * @param string $mediatype audio or video.
     * @param bool $subtitle Whether to make subtitles.
     * @param string $language The language spoken.
     * @param int $expiredays How many days to keep the recording.
     * @param string $sourcemimetype The mime type of the recorded file.
     * @return array
     */
    public static function execute(
        int $contextid,
        string $mediatype,
        bool $subtitle,
        string $language,
        int $expiredays,
        string $sourcemimetype
    ): array {
        global $CFG, $USER;

        $params = self::validate_parameters(self::execute_parameters(), [
            'contextid' => $contextid,
            'mediatype' => $mediatype,
            'subtitle' => $subtitle,
            'language' => $language,
            'expiredays' => $expiredays,
            'sourcemimetype' => $sourcemimetype,
        ]);

        $context = \context::instance_by_id($params['contextid']);
        self::validate_context($context);

        $config = get_config(constants::M_COMPONENT);
        $mediatype = $params['mediatype'];
        if (
            !in_array($mediatype, [constants::REC_AUDIO, constants::REC_VIDEO]) ||
            empty($config->{'enable' . $mediatype}) ||
            !has_capability('tiny/poodll:visible', $context) ||
            !has_capability('tiny/poodll:allow' . $mediatype, $context)
        ) {
            throw new \moodle_exception('lr_cannotrecord', constants::M_COMPONENT);
        }

        // The same checks the editor makes before it offers each choice.
        $cansubtitle = utils::can_transcribe($config) && !empty($config->enablesubtitling) &&
            has_capability('tiny/poodll:allowsubtitling', $context);
        $subtitle = $params['subtitle'] && $cansubtitle ? 1 : 0;

        $language = $params['language'];
        if (!array_key_exists($language, utils::get_lang_options())) {
            $language = $config->language;
        }

        $expiredays = $config->expiredays;
        if (
            has_capability('tiny/poodll:allowexpiredays', $context) &&
            array_key_exists((string)$params['expiredays'], utils::get_expiredays_options())
        ) {
            $expiredays = $params['expiredays'];
        }

        $token = utils::fetch_token($config->apiuser, $config->apisecret);

        $details = upload_details::fetch(utils::get_cloud_poodll_server(), is_string($token) ? $token : '', [
            'mediatype' => $mediatype,
            'parent' => $CFG->wwwroot,
            'appid' => constants::APPID,
            'owner' => hash('md5', $USER->username),
            'region' => $config->awsregion,
            'expiredays' => $expiredays,
            'transcribe' => $subtitle,
            'subtitle' => $subtitle,
            'language' => $language,
            'vocab' => 'none',
            'sourcemimetype' => $params['sourcemimetype'],
        ]);

        if (!$details['success']) {
            throw new \moodle_exception('lr_uploaddetailsfailed', constants::M_COMPONENT, '', s($details['message']));
        }

        return [
            'posturl' => $details['posturl'],
            'mediaurl' => $details['mediaurl'],
        ];
    }

    /**
     * Describes the return value.
     *
     * @return external_single_structure
     */
    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'posturl' => new external_value(PARAM_RAW, 'The presigned S3 URL to PUT the recording to'),
            'mediaurl' => new external_value(PARAM_URL, 'The URL the converted recording will appear at'),
        ]);
    }
}
