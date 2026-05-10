import type { Contact } from "@/types";

export const demoContacts: Contact[] = [
  {
    id: "muape-k",
    name: "Muape K",
    aliases: ["muape", "mk", "muape k"],
    walletAddress: "GNJZVCN6iKjbxUPbvFUxgSuGatShvyxJtsXj2SzYuAhB",
    walletEnding: "uAhB",
    trusted: true,
    recent: true,
    lastTransactionSummary: "Received 1.20 SOL",
    color: "bg-blue-100 text-blue-700",
    avatarUrl: "/avatars/muape-k.svg",
    notes: "Lunch, hackathon demos, and quick reimbursements."
  },
  {
    id: "muape-a",
    name: "Muape A",
    aliases: ["muape", "muape a"],
    walletAddress: "8AMwbKe3n5gkBGSPjvbc9JcS2kBMpENpZhtSTGmSYEv2",
    walletEnding: "YEv2",
    trusted: true,
    recent: false,
    lastTransactionSummary: "Requested 0.30 SOL",
    color: "bg-cyan-100 text-cyan-700",
    avatarUrl: "/avatars/muape-a.svg",
    notes: "Second Muape contact used for ambiguity testing."
  },
  {
    id: "alex",
    name: "Alex",
    aliases: ["alex", "al"],
    walletAddress: "HcN62RjRry5ogDA1FogqLLLKixfPVLUFKo7wLQp6xpN",
    walletEnding: "6xpN",
    trusted: true,
    recent: true,
    lastTransactionSummary: "Paid lunch request",
    color: "bg-sky-100 text-sky-700",
    avatarUrl: "/avatars/alex.svg",
    notes: "Usually pays payment requests."
  },
  {
    id: "zena",
    name: "Zena",
    aliases: ["zena", "z"],
    walletAddress: "HCFj9bbkx3PiDJmPgdeW25CTZZSnchiinHgXEGVc8FZj",
    walletEnding: "8FZj",
    trusted: true,
    recent: true,
    lastTransactionSummary: "Sent 0.50 SOL",
    color: "bg-indigo-100 text-indigo-700",
    avatarUrl: "/avatars/zena.svg",
    notes: "Trusted demo recipient."
  },
  {
    id: "solaris",
    name: "Solaris",
    aliases: ["solaris", "sol"],
    walletAddress: "8rJk2VSL4UJaZNs6g1MFCvST1Ro14yMcHMDnby4nne5z",
    walletEnding: "ne5z",
    trusted: false,
    recent: true,
    lastTransactionSummary: "Received 2.00 SOL",
    color: "bg-violet-100 text-violet-700",
    avatarUrl: "/avatars/solaris.svg",
    notes: "Needs review before larger sends."
  }
];
