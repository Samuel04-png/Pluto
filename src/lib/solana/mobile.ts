export type SolanaMobileStatus = "ready" | "native-required" | "submission-required";

export interface SolanaMobileCapability {
  label: string;
  status: SolanaMobileStatus;
  value: string;
  description: string;
}

export const solanaMobileCapabilities: SolanaMobileCapability[] = [
  {
    label: "Mobile Wallet Adapter",
    status: "ready",
    value: "Android Chrome / native",
    description:
      "Pluto's mobile path is designed around Mobile Wallet Adapter so users can approve Solana transactions in an MWA-compatible wallet."
  },
  {
    label: "Seed Vault",
    status: "native-required",
    value: "Via wallet",
    description:
      "Seed Vault remains inside the wallet layer. Pluto requests signatures through MWA instead of touching private keys directly."
  },
  {
    label: "Solana Mobile SDK",
    status: "native-required",
    value: "Android scaffold",
    description:
      "The repo includes a Kotlin Android scaffold for Mobile Wallet Adapter and Solana Mobile SDK dependencies."
  },
  {
    label: "Saga / Seeker",
    status: "native-required",
    value: "Android target",
    description:
      "The same Android MWA flow is intended for Saga, Seeker, and standard Android test devices."
  },
  {
    label: "dApp Store",
    status: "submission-required",
    value: "Checklist ready",
    description:
      "Submission metadata and checklist are included; a signed APK/AAB is still required before dApp Store submission."
  }
];

export function getSolanaMobileRuntime(userAgent?: string) {
  const value = userAgent || "";
  const isAndroid = /Android/i.test(value);
  const isChrome = /Chrome|CriOS/i.test(value);
  const isLikelySolanaPhone = /Saga|Seeker|Solana Mobile/i.test(value);

  return {
    isAndroid,
    isChrome,
    isMobileWalletAdapterWebReady: isAndroid && isChrome,
    isLikelySolanaPhone
  };
}
