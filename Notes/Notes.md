# Notes

## Render speed :)

Page loading was sped up significantly by switching from JPG to AVIF for the innerImage:

![Render Times with JPG](RenderTimes-JPG.png)

![Render Times with AVIF](RenderTimes-AVIF.png)

Notice that LCP goes from about 7 seconds to about 3.2 seconds (tested with 4x cpu slowdown, slow 4g on edge).

## Firefox problems :(

- Firefox for some reason doesn't support the `field-sizing: content` property, which is used on the settings screen. It seems this will be implemented soon though: https://bugzilla.mozilla.org/show_bug.cgi?id=1832409
- Firefox has significantly lower frame-rate of the background animation than edge. (irrespective of "recommended performance settings" being on or off)
- At certain scales / screen sizes, Firefox shows small gaps between the repeating pattern of the background mask. I have not been able to recreate this in Edge.

![Gap in firefox](FirefoxGap.png)

All in all Firefox sadly doesnt work very well with CSS.
