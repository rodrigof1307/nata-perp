import ExplanationBox from "@/components/ExplanationBox";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-around">
      <ExplanationBox
        title="Trade"
        description="Trade on Nata"
        buttonTitle="Trade"
        href="/trading"
      />
      <ExplanationBox
        title="Liquidity Pool"
        description="Provide liquidity to the Nata protocol"
        buttonTitle="Liquidity Pool"
        href="/liquidity-pool"
      />
      <ExplanationBox
        title="Liquidation"
        description="Liquidate positions on Nata"
        buttonTitle="Liquidation"
        href="/liquidation"
      />
    </main>
  );
}
