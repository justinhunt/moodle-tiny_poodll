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
 * Common values helper for the Moodle tiny_poodll plugin.
 *
 * @module      plugintype_pluginname/common
 * @copyright   2023 Justin Hunt <justin@poodll.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

const component = 'tiny_poodll';

export default {
    component,
    pluginName: `${component}/plugin`,
    icon: component,
    recaudioButtonName: `${component}_recaudio`,
    recvideoButtonName: `${component}_recvideo`,
    recscreenButtonName: `${component}_recscreen`,
    widgetsButtonName: `${component}_widgets`,
    recaudioMenuItemName: `${component}_recaudio`,
    recvideoMenuItemName: `${component}_recvideo`,
    recscreenMenuItemName: `${component}_recscreen`,
    widgetsMenuItemName: `${component}_widgets`,
    RECORDERS:  {VIDEO: 'video', AUDIO: 'audio', SCREEN: 'screen', WIDGETS: 'widgets'},
    INSERTMETHOD: {LINK: 'link', TAGS: 'tags'},
    LANGUAGE: {
        ENUS: 'en-US',
        ENGB: 'en-GB',
        ENAU: 'en-AU',
        ENIN: 'en-IN',
        FRCA: 'fr-CA',
        FRFR: 'fr-FR',
        ESUS: 'es-US',
        ESES: 'es-ES',
        ITIT: 'it-IT',
        PTBR: 'pt-BR',
        DEDE: 'de-DE',
        KOKR: 'ko-KR',
        HIIN: 'hi-IN',
        ARAE: 'ar-AE',
        ARSA: 'ar-SA',
        ZHCN: 'zh-CN',
        NLNL: 'nl-NL',
        ENIE: 'en-IE',
        ENWL: 'en-WL',
        ENAB: 'en-AB',
        FAIR: 'fa-IR',
        DECH: 'de-CH',
        HEIL: 'he-IL',
        IDID: 'id-ID',
        JAJP: 'ja-JP',
        MSMY: 'ms-MY',
        PTPT: 'pt-PT',
        RURU: 'ru-RU',
        TAIN: 'ta-IN',
        TEIN: 'te-IN',
        TRTR: 'tr-TR'
    },
    CLOUDPOODLL: {},
    SKIN: {
        PLAIN: 'standard',
        BMR: 'bmr',
        ONETWOTHREE: 'onetwothree',
        FRESH: 'fresh',
        ONCE: 'once',
        SCREEN: 'screen'
    },
    CSS: {
        VIDEO: `${component}_video`,
        AUDIO: `${component}_audio`,
        WIDGETS: `${component}_audio`,
        UPLOAD: `${component}_upload`,
        SUBTITLE: `${component}_subtitle`,
        OPTIONS: `${component}_options`,
        HISTORY: `${component}_history`,
        SCREEN: `${component}_screen`,
        LANG_SELECT: `${component}_languageselect`,
        EXPIREDAYS_SELECT: `${component}_expiredaysselect`,
        SUBTITLE_CHECKBOX: `${component}_subtitle_checkbox`,
        MEDIAINSERT_CHECKBOX: `${component}_mediainsert_checkbox`,
        BLAHBLAH_FORM: `${component}_form`,
        CP_VIDEO: `${component}_video_cont`,
        CP_SCREEN: `${component}_screen_cont`,
        CP_AUDIO: `${component}_audio_cont`,
        CP_UPLOAD: `${component}_upload_cont`,
        CP_SWAP: `${component}_swapmeout`,
        TEMPLATEVARIABLE: `${component}_templatevariable`
    },

   TEMPLATES :{
        HTML_MEDIA: {
            VIDEO: '' +
                '&nbsp;<video ' +
                'controls="true" crossorigin="anonymous"  controlsList="nodownload" preload="metadata" style="width: 100%; max-width: 800px;"' +
                '>' +
                "{{#if includesourcetrack}}" +
                '<source src="{{sourceurl}}" type="{{sourcemimetype}}">' +
                "{{/if}}" +
                '<source src="{{url}}" type="{{urlmimetype}}">' +
                "{{#if issubtitling}}" +
                '<track src="{{subtitleurl}}" kind="captions" srclang="{{CP.language}}" label="{{CP.language}}" default="true">' +
                "{{/if}}" +
                '</video>&nbsp;',
            AUDIO: '' +
                '&nbsp;<audio ' +
                'controls="true" crossorigin="anonymous" controlsList="nodownload" preload="metadata"' +
                '>' +
                "{{#if includesourcetrack}}" +
                '<source src="{{sourceurl}}" type="{{sourcemimetype}}">' +
                "{{/if}}" +
                '<source src="{{url}}" type="{{urlmimetype}}">' +
                "{{#if issubtitling}}" +
                '<track src="{{subtitleurl}}" kind="captions" srclang="{{CP.language}}" label="{{CP.language}}" default="true">' +
                "{{/if}}" +
                '</audio>&nbsp;',
            LINK: '' +
                "{{#if issubtitling}}" +
                '&nbsp;<a href="{{url}}?data-subtitles={{subtitleurl}}&data-language={{CP.language}}"' +
                "{{else}}" +
                '&nbsp;<a href="{{url}}"' +
                "{{/if}}" +
                '>{{name}}</a>&nbsp;'
        }
    },

    BUTTONSHEADERTEMPLATE: '<div id="{{elementid}}_{{innerform}}" class="mdl-align">' +
        '<h4 class="' + CSS.HEADERTEXT + '">{{headertext}}</h4>' +
        '</div>',

    BUTTONTEMPLATE : '<div id="{{elementid}}_{{innerform}}" class="tiny_poodll_widget_buttons mdl-align" style="width:30%;">' +
        '<button style="width: 100%;" class="' + CSS.NAMEBUTTON + '_{{templateindex}} btn btn-info d-block">{{name}}</button>' +
        '</div>',

    FIELDTEMPLATE: '<div id="{{elementid}}_{{innerform}}"><span class="atto_cloudpoodll_widgetlabel">{{label}}</span>' +
        '&nbsp;<input type="text" class="' + CSS.TEMPLATEVARIABLE + '_{{variableindex}} tiny_poodll_widget_field" value="{{defaultvalue}}"></input>' +
        '</div>',

    SELECTCONTAINERTEMPLATE: '<div id="{{elementid}}_{{innerform}}"><span class="atto_cloudpoodll_widgetlabel">{{label}}</span></div>',

    SELECTTEMPLATE: '<select class="' + CSS.TEMPLATEVARIABLE + '_{{variableindex}} tiny_poodll_widget_field"></select>',

    OPTIONTEMPLATE: '<option value="{{option}}">{{option}}</option>',

    SUBMITTEMPLATE: '<form class="atto_form">' +
        '<div id="{{elementid}}_{{innerform}}" class="mdl-align">' +
        '<button class="' + CSS.INPUTSUBMIT + '">{{inserttext}}</button>' +
        '</div>' +
        '</form>',

   FIELDSHEADERTEMPLATE: '<div id="{{elementid}}_{{innerform}}" class="mdl-align">' +
        '<h4 class="' + CSS.HEADERTEXT + '">{{headertext}} {{key}}</h4>' +
        '<div class="' + CSS.INSTRUCTIONSTEXT + '">{{instructions}}</div>' +
        '</div>'
};
