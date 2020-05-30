/* Scan the DOM for tags with ${title}-mix and ${title}-flat ids */
const TRACK_TITLES = []
document.querySelectorAll("button").forEach(el => {
    let title = null
    if (el.id.match(/\-mix$/)) title = el.id.slice(0, -4)
    if (el.id.match(/\-flat$/)) title = el.id.slice(0, -5)
    if (title && ! TRACK_TITLES.includes(title)) TRACK_TITLES.push(title)
})

class TrackGroup {

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

    pauseOtherTRACK_GROUPS() {
        Object.keys(TRACK_GROUPS)
            .filter(title => title != this.trackTitle)
            .forEach(title => TRACK_GROUPS[title].pause())
    }

    play(trackType) {
        if (this.trackTypePlaying === trackType) this.pause()
        else {
            this.pauseOtherTRACK_GROUPS()
            this.mute()
            this.tracks[trackType].volume(1)
            this.trackTypePlaying = trackType
            if (!this.isPlaying()) {
                for (const trackType in this.tracks) { this.tracks[trackType].play() }
            }
        }
    }

}

const TRACK_GROUPS = {}
TRACK_TITLES.forEach(title => TRACK_GROUPS[title] = new TrackGroup(title))
