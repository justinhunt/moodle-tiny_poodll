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
import Modal from './modal';
import ModalRegistry from 'core/modal_registry';
import * as ModalFactory from 'core/modal_factory';
import {component, SKIN} from "./common";
import * as Templates from 'core/templates';
import Log from 'core/log';


export default class Video extends BaseClass {

    static fetchRecorderDimensions(config) {

        // Get return object
        var sizes = {};
        switch (config.videoskin) {
            case SKIN.ONETWOTHREE:
                sizes.videowidth = 441; //(because the @media CSS is for <=440)
                sizes.videoheight = 540;
                break;
            case SKIN.BMR:
                sizes.videowidth = 441; //(because the @media CSS is for <=440)
                sizes.videoheight = 500;
                break;
            default:
                sizes.videowidth = 441;
                sizes.videoheight = 450;

        }
        return sizes;
    }

    static getModalContext(editor) {
        var tc = super.getModalContext(editor);
        tc.isvideo=true;
        tc.recorder = 'video'; //(audio or video or screen)

        if(tc.subtitlevideobydefault){
            tc.subtitling=true;
        }else{
            tc.subtitling=false;
        }
        return tc;
    }


    /**
     * Creates the media html5 tags based on the recorder type.
     *
     * @method fetchMediaTags
     * @param  mediaurl media URL to the AWS object
     * @param  mediafilename File name of the AWS object
     * @param  sourceurl URL to the AWS object
     * @param  sourcemimetype MimeType of the AWS object
     * @private
     */
    fetchMediaTags(mediaurl, mediafilename, sourceurl, sourcemimetype) {
        var context = {};
        context.url = mediaurl;
        context.name = mediafilename;
        context.issubtitling = this.config.subtitling && this.config.subtitling !== '0';
        context.includesourcetrack = this.config.transcoding && (mediaurl !== sourceurl) && (sourceurl.slice(-3) !== 'wav') && (sourceurl !== false);
        context.CP = this.config.CP;
        context.subtitleurl = mediaurl + '.vtt';
        context.sourceurl = sourceurl;
        context.sourcemimetype = sourcemimetype;
        context.poster = false;
        if (this.config.transcoding) {
            context.urlmimetype = 'video/mp4';
        } else {
            context.urlmimetype = sourcemimetype;
        }

        return Templates.renderForPromise(
            'tiny_poodll/videoplayer',
            context
        );
    }
}
