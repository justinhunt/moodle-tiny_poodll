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
 * Plugin strings are defined here.
 *
 * @package     tiny_poodll
 * @category    string
 * @copyright   2023 Justin Hunt <justin@poodll.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$string['button_recaudio'] = 'Record Audio';
$string['button_recscreen'] = 'Record Screen';
$string['button_recvideo'] = 'Record Video';
$string['button_widgets'] = 'Widgets';
$string['menuitem_recaudio'] = 'Record Audio';
$string['menuitem_recscreen'] = 'Record Screen';
$string['menuitem_recvideo'] = 'Record Video';
$string['menuitem_widgets'] = 'Widgets';
$string['pluginname'] = 'Tiny Poodll';
$string['privacy:metadata'] = 'Tiny Poodll stores recordings in AWS S3 buckets via cloud.poodll.com.';
$string['poodll:allowaudio'] = 'Allow audio recording';
$string['poodll:allowexpiredays'] = 'Allow Expire Days';
$string['poodll:allowvideo'] = 'Allow video recording';
$string['poodll:allowhistory'] = 'Allow history tab';
$string['poodll:allowoptions'] = 'Allow options tab';
$string['poodll:allowscreen'] = 'Allow screen recording';
$string['poodll:allowupload'] = 'Allow uploads';
$string['poodll:allowsubtitling'] = 'Allow subtitling';
$string['poodll:allowwidgets'] = 'Allow widgets';
$string['poodll:visible'] = 'Visible';
$string['poodll:use'] = 'Use Poodll audio/video/widgets from TinyMCE';

//--
$string['cloudpoodll:allowwidgets'] ='Allow visibility of widgets icon';
$string['cloudpoodll'] = 'Cloud Poodll';
$string['recorder'] = 'Recorder Type';
$string['recorderaudio'] = 'Audio Recorder';
$string['recordervideo'] = 'Video Recorder';
$string['recorderscreen'] = 'Screen Recorder';
$string['recorderwidgets'] = 'Widgets';

$string['apiuser'] = 'Poodll API User ';
$string['apiuser_details'] = 'The Poodll account username that authorises Poodll on this site.';
$string['apisecret'] = 'Poodll API Secret ';
$string['apisecret_details'] =
    'The Poodll API secret. See <a href= "https://support.poodll.com/support/solutions/articles/19000083076-cloud-poodll-api-secret">here</a> for more details';
$string['enablesubtitling'] = 'Enable Subtitling';
$string['enablesubtitling_details'] = 'Cloud Poodll can create subtitles automatically if required. See language settings';

$string['subtitleaudiobydefault'] = 'Subtitle Audio by default';
$string['subtitlevideobydefault'] = 'Subtitle Video by default';
$string['subtitlebydefault_details'] =
    'If true Cloud Poodll will check subtitling by default. It can be turned off from the options tab on the popup. Only subtitle by default if you need to.';

$string['useast1'] = 'US East';
$string['tokyo'] = 'Tokyo, Japan';
$string['sydney'] = 'Sydney, Australia';
$string['dublin'] = 'Dublin, Ireland';
$string['ottawa'] = 'Ottawa, Canada';
$string['frankfurt'] = 'Frankfurt, Germany';
$string['london'] = 'London, U.K (slow)';
$string['saopaulo'] = 'Sao Paulo, Brazil';
$string['singapore']='Singapore';
$string['mumbai']='Mumbai, India';
$string['capetown'] = 'Capetown, South Africa';
$string['bahrain'] = 'Bahrain';
$string['ningxia'] = 'Ningxia, China';


$string['language'] = 'Transcription language';
$string['speakerlanguage'] = 'Speaker language';
$string['en-us'] = 'English (US)';
$string['es-us'] = 'Spanish (US)';
$string['en-au'] = 'English (Aus.)';
$string['en-ph'] = 'English (Phil.)';
$string['en-gb'] = 'English (GB)';
$string['fr-ca'] = 'French (Can.)';
$string['fr-fr'] = 'French (FR)';
$string['it-it'] = 'Italian (IT)';
$string['pt-br'] = 'Portuguese (BR)';
$string['en-in'] = 'English (IN)';
$string['es-es'] = 'Spanish (ES)';
$string['fr-fr'] = 'French (FR)';
$string['fil-ph'] = 'Filipino';
$string['de-de'] = 'German (DE)';
$string['de-ch'] = 'German (CH)';
$string['de-at'] = 'German (AT)';
$string['da-dk'] = 'Danish (DK)';
$string['hi-in'] = 'Hindi';
$string['ko-kr'] = 'Korean';
$string['ar-ae'] = 'Arabic (Gulf)';
$string['ar-sa'] = 'Arabic (Modern Standard)';
$string['zh-cn'] = 'Chinese (Mandarin-Mainland)';
$string['nl-nl'] = 'Dutch (NL)';
$string['nl-be'] = 'Dutch (BE)';
$string['en-ie'] = 'English (Ireland)';
$string['en-wl'] = 'English (Wales)';
$string['en-ab'] = 'English (Scotland)';
$string['en-nz'] = 'English (New Zealand)';
$string['en-za'] = 'English (South Africa)';
$string['fa-ir'] = 'Farsi';
$string['he-il'] = 'Hebrew';
$string['id-id'] = 'Indonesian';
$string['ja-jp'] = 'Japanese';
$string['ms-my'] = 'Malay';
$string['mi-nz'] = 'Maori';
$string['pt-pt'] = 'Portuguese (PT)';
$string['ru-ru'] = 'Russian';
$string['ta-in'] = 'Tamil';
$string['te-in'] = 'Telugu';
$string['tr-tr'] = 'Turkish';
$string['uk-ua'] = 'Ukranian';
$string['eu-es'] = 'Basque';
$string['fi-fi'] = 'Finnish';
$string['hu-hu'] = 'Hungarian';
$string['sv-se'] = 'Swedish';
$string['no-no'] = 'Norwegian';
$string['nb-no'] = 'Norwegian (Bokmål)';
$string['nn-no'] = 'Norwegian (Nynorsk)';
$string['pl-pl'] = 'Polish';
$string['ro-ro'] = 'Romanian';
$string['bg-bg'] = 'Bulgarian'; // Bulgarian
$string['cs-cz'] = 'Czech'; // Czech
$string['el-gr'] = 'Greek'; // Greek
$string['hr-hr'] = 'Croatian'; // Croatian
$string['lt-lt'] = 'Lithuanian'; // Lithuanian
$string['lv-lv'] = 'Latvian'; // Latvian
$string['sk-sk'] = 'Slovak'; // Slovak
$string['sl-si'] = 'Slovenian'; // Slovenian
$string['is-is'] = 'Icelandic'; // Icelandic
$string['mk-mk'] = 'Macedonian'; // Macedonian
$string['sr-rs'] = 'Serbian'; // Serbian
$string['vi-vn'] = 'Vietnamese'; // Vietnamese

$string['uploadinstructions'] = 'Drag and drop, or choose a media file, to upload it.';

$string['insertmethod'] = 'Insert method';
$string['insertmethod_details'] =
    'Insert media links or media tags. Either way a Moodle filter will show a player when the page is displayed.';
$string['insertlinks'] = 'Media links';
$string['inserttags'] = 'Audio/video tags';

$string['upload'] = 'Upload';
$string['audio'] = 'Audio';
$string['audio_desc'] = 'Audio recorder';
$string['video'] = 'Video';
$string['video_desc'] = 'Video recorder';
$string['widgets'] = 'Widgets';
$string['widgets_desc'] = 'Insert a Widget';
$string['screen_desc'] = 'Screen recorder';
$string['insert'] = 'Insert';
$string['cancel'] = 'Cancel';
$string['createvideo'] = 'Create Video';
$string['createaudio'] = 'Create Audio';
$string['createscreen'] = 'Create Screen Recording';
$string['dialogtitle'] = 'Choose a widget';
$string['chooseinsert'] = 'What do you want to insert?';
$string['fieldsheader'] = 'Enter details for : ';
$string['nofieldsheader'] = 'Insert : ';

$string['forever'] = 'Never expire';
$string['awsregion'] = 'AWS Region';
$string['region'] = 'AWS Region';
$string['expiredays'] = 'Days to keep file';
$string['audioskin'] = 'Audio recorder';
$string['videoskin'] = 'Video recorder';

$string['timelimit'] = 'Recording Time Limit';
$string['currentsubmission'] = 'Current Submission:';
$string['yes'] = 'yes';
$string['no'] = 'no';

$string['enableaudio'] = 'Enable audio recording';
$string['enablevideo'] = 'Enable video recording';
$string['enablescreen'] = 'Enable screen recording';
$string['enablewidgets'] = 'Enable widgets';

$string['recordertype'] = 'Recorder Type';
$string['recorderskin'] = 'Recorder Skin';
$string['skinplain'] = 'Plain';
$string['skinbmr'] = 'Burnt Rose';
$string['skinfresh'] = 'Fresh';
$string['skin123'] = 'One Two Three';
$string['skinonce'] = 'Once';
$string['skinscreen'] = 'Screen';

$string['fallback'] = 'non-HTML5 Fallback';
$string['fallbackdetails'] =
    'If the browser does not support HTML5 recording for the selected mediatype, fallback to an upload screen or a warning.';
$string['fallbackupload'] = 'Upload';
$string['fallbackiosupload'] = 'iOS: upload, else warning';
$string['fallbackwarning'] = 'Warning';

$string['subtitle'] = 'Subtitles';
$string['subtitlecheckbox'] = 'Request subtitles for this recording';
$string['subtitleinstructions'] =
    'Requested subtitles are ready about 5 minutes after recording. You must request before recording.';
$string['mediainsertcheckbox'] = 'Insert media player into editor. Otherwise insert a media link.';

$string['options'] = 'Options';
$string['screen'] = 'Screen';
$string['history'] = 'History';
$string['transcode'] = 'Transcode';
$string['transcode_details'] = 'CloudPoodll can transcode audio to mp3 and video to mp4';

$string['cannotsubtitle'] = 'Subtitling is disabled. Check transcode, subtitle and region settings. ';

$string['cloudpoodll:allowaudio'] = 'Allow Audio Recording';
$string['cloudpoodll:allowvideo'] = 'Allow Video Recording';
$string['cloudpoodll:allowscreen'] = 'Allow Screen Recording';
$string['cloudpoodll:allowupload'] = 'Allow Upload';
$string['cloudpoodll:allowsubtitling'] = 'Allow Subtitling';
$string['cloudpoodll:allowexpiredays'] = 'Allow Expire Days';
$string['cloudpoodll:allowhistory'] = 'Allow History Tab';
$string['cloudpoodll:allowoptions'] = 'Allow Options Tab';
$string['cloudpoodll:visible'] = 'Visible';

$string['displaysubs'] = '{$a->subscriptionname} : expires {$a->expiredate}';
$string['noapiuser'] = "No API user entered. Tiny Poodll will not work correctly.";
$string['noapisecret'] = "No API secret entered. Tiny Poodll will not work correctly.";
$string['credentialsinvalid'] = "The API user and secret entered could not be used to get access. Please check them.";
$string['appauthorised'] = "Tiny Poodll is authorised for this site.";
$string['appnotauthorised'] = "Tiny Poodll  is NOT authorised for this site.";
$string['refreshtoken'] = "Refresh license information";
$string['notokenincache'] = "Refresh to see license information. Contact Poodll support if there is a problem.";
$string['notoken'] = 'API user and secret were rejected and could not gain access. Please check the Tiny Poodll plugin settings page.';
$string['historyback'] = 'Back to history';
$string['deleteitem'] = 'Delete item';
$string['loading'] = 'Loading...';
$string['title'] = 'Title';
$string['actions'] = 'Actions';
$string['date'] = 'Date';
$string['confirmdelete'] = 'Do you really want to delete? Deleting only removes the item from history, not from the server.';
$string['decimal'] = '';
$string['emptyTable'] = 'No items in history';
$string['info'] = 'Showing _START_ to _END_ of _TOTAL_ entries';
$string['infoEmpty'] = 'Showing 0 to 0 of 0 entries';
$string['infoFiltered'] = '(filtered from _MAX_ total entries)';
$string['infoPostFix'] = '';
$string['thousands'] = ',';
$string['lengthMenu'] = 'Show _MENU_ entries';
$string['loadingRecords'] = 'Loading...';
$string['processing'] = 'Processing...';
$string['search'] = 'Search:';
$string['zeroRecords'] = 'No matching records found';
$string['first'] = 'First';
$string['last'] = 'Last';
$string['next'] = 'Next';
$string['previous'] = 'Previous';
$string['sortAscending'] = ': activate to sort column ascending';
$string['sortDescending'] = ': activate to sort column descending';
$string['showhistory']="Show history tab";
$string['showhistory_details']="The history tab allows users to select from their previously recorded audio or video.";
$string['showupload']="Show upload tab";
$string['showupload_details']="The upload tab allows users to upload a media file from their device instead of recording.";
$string['showoptions']="Show options tab";
$string['showoptions_details']="The options tab allows users to set expiredays, subtitling and embed options";
$string['expiredays'] = 'Days to keep the file:';
$string['freetrial'] = "Get Cloud Poodll API Credentials and a Free Trial";
$string['freetrial_desc'] = "A dialog should appear that allows you to register for a free trial with Poodll. After registering you should login to the members dashboard to get your API user and secret. And to register your site URL.";
$string['fillcredentials']="Set API user and secret with existing credentials";
$string['previewitem'] = 'Preview item';
$string['insertitem'] = 'Insert item';
$string['insert'] = 'Insert';
$string['back'] = 'Back';
$string['videorecorder'] = 'Video Recorder';
$string['audiorecorder'] = 'Audio Recorder';
$string['screenrecorder'] = 'Screen Recorder';
$string['widgetsselector'] = 'Widget Selector';
$string['widgetsselector_instructions'] = 'Choose a widget to insert into the editor area.';
$string['cloudpoodllserver'] = 'Cloud Poodll Server';
$string['cloudpoodllserver_details'] = 'The server to use for Cloud Poodll. Only change this if Poodll has provided a different one.';
