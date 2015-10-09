# Media

The Enyo framework provides a number of useful kinds for playing audio and
video media.

## enyo/Media

[enyo/Media]($api/#/kind/enyo/Media/Media), the framework's base media kind,
extends [enyo/Control]($api/#/kind/enyo/Control/Control) and implements the
[HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement)
API.  It contains events, properties, and methods associated with playback of
audio and video content.

`enyo/Media` is not meant to be used directly, but serves as the base kind for
[enyo/Audio]($api/#/kind/enyo/Audio/Audio).

[Note: enyo/Media is "protected", so the Media kind doesn't appear in list of
kinds in API Reference, although the kind is accessible via the Media module,
which does appear in the list of modules.]

## enyo/Audio

[enyo/Audio]($api/#/kind/enyo/Audio/Audio) extends `enyo/Media` and implements
the [HTMLAudioElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement)
API.

The following code creates an Audio control:

```javascript
    var
        kind = require('enyo/kind'),
        Audio = require('enyo/Audio');

    ...

    {kind: Audio, src: 'http://www.w3schools.com/tags/horse.mp3'}
```

To play the audio content, call `play()` on the Audio control, e.g.:

```javascript
    this.$.audio.play();
```

## enyo/Video

[enyo/Video]($api/#/kind/enyo/Video/Video) extends `enyo/Control` and implements
the [HTMLVideoElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement)
API.

The following code creates a Video control:

```javascript
    var
        kind = require('enyo/kind'),
        Video = require('enyo/Video');

    ...

    {kind: Video, src: 'http://www.w3schools.com/html/movie.mp4'}
```

To play the video content, call `play()` on the Video control, e.g.:

```javascript
    this.$.video.play();
```

[Question: Why does enyo/Video extend enyo/Control and not enyo/Media?]

## enyo/MediaSource

[enyo/MediaSource]($api/#/kind/enyo/MediaSource/MediaSource) is a helper kind
that represents a media source used by an `enyo/Audio` or `enyo/Video` instance.
`enyo/MediaSource` is the `defaultKind` of `enyo/Video`, meaning that any
component created inside an `enyo/Video` will be an `enyo/MediaSource` unless
otherwise specified.

So, in the following example, the three components inside the `enyo/Video`
object will all be instances of `enyo/MediaSource`.

```javascript
    var
        kind = require('enyo/kind'),
        Video = require('enyo/Video');

    ...

    {kind: Video, components: [
        {src: 'video.mp4', type: 'video/mp4'},
        {src: 'video.ogg', type: 'video/ogg'},
        {src: 'video.webm', type: 'video/webm'}
    ]}
```

## moonstone/VideoPlayer

The Moonstone library builds on `enyo/Video`, providing a full-featured video
player control, [moonstone/VideoPlayer]($api/#/kind/moonstone/VideoPlayer/VideoPlayer).
The VideoPlayer wraps an [enyo/Video]($api/#/kind/enyo/Video/Video) object,
adding Moonstone-styled standard transport controls, optional app-specific controls,
and an information bar for displaying video information and player feedback.

To provide this functionality, `moonstone/VideoPlayer` makes use of several
supporting kinds, namely
[moonstone/VideoFeedback]($api/#/kind/moonstone/VideoFeedback/VideoFeedback),
[moonstone/VideoFullscreenToggleButton]($api/#/kind/moonstone/VideoFullscreenToggleButton/VideoFullscreenToggleButton),
[moonstone/VideoInfoBackground]($api/#/kind/moonstone/VideoInfoBackground/VideoInfoBackground),
[moonstone/VideoInfoHeader]($api/#/kind/moonstone/VideoInfoHeader/VideoInfoHeader), and
[moonstone/VideoTransportSlider]($api/#/kind/moonstone/VideoTransportSlider/VideoTransportSlider).

The following example shows how some of these different kinds fit together:

```javascript
    var
        kind = require('enyo/kind'),
        IconButton = require('moonstone/IconButton'),
        VideoHeaderBackground = require('moonstone/VideoHeaderBackground'),
        VideoInfoHeader = require('moonstone/VideoInfoHeader'),
        VideoPlayer = require('moonstone/VideoPlayer');

    {
        kind: VideoPlayer,
        src: 'http://www.w3schools.com/html/mov_bbb.mp4',
        components: [
            // Custom icons for app-specific features
            {kind: IconButton, src: 'assets/feature1.png', ontap: 'feature1'},
            {kind: IconButton, src: 'assets/feature2.png', ontap: 'feature2'},
            {kind: IconButton, src: 'assets/feature3.png', ontap: 'feature3'}
        ],
        infoComponents: [
            {kind: VideoHeaderBackground, components: [
                {kind: VideoInfoHeader, ... }
            ]
        ],
    }
```

The `components` block may be used to specify custom components to be rendered
in the VideoPlayer's transport control area; these should generally be limited
to instances of [moonstone/IconButton]($api/#/kind/moonstone/IconButton/IconButton).

The `infoComponents` block may be used to specify components to be rendered in
the VideoPlayer's header area.

Finally, note that `moonstone/VideoPlayer` bubbles the same set of media events
as `enyo/Video`.
