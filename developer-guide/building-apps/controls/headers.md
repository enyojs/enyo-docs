% Headers

## moon.Header

The [moon.Header](../../../index.html#/kind/moon.Header) kind provides a styled
header with optional text above and below.

```javascript
    {kind: "moon.Header", name: "bigHeader", content: "Header Header Header",
        titleAbove: "02", titleBelow: "Sub Header",
        subTitleBelow: "Sub-sub Header", classes:"moon-10h", components: [
            {kind: "moon.IconButton", src: "../patterns-samples/assets/icon-like.png",
                ontap: "likeBig"},
            {kind: "moon.IconButton", src: "../patterns-samples/assets/icon-next.png",
                ontap: "shareBig"}
        ]
    }
```

![_moon.Header_](../../assets/headers.png)
