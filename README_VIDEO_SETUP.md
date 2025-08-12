# Video Setup Instructions

## Video File Requirements

To complete the video implementation for the "AI Talent Takes the Spotlight" section, you need to:

1. **Add your MP4 video file** to the `PICS/` directory
2. **Name it** `ai-championship-video.mp4`
3. **Recommended specifications:**
   - Format: MP4 (H.264 codec)
   - Resolution: 1920x1080 or higher
   - Duration: 2-3 minutes recommended
   - File size: Keep under 50MB for optimal loading
   - Content: AI championship highlights, student presentations, or relevant AI content

## Current Implementation Features

The video player now includes:

✅ **Autoplay on scroll**: Video starts when 50% visible in viewport
✅ **Pause and reset**: Video pauses and resets to start when scrolled out of view
✅ **Muted playback**: Works across all browsers and mobile devices
✅ **Progress timer**: Shows current time / total duration in format "0:47 / 2:00"
✅ **Responsive design**: Timer adapts to mobile and desktop screens
✅ **Fallback background**: Shows original red gradient if video fails to load
✅ **IntersectionObserver**: Efficient scroll-based play/pause detection

## File Structure

```
PICS/
├── ai-championship-video.mp4  ← Add your video file here
├── hero image/
├── project submission catagories pics/
└── ... (other existing files)
```

## Testing

Once you add the video file:
1. Open `index.html` in a web browser
2. Scroll to the "AI Talent Takes the Spotlight" section
3. The video should autoplay when the section becomes 50% visible
4. The timer should display in the top-left corner
5. Scrolling away should pause and reset the video

## Troubleshooting

- If the video doesn't play, check that the file path is correct
- Ensure the video file is properly encoded as MP4
- Check browser console for any error messages
- The fallback background will show if video loading fails
