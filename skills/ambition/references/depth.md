# Depth — work like a field-leading expert

Depth means pushing the model to use the tools, methods, and knowledge of the best
practitioners in the field, and to keep going until the result is something an
expert could learn from. The user does not need to know what those tools are; the
model usually does.

## The four questions

Answer all four before rewriting the prompt. Ask for **a deeper version of this
task, not a bigger one**.

1. **What would a top professional do that was not asked for?**
   E.g. a churn analyst segments by cohort and runs survival analysis rather than
   averaging monthly churn.
2. **What is the rawest material they would start from?**
   Event logs over dashboards, source code over docs, packet captures over error
   messages, primary filings over news coverage.
3. **Which specific methods and tools would they use?**
   Name them: a database and SQL instead of a markdown table; a profiler and flame
   graph instead of guesses; a statistical model with confidence intervals instead
   of eyeballed trends; a property-based test instead of three hand-picked cases.
4. **What, besides the user or the model, would verify the result?**
   See *Outside judge* below.

## Expert-instrument checklist

| If the draft produces… | An expert would produce… |
|------------------------|--------------------------|
| A markdown table of numbers | A queryable dataset plus a statistical model |
| "It feels faster" | A benchmark with p50/p95/p99 before and after |
| A list of assumptions | Each assumption tested against raw data, with the result |
| A summary of what happened | A simulation that reproduces what happened, then predicts what happens next |
| A fix | A fix, a regression test, and a check that catches the whole class of bug |

## Stretch targets

Set an unreasonable goal and call it reasonable. If a page loads in 10 s and the ask
is 5 s, ask for 200 ms and state that it is solvable with enough persistence. Goals
should be **specific and measurable**; "make it better" is not a target.

Decades of goal-setting research (Locke and Latham) find that specific, hard goals
outperform "do your best". The point is not that every stretch target is hit; it is
that the search goes somewhere the easy target never would.

## Challenge what you know

Hand over the raw data and ask the model to adversarially test the team's beliefs:
"We think churn is an onboarding problem — try to prove that wrong." List the
top three beliefs, state what evidence would falsify each, and check it.

## Produce new knowledge

The deepest version of a task creates something that did not exist before:

- Rebuild the last year from logs as a simulation and check it reproduces reality.
- Use it to find the earliest leading signal nobody is watching.
- Test the predictions on held-out data the model has not seen.

## Outside judge

The model must not grade its own work. Before doing the task, decide what will:

- An automated test suite, benchmark, or profiler run.
- Held-out data the model never saw while building.
- A reference implementation, spec, or published result to compare against.
- A separate reviewer pass (another subagent) that gets only the output and the
  criteria, not the reasoning that produced it.

Best of all is a tool the model can run itself for immediate feedback, so it can
iterate against the judge instead of against its own opinion. If no judge exists,
building one is step one of the plan.
