# Demo video: sources

**File:** `ask-me-first-demo.mp4`, 2:16, 1280×720, with captions burned in (`captions.srt` alongside).

**Narration:** Google Gemini TTS (`gemini-3.8-flash-tts`), voice Sulafat, prompted for Nigerian (Lagos) English; one take, recorded Nov 8, 2026, split per segment at whisper.cpp word timestamps. Script: `voice/narration.scene` and `voice/final-lines.json`. (Amazon Polly has no Nigerian English voice.)

**Screen footage:**
- Recorded by `record.mjs` and `record2.mjs`, using headless Chromium through Playwright 1.64.0.
- The app ran against the live server: Walrus Mainnet namespace `video-1108-1100`, with Tatum Sui gRPC checks and Sui Testnet USDC.
- Diesel payment shown in the video: https://suiscan.xyz/testnet/tx/5CJ7UEtfeUuQ7noVr3fqteabvqQe8e4AfrhyS6rCDfay
- **Cuts:** the waits for Walrus writes and payments (about 20–30 s each) are cut, and the chip on screen says so.
- **Step 2 ends at "Approve":** the demo wallet ran out of Testnet USDC (1 USDC left), so that approval's payment did not go through. The narration doesn't claim it paid.

**Stock footage:** Pexels, under the Pexels licence (https://www.pexels.com/license/). No music. No logos.

| File | Pexels page |
|---|---|
| pexels-5722215.mp4 | https://www.pexels.com/video/5722215/ |
| pexels-27165007.mp4 | https://www.pexels.com/video/27165007/ |
| pexels-35923247.mp4 | https://www.pexels.com/video/35923247/ |
| pexels-5664426.mp4 | https://www.pexels.com/video/5664426/ |
| pexels-7120152.mp4 | https://www.pexels.com/video/7120152/ |

The people in the stock clips are actors, not Ngozi or her family. Ngozi is a composite character, and the video says so on screen.

**Rebuild:** `cd video && npm install && node build.mjs`. The voice files are needed first, in `voice/ng/*.mp3`.
