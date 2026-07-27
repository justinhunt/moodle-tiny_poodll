# Tiny Poodll for Moodle

**An advanced audio, video and screen recording toolset for Moodle's TinyMCE editor.**

Tiny Poodll adds recording and media tools directly to the TinyMCE toolbar, so anywhere Moodle
shows a rich text editor — forum posts, assignment feedback, course content, and more — a
teacher or student can record straight into the content instead of typing. Recordings are
converted to universally playable MP3/MP4 and stored in the Poodll cloud, so course backups stay
small and playback is reliable everywhere.

- **Plugin:** `tiny_poodll` (TinyMCE editor plugin)
- **Maintainer:** Justin Hunt — poodllsupport@gmail.com
- **Documentation:** https://support.poodll.com
- **License:** GNU GPL v3 or later

---

## Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Site configuration](#site-configuration)
- [The four toolbar tools](#the-four-toolbar-tools)
- [The recording dialog](#the-recording-dialog)
- [Privacy](#privacy)
- [Support](#support)

---

## Requirements

| | |
|---|---|
| Moodle | 4.1 or later (`$plugin->requires = 2022112800`), TinyMCE editor |
| PHP | 8.1+ (PHP 8.4 supported) |
| Cloud Poodll account | **Required.** An API user and secret from https://poodll.com |

Tiny Poodll relies on the Cloud Poodll service for recording, storage, transcoding and caption
generation. Without API credentials the toolbar tools will not function.
See [Cloud Poodll API secret](https://support.poodll.com/support/solutions/articles/19000083076-cloud-poodll-api-secret)
for how to obtain them.

## Installation

1. Copy the plugin folder to `lib/editor/tiny/plugins/poodll` in your Moodle code root (on
   Moodle 5.1+ this is `public/lib/editor/tiny/plugins/poodll`).
2. Visit **Site administration → Notifications** and complete the upgrade.
3. Enter your Cloud Poodll API user and secret at
   **Site administration → Plugins → Text editors → TinyMCE editor → Tiny Poodll**.

## Site configuration

Settings live under **Site administration → Plugins → Text editors → TinyMCE editor → Tiny
Poodll**:

- **API user / API secret**, 
- **AWS region**  The AWS region processing and data storage take place in, 
- **Cloud Poodll server** The default is fine. Users with AWS region Ningxia in China should use cloud.poodll.cn
- Enable/disable each tool independently: **audio**, **video**, **screen**, **widgets**.
- Default recorder skins for audio and video.
- **Show upload / show options / show history** — toggle whether each tab appears in the
  recording dialog.
- **Insert method** — whether a recording is inserted as an embedded player or a plain media
  link (a link is needed to work with certain Moodle multimedia filters).
- **Transcode**, and whether to also **include the unconverted source** file alongside the
  converted mp3/mp4 in the player.
- **Subtitling** — enable captions, and whether audio/video is subtitled by default.
- Expiry days for recordings.

Each capability (`tiny/poodll:allowaudio`, `allowvideo`, `allowscreen`, `allowwidgets`,
`allowupload`, `allowhistory`, `allowoptions`, `allowsubtitling`, `allowexpiredays`) can also be
controlled per role/context through Moodle's normal permissions, on top of the site settings.

## The four toolbar tools

Tiny Poodll adds up to four icons to the TinyMCE toolbar, each independently enable-able:

| Tool | What it does |
|---|---|
| **Audio** | Opens the recording dialog for an audio recording. |
| **Video** | Opens the recording dialog for a video recording. |
| **Screen** | Records the screen (a screencast) instead of the camera. |
| **Widgets** | Opens a picker to insert other Poodll widgets into the content. |

## The recording dialog

Opening the audio or video tool shows a dialog with up to four tabs (each can be hidden via
site settings):

- **Recorder** — the recorder itself. Its appearance depends on the media type and the chosen
  skin (Standard, 123, Fresh, and more). Once uploaded, the dialog closes automatically and the
  media player (or link) is inserted into the editor.
- **Upload** — upload an existing file instead of recording, either via a file picker or by
  dragging and dropping it onto the tab. Upload starts immediately.
- **Options** — choose whether to insert an embedded player or a plain media link, and request
  captions (subtitles) in the language being spoken. Over 55 languages are supported, including
  multiple variants of English, Spanish, French, German, Portuguese, Chinese, Japanese, Korean,
  Arabic, Hindi and many more. Captions must be requested before recording/upload starts, and
  take a few minutes to become available.
- **History** — previously made recordings by the current user, so they can be re-used or
  recovered rather than re-recorded.

## Privacy

This plugin stores personal data: recordings made through the editor and their history entries
(`tiny_poodll_history`). Recordings are stored via Cloud Poodll (AWS S3). The plugin implements
the Moodle Privacy API for export and deletion.

## Support

- Documentation and how-tos: https://support.poodll.com
- Account and subscriptions: https://member.poodll.com
- Contact: poodllsupport@gmail.com

## License

Copyright Justin Hunt / Poodll. Licensed under the
[GNU GPL v3 or later](http://www.gnu.org/copyleft/gpl.html).
