Tiny Poodll for Moodle TinyMCE >= 4.1

===============================================
OVERVIEW
===============================================

This adds editor icons for audio/video/screen recording and poodll filter widgets to the TinyMCE HTML editor in Moodle.


===============================================
LICENSE
===============================================

This plugin is distributed under the terms of the General Public License
(see http://www.gnu.org/licenses/gpl.txt for details)

This software is provided "AS IS" without a warranty of any kind.

===============================================
CREDITS
===============================================

This module was developed by Poodll and Justin Hunt.


===============================================
To INSTALL the Tiny Poodll for Moodle TinyMCE
===============================================

    ----------------
    Using GIT
    ----------------

    1. Clone this plugin to your server

       cd /PATH/TO/MOODLE
       git clone -q https://github.com/justinhunt/moodle-tiny_poodll.git lib/editor/tiny/plugins/poodll

    2. Add this plugin to the GIT exclude file

       cd /PATH/TO/MOODLE
       echo '/lib/editor/tiny/plugins/poodll/' >> '.git/info/exclude'

      (continue with step 3 below)

    ----------------
    Using ZIP
    ----------------

    1. download the zip file from one of the following locations

        * https://github.com/justinhunt/moodle-tiny_poodll/archive/refs/heads/master.zip

    2. Unzip the zip file - if necessary renaming the resulting folder to "poodll".
       Then upload, or move, the "poodll" folder into the "/lib/editor/tiny/plugins" folder on
       your Moodle >= 4.1 site, to create a new folder at "/lib/editor/tiny/plugins/poodll"

       (continue with step 3 below)

    ----------------
    Using GIT or ZIP
    ----------------

    3. Log in to Moodle as administrator to initiate the install/update

       If the install/update does not begin automatically, you can initiate it
       manually by navigating to the following Moodle administration page:

          Settings -> Site administration -> Notifications

    4. At the end of the installation process, the plugin configuration settings will be displayed. They can be completed at this point, or later, by visiting the plugin settings page.

    ----------------
    Troubleshooting
    ----------------

    If you have a white screen when trying to view your Moodle site
    after having installed this plugin, then you should remove the
    plugin folder, enable Moodle debugging, and try the install again.

    With Moodle debugging enabled you should get a somewhat meaningful
    message about what the problem is.

    The most common issues with installing this plugin are:

    (a) the "poodll" folder is put in the wrong place
        SOLUTION: make sure the folder is at "/lib/editor/tiny/plugins/poodll"
                  under your main Moodle folder, and that the file
                  "/lib/editor/tiny/plugins/poodll/version.php" exists

    (b) permissions are set incorrectly on the "/lib/editor/tiny/plugins/poodll" folder
        SOLUTION: set the permissions to be the same as those of other folders
                  within the "/lib/editor/tiny/plugins/" folder


=================================================
to CONFIGURE the Tiny Poodll module
=================================================

The settings for the Tiny Poodll module can be found at:

    [Moodle Site]/Site Administration -> Plugins -> Text Editors -> TinyMCE -> Tiny Poodll

The most important settings are the API user and API secret. These are provided by Poodll.
You can get these by subscribing to Poodll at https://poodll.com (a free trial is available)

=================================================
Getting Help
=================================================
 If you need help send email to : support@poodll.freshdesk.com