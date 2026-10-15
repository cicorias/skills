# Range — borrow methods from other fields

Range means looking at the work through more fields than would have been economical
before. Parallel subagents make it cheap to run several disciplines over the same
problem and merge the results.

## Step 1 — replace nouns with verbs

Nouns hide the work; verbs reveal which fields are good at it. (The technique comes
from Tom Kelley and Jonathan Littman, *The Art of Innovation*.)

| Noun | Verbs | Fields those verbs point at |
|------|-------|-----------------------------|
| Quarterly review | Convince busy people of a cause-and-effect story; decide under uncertainty in 30 minutes | Journalism, forecasting, decision analysis |
| Homepage | Make a first impression in 5 seconds; let people explore | Architecture, game level design, retail display |
| Incident report | Reconstruct a timeline; assign causes without blame | Aviation safety investigation, forensics |
| Onboarding flow | Teach a skill; build a habit | Instructional design, behavioral economics, game tutorials |

## Step 2 — assemble the crew

Pick 2–5 fields from the verbs. Define each crew member by **the actions it takes and
the artifact it returns**, not by a persona.

| Instead of | Write |
|------------|-------|
| "You are a short seller." | "Research this company the way a short-seller does: find the weakest claim, the evidence against it, and what would have to be true for the thesis to fail. Return a ranked list with sources." |
| "You are a journalist." | "Find the single most surprising true finding, write the headline and first paragraph, and list what a skeptical reader would ask next." |
| "You are an editor." | "Cut this to half its length without losing a claim. Return the cut version and the list of what was removed." |

Role play makes transcripts weirder without making results better. Describe the
work; the model already knows how each field does it.

### Crew recipes

- **Polished deck:** analyst (finds and checks the numbers), journalist (finds the
  story and the headline), editor (cuts and orders). If it will be presented live,
  add a motion designer and an audio designer.
- **Adversarial review of a plan or number:** short-seller research, forensic
  accounting (reconcile every figure to its source), and a red team that tries to
  make the plan fail.
- **Product or UX change:** usability researcher (task walkthroughs with failure
  points), behavioral economist (defaults and friction), accessibility auditor.
- **Technical design:** performance engineer, security reviewer, and the on-call
  engineer who will be paged at 3 a.m. (failure modes and observability).

## Step 3 — run and merge

- In Claude Code, launch one subagent per crew member in a single message so they
  run in parallel; give each only the inputs and the return format it needs.
- Merge by looking for **conflicts** first. Disagreements between fields are where
  the insight usually is.
- Send the merged result to the outside judge (see `depth.md`) before presenting it.
- Without subagents, run each member as a separate, clearly headed pass in sequence.

## Prerequisite

Range only works if the crew can actually use the other fields' tools. Give the
model a machine where it can install software (Blender for 3D renders, R for
statistics, a headless browser for UX checks) and access to the relevant data, via
MCP connectors or otherwise. List anything missing under **Access needed**.
