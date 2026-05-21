const RULES = [
  {
    rule: "7-day notice required. No exceptions.",
    detail: "No rush jobs. No same-week turnarounds. If your event is in 6 days, come back next time.",
  },
  {
    rule: "Complete the Design Request form before we start.",
    detail:
      "Creative direction + brand kit OR hex codes/fonts/logos. No form, no job. We don't chase assets.",
  },
  {
    rule: "No asset-chasing.",
    detail:
      "You bring everything. We review. If your brief is complete, the job is accepted. If it isn't, we wait.",
  },
  {
    rule: "Payment due after acceptance, before any preview.",
    detail:
      "We don't start on speculation. Job accepted → invoice sent → payment received → work begins.",
  },
  {
    rule: "No previews. No unwatermarked deliverables without full payment.",
    detail: "Watermarked previews are not previews. Deliverables ship after payment clears. That's it.",
  },
  {
    rule: "No refunds. Ever.",
    detail:
      "Once you approve creative direction, the clock is running. We're committed. You're committed.",
  },
  {
    rule: "Customer-approved mistakes are not our mistakes.",
    detail:
      "If you sign off on a proof and it goes to print wrong, we fix the file. We don't eat the reprint.",
  },
  {
    rule: "Once design starts and direction is received, no refunds or cancellations.",
    detail: "We're allocating real creative time. Changing your mind is not a valid exit.",
  },
  {
    rule: "We reserve the right to refuse any job for any reason.",
    detail: "Including being too busy. We'd rather say no than do the work poorly.",
  },
];

export function PolicyBlock() {
  return (
    <div className="max-w-3xl">
      <div className="rounded-lg border border-warm/20 bg-warm/5 p-6 mb-10">
        <p className="font-heading text-base font-bold text-warm mb-1">
          Small team, not a design factory.
        </p>
        <p className="text-sm text-muted-foreground">
          Our creatives are from real agencies — they design every day. These rules exist so the work
          is done right, not fast.
        </p>
      </div>

      <div className="space-y-5">
        {RULES.map((item, i) => (
          <div key={i} className="flex gap-4">
            <span className="font-mono text-xs text-warm mt-1 shrink-0">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <p className="font-medium text-sm">{item.rule}</p>
              <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-8 border-t border-white/5 text-sm text-muted-foreground">
        Come prepared. Leave happy. Not happy?{" "}
        <span className="text-muted-foreground">
          Try photoboothgraphics.com or boothmotion.com.
        </span>
      </div>
    </div>
  );
}
