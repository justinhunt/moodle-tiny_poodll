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
 * Tiny Poodll - audio recorder configuration.
 *
 * @module      tiny_poodll/audio_recorder
 * @copyright   2023 Justin Hunt <justin@poodll.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import BaseClass from './base_recorder';
import {component, SKIN} from "./common";
import * as Templates from 'core/templates';


export default class Audio extends BaseClass {

    static fetchRecorderDimensions(config) {

        // Get return object
        var sizes = {};
        switch (config.audioskin) {
            default:
                sizes.audiowidth = 450;
                sizes.audioheight = 350;
                break;
        }
        return sizes;
    }


    static getModalContext(editor) {
        var tc = super.getModalContext(editor);
        tc.isaudio=true;
        tc.recorder = 'audio'; //(audio or video or screen)
        //subtitles
        if(tc.subtitleaudiobydefault==='1'){
            tc.subtitling=true;
        }else{
            tc.subtitling=false;
        }
        //insert method
        tc.mediataginsert = (tc.insertmethod === 'tags');

        return tc;
    }

    /**
     * Creates the media html5 tags based on the recorder type.
     *
     * @method fetchMediaTags
     * @param {string} mediaurl media URL to the AWS object
     * @param {string} mediafilename File name of the AWS object
     * @param {string} sourceurl URL to the AWS object
     * @param {string} sourcemimetype MimeType of the AWS object
     * @private
     */
    fetchMediaTags(mediaurl, mediafilename, sourceurl, sourcemimetype) {
        var context = {};
        context.url = mediaurl;
        context.name = mediafilename;
        context.issubtitling = this.config.subtitling && this.config.subtitling !== '0';
        var includesource = this.config.includesource == "1";
        context.includesourcetrack = includesource && this.config.transcoding && (mediaurl !== sourceurl)
            && (sourceurl.slice(-3) !== 'wav') && (sourceurl !== false);
        context.CP = this.config.CP;
        context.subtitleurl = mediaurl + '.vtt';
        context.sourceurl = sourceurl;
        context.sourcemimetype = sourcemimetype;
        context.poster = false;
        if (this.config.transcoding) {
            context.urlmimetype = 'audio/mp3';
        } else {
            context.urlmimetype = sourcemimetype;
        }
        return Templates.renderForPromise(
            'tiny_poodll/audioplayer',
            context
        );
    }
}
