% Progress Indicators

## onyx.ProgressBar

[onyx.ProgressBar](../../api.html#onyx.ProgressBar) is an
[enyo.Control](../../api.html#enyo.Control) that shows the current
progress of a process in a horizontal bar.

        {kind: "onyx.ProgressBar", progress: 40}

![_onyx.ProgressBar_](../../assets/progress-1.png)

To animate changes, call the `animateProgressTo` method:

        this.$.progressBar.animateProgressTo(60);

To customize the visual styling of the bar, set a CSS style via the `barClasses`
property, e.g.:

        {kind: "onyx.ProgressBar", barClasses: "onyx-dark", progress: 40"}

![_onyx.ProgressBar (Dark)_](https://github.com/enyojs/enyo/wiki/assets/progress-2.png)

When the `showStripes` property is `true` (the default), stripes are shown in
the progress bar; when `animateStripes` is `true` (also the default), these
stripes are animated.  The animated stripes use CSS3 gradients and animation to
produce the effects; in browsers that do not support these features, the effects
will not be visible.

## onyx.ProgressButton

[onyx.ProgressButton](../../api.html#onyx.ProgressButton) extends
`onyx.ProgressBar`, adding a Cancel button, as well as the ability to contain
other controls.

        enyo.kind({
            name: "ProgressButtonExample",
            components: [
                {kind: "onyx.ProgressButton", barClasses: "onyx-light", progress: 20,
                    onCancel: "processCanceled", components: [
                        {content: "0"},
                        {content: "100", style: "float: right;"}
                    ]
                }
            ],
            processCanceled: function(inSender, inEvent) {
                // respond to cancellation
            }
        });

![_onyx.ProgressButton_](../../assets/progress-3.png)

When tapped, the Cancel button fires an `onCancel` event, which you may handle
as in the example above.

## onyx.Slider

[onyx.Slider](../../api.html#onyx.Slider), which also derives from
`onyx.ProgressBar`, is a control that presents a range of selection options in
the form of a horizontal slider with a control knob.  The knob may be tapped and
dragged to the desired location.

        {kind: "onyx.Slider", value: 30}

![_onyx.Slider_](../../assets/progress-4.png)

`onChanging` events are fired while the control knob is being dragged, and an
`onChange` event is fired when the position is set, either by finishing a drag
or by tapping the bar.

## onyx.RangeSlider

Another subkind of `onyx.ProgressBar`,
[onyx.RangeSlider](../../api.html#onyx.RangeSlider) is a control that
combines a horizontal slider with two control knobs. The knobs may be dragged to
select a desired range of values.

        {kind: "onyx.RangeSlider", rangeMin: 100, rangeMax: 500,
            rangeStart: 200, rangeEnd: 400, interval: 20}

![_onyx.RangeSlider_](../../assets/progress-5.png)

As with `onyx.Slider`, `onChanging` events are fired while the control knobs are
being dragged, and an `onChange` event is fired when the position is set by
finishing a drag.