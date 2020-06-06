"use strict"
const TRACK_GROUPS = {}
const TRACK_TITLES = []

/**
 * Abstraction to handle a grouped synched pair of playable media tracks.
 */
class TrackGroup {

    /**
     * @constructor
     * @param {string} trackTitle - The title of the track under samples/
     *                              e.g: "DANCE" if samples/DANCE-flat.webm and samples/DANCE-mix.webm
     */
    constructor(trackTitle) {
        this.trackTitle = trackTitle
        this.trackTypePlaying = null

        this.tracks = {
            flat: new Howl({
                src: [`samples/${trackTitle}-flat.webm`, `samples/${trackTitle}-flat.mp3`],
                preload: true,
            }),
            mix: new Howl({
                src: [`samples/${trackTitle}-mix.webm`, `samples/${trackTitle}-mix.mp3`],
                preload: true,
            }),
        }

        this.buttons = {
            flat: document.querySelector(`#${trackTitle}-flat`),
            mix: document.querySelector(`#${trackTitle}-mix`),
        }

        for (const type in this.buttons) { this.buttons[type].onclick = () => { this.play(type) } }
    }

    isPlaying() { return Object.keys(this.tracks).every(type => this.tracks[type].playing()) }

    mute() { for (const trackType in this.tracks) { this.tracks[trackType].volume(0) }}

    pause() {
        for (const trackType in this.tracks) { this.tracks[trackType].pause() }
        this.trackTypePlaying = null
    }

    pauseOtherGroups() {
        Object.keys(TRACK_GROUPS)
            .filter(title => title != this.trackTitle)
            .forEach(title => TRACK_GROUPS[title].pause())
    }

    play(trackType) {
        if (this.trackTypePlaying === trackType) this.pause()
        else {
            this.pauseOtherGroups()
            this.mute()
            this.tracks[trackType].volume(1)
            this.trackTypePlaying = trackType
            if (!this.isPlaying()) {
                for (const trackType in this.tracks) { this.tracks[trackType].play() }
            }
        }
    }

}

window.onload = () => {
    /**
     * Scan the DOM for button tags with "${title}-mix" and "${title}-flat" ids
     * to populate global TRACK_TITLES array
     */
    document.querySelectorAll("button").forEach(el => {
        let title = null
        if (el.id.match(/\-mix$/)) title = el.id.slice(0, -4)
        if (el.id.match(/\-flat$/)) title = el.id.slice(0, -5)
        if (title && !TRACK_TITLES.includes(title)) TRACK_TITLES.push(title)
    })

    /* Initialize track groups */
    TRACK_TITLES.forEach(title => TRACK_GROUPS[title] = new TrackGroup(title))
}
