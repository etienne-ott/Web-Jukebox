# Web jukebox
Host playlists of music with simple yet sufficient control in the web.

## Installation
1. Upload or clone the repository somewhere where a webserver can find it
1. Configure the webserver to host the directory at an address of your choosing
1. Copy file `playlists_template.json` to `playlists.json`. This file contains the definition of playlists and the songs in them. For now this file is written manually, but integration with other tools is intended as future feature.

## Tracks
* The items for the playlist is intended to be music, however videos will be played as such in the player with default video control for the HTML player.
* Supported file formats depend on your browser.
* (For now) the songs need to be bare files hosted somewhere accessible. Integration with platforms such as YouTube, Spotify or SoundCloud may be a future feature, but this is outside the use case for v1.0.

## Restricting access
If the media files are hosted in a subdirectory of where the website is hosted, access to the media files and the jukebox can be managed with HTTP access restrictions.

File `.htaccess`:
```htaccess
Options All -Indexes

AuthUserFile /path/to/jukebox/.htpasswd
AuthName "Jukebox"
AuthType Basic
require valid-user
```
