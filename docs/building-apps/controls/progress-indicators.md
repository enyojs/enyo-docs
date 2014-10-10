% Progress Indicators

## moon.ProgressBar

[moon.ProgressBar](../../../index.html#/kind/moon.ProgressBar) is a control that
shows the current progress of a process in a horizontal bar.  By default, the
`progress` property tracks the process's completion percentage as a number
between `0` and `100`.

To animate progress changes, call the `animateProgressTo()` method, passing in
the destination `progress` value.

        {kind: "moon.ProgressBar", progress: 25}

![_moon.ProgressBar_](../../assets/progress-bar-1.png)

In addition to the main process, the ProgressBar can track the state of a
background process via the `bgProgress` property.

        {kind: "moon.ProgressBar", progress: 25, bgProgress: 75}

![_moon.ProgressBar with background process_](../../assets/progress-bar-2.png)

## moon.Slider

[moon.Slider](../../../index.html#/kind/moon.Slider) extends `moon.ProgressBar`,
presenting a range of selection options in the form of a horizontal slider with
a control knob.  The knob may be tapped and dragged to the desired location.

        {kind: "moon.Slider", value: 30}

![_moon.Slider_](../../assets/slider.png)

`onChanging` events are fired while the control knob is being dragged, and an
`onChange` event is fired when the position is set, either by finishing a drag
or by tapping the bar.

![_moon.Slider (during drag)_](../../assets/slider-active.png)

## moon.Spinner

[moon.Spinner](../../../index.html#/kind/moon.Spinner) is a control used to
indicate that an activity is in progress.  It is typically hidden when the
activity ends.

The spinner has a looping animation that starts automatically when the control
is shown; the animation may also be controlled programmatically via the
`start()`, `stop()`, and `toggle()` methods.

![_moon.Spinner animation states_](../../assets/spinner.png)