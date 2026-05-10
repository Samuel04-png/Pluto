# Pluto dApp Store Submission Checklist

Pluto is not ready for Solana dApp Store submission until these items are complete:

- Build a signed native Android APK or AAB from `solana-mobile/android`.
- Replace `https://pluto.dev` with the final production domain.
- Add `/.well-known/assetlinks.json` on the production domain for Android app-link verification.
- Replace launcher icons with production Pluto assets.
- Add screenshots for Saga/Seeker and standard Android devices.
- Test Mobile Wallet Adapter with Mock MWA Wallet and at least one production wallet.
- Verify Devnet send/request flows on Android Chrome and the native shell.
- Prepare privacy policy and app description.
- Submit the signed build and metadata to the Solana dApp Store flow.

## Suggested Store Description

Pluto is a voice-first Solana wallet that lets users send, receive, and request SOL using natural language. It combines ElevenLabs voice input/output, Firebase user data, Vercel API routes, and Solana Devnet payments with a secure confirmation-first transaction flow.
