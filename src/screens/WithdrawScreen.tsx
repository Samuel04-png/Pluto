"use client";

import { ArrowLeft, Building2, Check, Smartphone } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlutoLogo } from "@/components/ui/Logo";
import { TextInput } from "@/components/ui/TextInput";
import { formatSol } from "@/lib/utils/format";
import type { WalletSummary } from "@/types";

const DEMO_SOL_USD_RATE = 173;

export function WithdrawScreen({
  wallet,
  onBack
}: {
  wallet: WalletSummary;
  onBack: () => void;
}) {
  const [method, setMethod] = useState<"bank" | "mobile-money">("mobile-money");
  const [amountSol, setAmountSol] = useState("0.1");
  const [destination, setDestination] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const amount = Math.max(0, Number(amountSol) || 0);
  const estimatedFiat = amount * DEMO_SOL_USD_RATE;
  const hasEnoughSol = amount > 0 && amount <= wallet.balanceSol;

  return (
    <main className="min-h-[100dvh] bg-white px-4 pb-6 pt-5 safe-pt">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-md flex-col gap-5">
        <header className="flex items-center justify-between">
          <Button variant="secondary" size="icon" aria-label="Back" icon={<ArrowLeft className="h-4 w-4" />} onClick={onBack} />
          <h1 className="text-base font-semibold text-pluto-navy">Cash out</h1>
          <PlutoLogo showWordmark={false} />
        </header>

        <section>
          <h2 className="text-[34px] font-semibold leading-tight tracking-normal text-pluto-navy">Withdraw SOL to cash.</h2>
          <p className="mt-3 text-sm leading-6 text-pluto-slate">
            Choose bank or mobile money. Pluto prepares the off-ramp request and keeps the Solana transfer confirmation-first.
          </p>
        </section>

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
            <span className="text-sm font-semibold text-pluto-navy">Amount to withdraw</span>
            <TextInput
              inputMode="decimal"
              value={amountSol}
              onChange={(event) => {
                setAmountSol(event.target.value);
                setSubmitted(false);
              }}
              placeholder="0.1"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-pluto-navy">
              {method === "mobile-money" ? "Mobile money number" : "Bank payout details"}
            </span>
            <TextInput
              value={destination}
              onChange={(event) => {
                setDestination(event.target.value);
                setSubmitted(false);
              }}
              placeholder={method === "mobile-money" ? "+260 97 000 0000" : "Bank account or payout reference"}
            />
          </label>

          <div className="rounded-[1.2rem] bg-pluto-mist p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-pluto-blue">Estimated payout</p>
            <p className="mt-2 text-2xl font-semibold text-pluto-navy">${estimatedFiat.toFixed(2)}</p>
            <p className="mt-1 text-xs leading-5 text-pluto-slate">
              Available: {formatSol(wallet.balanceSol)}. Demo quote at ${DEMO_SOL_USD_RATE}/SOL before provider fees.
            </p>
          </div>

          {!hasEnoughSol && amount > 0 ? (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
              Enter an amount less than or equal to your available SOL balance.
            </p>
          ) : null}
        </Card>

        {submitted ? (
          <Card className="border-pluto-blue/30 bg-blue-50/70 shadow-none">
            <div className="flex gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-pluto-blue">
                <Check className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-pluto-navy">Withdrawal request prepared</p>
                <p className="mt-1 text-sm leading-6 text-pluto-slate">
                  A production version would send this to a licensed off-ramp provider, then ask you to confirm the SOL transfer.
                </p>
              </div>
            </div>
          </Card>
        ) : null}

        <div className="mt-auto">
          <Button
            className="w-full"
            onClick={() => setSubmitted(true)}
            disabled={!hasEnoughSol || !destination.trim()}
          >
            Continue cash out
          </Button>
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
