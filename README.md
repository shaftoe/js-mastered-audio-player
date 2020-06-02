# JavaScript Raw/Mastered (Flat/Mix) audio sample player

A simple implementation of a `Play/Pause` action for a double-version music samples buttons (*raw* and *mastered*, or *flat* and *mix*). The main purpose is to let the web client easily play samples and toggle between listening the different versions while the two tracks stay in sync (and stop playing other groups).

Supports multiple track groups out of the box.

Depends on 3rd-party [Howler JS library][howler].

## Demo

Here you find a live working [demo web page][demo] with two different title tracks and relative *flat/mix* versions.

## Install

Add:

```lang=html
<script defer src="js/howler.core.min-v2.2.0.js"></script>
<script defer src="js/player.js"></script>
```

at the end of the HTML `<body>` tag, your media files in [`samples/`](samples/) folder and the [`js/`](js/) folder to your web server (or CDN service).

All the JavaScript files under [`js/`](js/) are transpiled with [Babel][babel] for better browser support. If you want you can generate new ones with Babel too:

```lang=bash
npm install  # installs Babel dependencies
npm run build
```

## Usage

The [main JS file](src/player.js) when executed will:

- search the DOM for HTML `<button>` tags with ids named like `${track-title}-flat` and `${track-title}-mix`, the titles should match media file names in [samples/](samples/)
- load `/samples/${track-title}-flat.webm` and `/samples/${track-title}-mix.webm` plus `/samples/${track-title}-flat.mp3` and `${track-title}-mix.mp3` if available (it will fall back to `mp3` for Safari and old browsers like IE that don't support `webm` format)
- attach play/pause behavior to `onclick` events of every `<button>` tag with id `${track-title}-flat` and `${track-title}-mix`

Refer to [index.html](index.html), [player.js](src/player.js) and [samples/](samples/) folder for the current [demo][demo] values.

[babel]: <https://babeljs.io/>
[demo]: <https://shaftoe.github.io/js-mastered-audio-player/>
[howler]: <https://github.com/goldfire/howler.js#documentation>
