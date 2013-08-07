% Popups

## enyo.Popup

[enyo.Popup](http://enyojs.com/api/#enyo.Popup) is a control used to display
certain content on top of other content.  The following example shows a kind in
which pressing a button will display a popup.

        enyo.kind({
            name: "PopupExample",
            style: "text-align: center;",
            components: [
                {kind: "enyo.Button", content: "Basic Popup", ontap: "showPopup"},
                {name: "basicPopup", kind: "enyo.Popup", floating: true, centered: true,
                    style: "background-color: yellow; padding: 10px", onHide: "popupHidden", components: [
                        {content: "Popup..."}
                    ]
                }
            ],
            showPopup: function(inSender, inEvent) {
                this.$.basicPopup.show();
            },
            popupHidden: function(inSender, inEvent) {
                // do something
            }
        });

![_Popup (Hidden)_](../../assets/popups-1.png)

Popups are initially hidden on creation; they may be shown by calling the
`show()` method and re-hidden by calling `hide()`.  A popup will fire an
`onShow` event once shown and an `onHide` event once re-hidden. 

![_Popup (Shown)_](../../assets/popups-2.png)

You may center a popup in its viewport by setting its `centered` property to
`true`; if not centered, it should be given a specific position.

A popup may be floated above all application content by setting its `floating`
property to `true`.  This has the advantage of guaranteeing that the popup will
be displayed on top of other content.  This usage is appropriate when the popup
does not need to scroll along with the other content.

The `autoDismiss` property controls how a popup may be dismissed. If `true` (the
default), then tapping outside the popup or pressing the `ESC` key will dismiss
the popup.

The `modal` property may be set to `true` to prevent any controls outside the
popup from responding to events while the popup is showing:

        {kind: "enyo.Popup", centered: true, modal: true, floating: true, components: [
            {content: "Here's some information..."}
        ]}

## onyx.Popup

[onyx.Popup](http://enyojs.com/api/#onyx.Popup) extends `enyo.Popup`, adding
support for scrim behavior and z-index handling, as well as Onyx-themed visual
styling.

        components: [
            {kind: "onyx.Button", content: "Basic Popup", ontap: "showPopup"},
            {name: "basicPopup", kind: "onyx.Popup", floating: true, centered: true,
                style: "padding: 10px", components: [
                    {content: "Popup..."}
                ]
            }
        ]

![_onyx.Popup (Hidden)_](../../assets/popups-3.png)

![_onyx.Popup (Shown)_](../../assets/popups-4.png)

A scrim temporarily disables an application's user interface, covering the
screen with a translucent (i.e., semi-opaque) layer.  To display a scrim, set
the popup's `scrim` property to `true`.  If we do this in our current example,
the popup will look like this when shown:

![_onyx.Popup with Scrim_](../../assets/popups-5.png)

Note that, in order to avoid obscuring the popup's contents, the scrim won't
render unless the popup is floating.

A modal popup will receive a transparent (i.e., invisible) scrim by default,
unless the modal popup isn't floating.  To get a translucent scrim when modal,
specify `scrim: true, scrimWhenModal: false`.

You may, optionally, apply a CSS class to the scrim by setting the
`scrimClassName` property.  However, if you do so, be aware that the scrim is a
singleton and you will be modifying the scrim instance used for other popups
beyond the current one.
