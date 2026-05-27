# Notes

## Render speed :)

Page loading was sped up significantly by switching from JPG to AVIF for the innerImage:

![Render Times with JPG](RenderTimes-JPG.png)

![Render Times with AVIF](RenderTimes-AVIF.png)

Notice that LCP goes from about 7 seconds to about 3.2 seconds (tested with 4x cpu slowdown, slow 4g on edge).

## Firefox problems :(

- Firefox for some reason doesn't support the `field-sizing: content` property, which is used on the settings screen. It seems this will be implemented soon though: [Bugzilla](https://bugzilla.mozilla.org/show_bug.cgi?id=1832409)
- Firefox has significantly lower frame-rate of the background animation than MS Edge and Google Chrome. (irrespective of "recommended performance settings" being on or off) - This also results in **significant** GPU and CPU usage when animation is enabled. It is therefore not recommended to use animation on Firefox.
- At certain scales / screen sizes, Firefox shows small gaps between the repeating pattern of the background mask. I have not been able to recreate this in MS Edge. To solve this a Firefox-only settings slider has been added to allow adding a slight offset to the background pattern. There is no offset that makes it work for *all* scales, but it should be possible to find an offset that works well enough.

![Gap in Firefox](FirefoxGap.png)

## Considerations

Currently, no filtering is done on the links loaded from files, so technically if you for some reason downloaded a file and loaded it, malformed URLs could do XSS and exfiltrate your data, but:

- I don't see why people would load other peoples site lists
- The TOML files are very easy to skim through by humans, and any XSS attempt would be very obvious
- There isn't a lot of valuable data to exfiltrate, it's just a list of links
- Even *without* XSS, loading some random file allows for malicious links to be loaded

Therefore, this is not considered an issue.
Also, allowing weird URLS allows you to do weird stuff like linking to `ms-calculator://` or `steam://rungameid/730`.
