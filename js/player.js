"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TRACK_GROUPS = {};
var TRACK_TITLES = [];
/**
 * Abstraction to handle a grouped synched pair of playable media tracks.
 */

var TrackGroup = /*#__PURE__*/function () {
  /**
   * @constructor
   * @param {string} trackTitle - The title of the track under samples/
   *                              e.g: "DANCE" if samples/DANCE-flat.webm and samples/DANCE-mix.webm
   */
  function TrackGroup(trackTitle) {
    var _this = this;

    _classCallCheck(this, TrackGroup);

    this.trackTitle = trackTitle;
    this.trackTypePlaying = null;
    this.tracks = {
      flat: new Howl({
        src: ["samples/".concat(trackTitle, "-flat.webm"), "samples/".concat(trackTitle, "-flat.mp3")],
        preload: true
      }),
      mix: new Howl({
        src: ["samples/".concat(trackTitle, "-mix.webm"), "samples/".concat(trackTitle, "-mix.mp3")],
        preload: true
      })
    };
    this.buttons = {
      flat: document.querySelector("#".concat(trackTitle, "-flat")),
      mix: document.querySelector("#".concat(trackTitle, "-mix"))
    };

    var _loop = function _loop(type) {
      _this.buttons[type].onclick = function () {
        _this.play(type);
      };
    };

    for (var type in this.buttons) {
      _loop(type);
    }
  }

  _createClass(TrackGroup, [{
    key: "isPlaying",
    value: function isPlaying() {
      var _this2 = this;

      return Object.keys(this.tracks).every(function (type) {
        return _this2.tracks[type].playing();
      });
    }
  }, {
    key: "mute",
    value: function mute() {
      for (var trackType in this.tracks) {
        this.tracks[trackType].volume(0);
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      for (var trackType in this.tracks) {
        this.tracks[trackType].pause();
      }

      this.trackTypePlaying = null;
    }
  }, {
    key: "pauseOtherGroups",
    value: function pauseOtherGroups() {
      var _this3 = this;

      Object.keys(TRACK_GROUPS).filter(function (title) {
        return title != _this3.trackTitle;
      }).forEach(function (title) {
        return TRACK_GROUPS[title].pause();
      });
    }
  }, {
    key: "play",
    value: function play(trackType) {
      if (this.trackTypePlaying === trackType) this.pause();else {
        this.pauseOtherGroups();
        this.mute();
        this.tracks[trackType].volume(1);
        this.trackTypePlaying = trackType;

        if (!this.isPlaying()) {
          for (var _trackType in this.tracks) {
            this.tracks[_trackType].play();
          }
        }
      }
    }
  }]);

  return TrackGroup;
}();

window.onload = function () {
  /**
   * Scan the DOM for button tags with "${title}-mix" and "${title}-flat" ids
   * to populate global TRACK_TITLES array
   */
  document.querySelectorAll("button").forEach(function (el) {
    var title = null;
    if (el.id.match(/\-mix$/)) title = el.id.slice(0, -4);
    if (el.id.match(/\-flat$/)) title = el.id.slice(0, -5);
    if (title && !TRACK_TITLES.includes(title)) TRACK_TITLES.push(title);
  });
  /* Initialize track groups */

  TRACK_TITLES.forEach(function (title) {
    return TRACK_GROUPS[title] = new TrackGroup(title);
  });
};