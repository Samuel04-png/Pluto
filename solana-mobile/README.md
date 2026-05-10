# Pluto Solana Mobile Integration

This folder contains the native Android implementation plan and scaffold for the Solana Mobile track.

The production Pluto app is currently a Next.js PWA. Solana Mobile features such as Seed Vault and dApp Store submission require a native Android build, so the web app must not claim direct Seed Vault access. The correct architecture is:

1. Pluto dApp requests wallet authorization and transaction signing through Mobile Wallet Adapter.
2. An MWA-compatible wallet, such as Seed Vault Wallet, owns private key custody.
3. Seed Vault protects keys inside the wallet/device security layer.
4. Pluto receives signed transaction results without seeing seed phrases or private keys.

## Included

- `android/app/build.gradle.kts` includes the official Solana Mobile Kotlin dependencies.
- `android/app/src/main/java/app/pluto/mobile/PlutoMobileWalletAdapter.kt` shows Pluto's Mobile Wallet Adapter client integration.
- `android/app/src/main/AndroidManifest.xml` includes Android app metadata and HTTPS app-link intent filters.
- `dapp-store/submission-checklist.md` lists the dApp Store work still required before submission.

## Status

Mobile Wallet Adapter: scaffolded for native Android and documented for Android Chrome/mobile web.

Seed Vault: supported through an MWA-compatible wallet. Pluto does not directly integrate Seed Vault because dApps should not access private key custody directly.

Saga / Seeker: same Android MWA path. Test with an Android device, Saga, Seeker, or the Mock MWA Wallet.

dApp Store: metadata checklist is included, but a signed APK/AAB and final store assets are still required.
