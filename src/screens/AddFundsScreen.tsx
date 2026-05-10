"use client";

import { ArrowLeft, Building2, Check, Copy, Droplets, ExternalLink, QrCode, Smartphone } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlutoLogo } from "@/components/ui/Logo";
import { TextInput } from "@/components/ui/TextInput";
import { useQrCode } from "@/hooks/useQrCode";
import { createSolanaPayUrl } from "@/lib/solana/solanaPay";
import { formatSol, shortenAddress } from "@/lib/utils/format";
import type { WalletSummary } from "@/types";

const DEMO_SOL_USD_RATE = 173;

export function AddFundsScreen({
  wallet,
  onBack,
  onReceive
}: {
  wallet: WalletSummary;
  onBack: () => void;
  onReceive: () => void;
}) {
  const [mode, setMode] = useState<"buy" | "deposit">("buy");
  const [method, setMethod] = useState<"bank" | "mobile-money">("mobile-money");
  const [fiatAmount, setFiatAmount] = useState("25");
  const [destination, setDestination] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const receiveUrl = createSolanaPayUrl({
    recipient: wallet.publicKey,
    label: "Pluto",
    message: "Add SOL to Pluto"
  });
  const qrCode = useQrCode(receiveUrl);
  const estimatedSol = Math.max(0, Number(fiatAmount) || 0) / DEMO_SOL_USD_RATE;

  async function copyAddress() {
    await navigator.clipboard?.writeText(wallet.publicKey);
  }

  return (
    <main className="min-h-[100dvh] bg-white px-4 pb-6 pt-5 safe-pt">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-md flex-col gap-5">
        <header className="flex items-center justify-between">
          <Button variant="secondary" size="icon" aria-label="Back" icon={<ArrowLeft className="h-4 w-4" />} onClick={onBack} />
          <h1 className="text-base font-semibold text-pluto-navy">Add SOL</h1>
          <PlutoLogo showWordmark={false} />
        </header>

        <section>
          <h2 className="text-[34px] font-semibold leading-tight tracking-normal text-pluto-navy">Add SOL your way.</h2>
          <p className="mt-3 text-sm leading-6 text-pluto-slate">
            Buy SOL with bank or mobile money, or deposit SOL directly with your wallet address.
          </p>
        </section>

        <div className="grid grid-cols-2 rounded-[1.35rem] bg-pluto-mist p-1">
          {(["buy", "deposit"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setMode(item);
                setSubmitted(false);
              }}
              className={`h-11 rounded-[1rem] text-sm font-semibold transition ${
                mode === item ? "bg-white text-pluto-navy shadow-sm" : "text-pluto-slate"
              }`}
            >
              {item === "buy" ? "Buy SOL" : "Deposit SOL"}
            </button>
          ))}
        </div>

        {mode === "buy" ? (
          <>
            <Card className="space-y-4 shadow-sm">
              <div className="grid grid-cols-2 gap-2">
                <RampMethodButton
                  active={method === "mobile-money"}
                  icon={<Smartphone className="h-4 w-4" />}
                  label="Mobile money"
                  onClick={() => {
                    setMethod("mobile-money");
                    setSubmitted(false);
                  }}
                />
                <RampMethodButton
                  active={method === "bank"}
                  icon={<Building2 className="h-4 w-4" />}
                  label="Bank transfer"
                  onClick={() => {
                    setMethod("bank");
                    setSubmitted(false);
                  }}
                />
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-pluto-navy">Amount to spend</span>
                <TextInput
                  inputMode="decimal"
                  value={fiatAmount}
                  onChange={(event) => {
                    setFiatAmount(event.target.value);
                    setSubmitted(false);
                  }}
                  placeholder="25"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-pluto-navy">
                  {method === "mobile-money" ? "Mobile money number" : "Bank reference"}
                </span>
                <TextInput
                  value={destination}
                  onChange={(event) => {
                    setDestination(event.target.value);
                    setSubmitted(false);
                  }}
                  placeholder={method === "mobile-money" ? "+260 97 000 0000" : "Bank account or transfer reference"}
                />
              </label>

              <div className="rounded-[1.2rem] bg-blue-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-pluto-blue">Estimated receive</p>
                <p className="mt-2 text-2xl font-semibold text-pluto-navy">{formatSol(estimatedSol, 4)}</p>
                <p className="mt-1 text-xs leading-5 text-pluto-slate">
                  Demo quote at ${DEMO_SOL_USD_RATE}/SOL. A real launch needs a licensed fiat on-ramp provider.
                </p>
              </div>
            </Card>

            {submitted ? (
              <Card className="border-pluto-blue/30 bg-blue-50/70 shadow-none">
                <div className="flex gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-pluto-blue">
                    <Check className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-pluto-navy">Purchase request prepared</p>
                    <p className="mt-1 text-sm leading-6 text-pluto-slate">
                      Pluto can hand this off to a fiat provider. No bank or mobile money payment was charged in this demo.
                    </p>
                  </div>
                </div>
              </Card>
            ) : null}
          </>
        ) : (
          <>
            <Card className="grid place-items-center p-5 shadow-sm">
              <div className="grid aspect-square w-full max-w-[15rem] place-items-center rounded-[1.5rem] border border-pluto-line bg-white p-4">
                {qrCode ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt="Add SOL QR" src={qrCode} className="h-full w-full rounded-2xl" />
                ) : (
                  <QrCode className="h-16 w-16 text-pluto-blue/40" />
                )}
              </div>
            </Card>

            <Card className="space-y-3 shadow-sm">
              <p className="text-sm font-semibold text-pluto-navy">Wallet address</p>
              <button onClick={copyAddress} className="flex w-full items-center justify-between gap-3 rounded-[1rem] bg-pluto-mist px-3 py-3 text-left">
                <span className="truncate text-sm font-semibold text-pluto-navy">{shortenAddress(wallet.publicKey, 10, 10)}</span>
                <Copy className="h-4 w-4 shrink-0 text-pluto-blue" />
              </button>
            </Card>

            <Card className="bg-blue-50/70 shadow-none">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-pluto-blue">
                  <Droplets className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-pluto-navy">Devnet demo funding</p>
                  <p className="mt-1 text-sm leading-6 text-pluto-slate">
                    For a real Devnet send, fund the configured demo wallet from the Solana faucet, then set `DEMO_REAL_SEND=true`.
                  </p>
                </div>
              </div>
            </Card>
          </>
        )}

        <div className="mt-auto grid gap-2">
          {mode === "buy" ? (
            <Button onClick={() => setSubmitted(true)} disabled={!Number(fiatAmount) || !destination.trim()}>
              Continue with {method === "mobile-money" ? "mobile money" : "bank transfer"}
            </Button>
          ) : (
            <>
              <Button variant="secondary" icon={<ExternalLink className="h-4 w-4" />} onClick={() => window.open("https://faucet.solana.com/", "_blank", "noopener,noreferrer")}>Open Solana faucet</Button>
              <Button variant="secondary" onClick={onReceive}>Show receive screen</Button>
              <Button onClick={copyAddress}>Copy address</Button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function RampMethodButton({
  active,
  icon,
  label,
  onClick
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-14 items-center justify-center gap-2 rounded-[1.15rem] border text-sm font-semibold transition ${
        active ? "border-pluto-blue bg-blue-50 text-pluto-blue" : "border-pluto-line bg-white text-pluto-slate"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
