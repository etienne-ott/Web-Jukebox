"""
A script for generating playlists based on a central directory with media files.

Use: `python create_playlists.py /some/dir ./output_file.json`

This is intended for a certain structure of storing the media files:
* The root directory for the media files is given as input
* Every directory in the root dir is considered an artist
"""

import os
from sys import argv
import json

SONG_FILE_ENDINGS = {
    "ogg", "wma", "mp3", "mp4"
}

def get_artists(path):
    artists = {}
    with os.scandir(path) as iter_artists:
        for artist_dir in iter_artists:
            if not artist_dir.is_dir() or artist_dir.name.startswith("."):
                continue
            artists[artist_dir.name] = {}
    return artists

def get_sub_dirs(album_dir):
    subdirs = []
    with os.scandir(album_dir) as iter_subdirs:
        for entry in iter_subdirs:
            if entry.is_dir():
                subdirs.append(entry.name)
    return subdirs

def get_albums(artist_dir):
    albums = []
    with os.scandir(artist_dir) as iter_albums:
        for album_dir in iter_albums:
            if not album_dir.is_dir() or album_dir.name.startswith("."):
                continue
            sub_dirs = get_sub_dirs(album_dir)
            if sub_dirs != []:
                for sub_dir in sub_dirs:
                    albums.append(album_dir.name + "/" + sub_dir)
            else:
                albums.append(album_dir.name)
    return albums

def get_songs(album_dir):
    songs = []
    with os.scandir(album_dir) as iter_songs:
        for song_file in iter_songs:
            if not song_file.is_file():
                continue
            file_ending = song_file.name.split(".")[-1]

            if file_ending not in SONG_FILE_ENDINGS:
                continue

            songs.append(song_file.name)
    return songs

def create_playlists(path):
    playlists = []
    artists = get_artists(path)

    for artist in artists:
        albums = get_albums(os.path.join(path, artist))

        # normal albums
        for album in albums:
            playlist = {
                "name": artist + " - " + album.replace("/", " - "),
                "items": []
            }
            songs = get_songs(os.path.join(path, artist, album))

            for song in songs:
                song_info = {
                    "name": song,
                    "artists": [artist],
                    "file_url": "./media/" + artist + "/" + album + "/" + song
                }
                playlist["items"].append(song_info)

            playlists.append(playlist)

        # uncategorized songs
        songs = get_songs(os.path.join(path, artist))
        if len(songs) > 0:
            playlist = {
                "name": artist + " - Uncategorized",
                "items": []
            }

            for song in songs:
                song_info = {
                    "name": song,
                    "artists": [artist],
                    "file_url": "./media/" + artist + "/" + song
                }
                playlist["items"].append(song_info)

            playlists.append(playlist)

    return playlists

def main():
    playlists = create_playlists(argv[1])
    with open(argv[2], "w") as file:
        json.dump(playlists, file, indent=3)

main()