function by_id(tag) {
    return document.getElementById(tag)
}

function by_class(tag) {
    return document.getElementsByClassName(tag)
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

var Playback = function() {
    this.player = by_id("media-player")
    this.player.autoplay = true
    this.player.volume = 0.4 // TODO: add a widget for selecting default volume
    this.player.onended = function(e) {
        this.select_item(this.item_idx + 1)
    }.bind(this)

    this.playlists = []
    this.playlist_idx = 0
    this.item_idx = 0
}

Playback.prototype.load_playlists = async function(url) {
    this.playlists = await fetch(url)
        .then((response) => response.json())

    let playlistsHTML = ""
    let idx = 0
    this.playlists.forEach(playlist => {
        playlistsHTML += `<option value=${idx}>${playlist.name}</option>`
        idx += 1
    })
    by_id("playlist-selection").innerHTML = playlistsHTML
}

Playback.prototype.select_playlist = function(playlist_nr, item_nr) {
    this.playlist_idx = playlist_nr % this.playlists.length
    by_id("playlist-selection").selected = this.playlist_idx

    let itemsHTML = ""
    let idx = 0
    this.playlists[this.playlist_idx].items.forEach(item => {
        itemsHTML = itemsHTML + `<li class="playlist-item" data-idx=${idx}>`
            + `${item.artists.join(' & ')} - ${item.name}</li>`
        idx += 1
    })
    by_id("playlist-itemlist").innerHTML = itemsHTML

    // register track selection
    const items = by_class("playlist-item")
    for (let i=0; i < items.length; i++) {
        items[i].onclick = function(e) {
            current_playback.select_item(parseInt(this.dataset.idx))
        }
    }

    this.select_item(item_nr)
}

Playback.prototype.select_item = function(item_nr) {
    this.item_idx = item_nr % this.playlists[this.playlist_idx].items.length
    this.player.src = this.playlists[this.playlist_idx].items[this.item_idx].file_url

    let items = by_class("playlist-item")
    for(let i=0; i<items.length; i++) {
        let item = items[i]
        if (item.dataset.idx == this.item_idx) {
            item.classList.add("selected")
        } else {
            item.classList.remove("selected")
        }
    }
}

var current_playback = new Playback()

async function main() {
    // set theme from local storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // register theme selection
    by_id("theme-selection").onchange = function(e) {
        setTheme(by_id("theme-selection").value)
    }

    // load playlists, this might take a second for large playlists
    await current_playback.load_playlists("./playlists.json")

    // register playlist selection
    by_id("playlist-selection").onchange = function(e) {
        current_playback.select_playlist(parseInt(this.selectedIndex), 0)
    }

    // select first playlist, first track. this has the function of filling the playlist element
    // with tracks so it's easier to understand what the element is for and it also fixes a bug when
    // only playlist exists, because selecting that playlist is not registered as change and thus
    // will not load the playlist
    current_playback.select_playlist(0, 0)
}

main()
