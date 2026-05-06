Refactor Rubber Duck’s current skills, agents, prompts, workflows, document templates, review agents, and related packaging to improve the quality of the work they produce. The goal is not to make small cosmetic edits. I am not 100% satisfied with the current results delivered by Rubber Duck’s skills and agents, and I want a serious quality pass across the
system.

Context and problems I am seeing:

I feel we are making mistakes in simple steps, underperforming on things that should be trivial, and sometimes exaggerating or going too far. When I compare the output from our skills and agents with other skills and agents I use day to day, built by other developers, Rubber Duck often feels inferior in quality and judgment.

One immediate problem is that the agents ask too few questions to the human. Our flow still assumes too many things are obvious or unnecessary to confirm, and that leads the agent down the wrong path. Many of those mistakes would have been avoided if the agent had confirmed the ambiguity with the human first. This is especially curious because when I use
the same skills in Claude Code, it tends to ask more questions than when they are used in Codex.

Another important problem is that questions are not asked before generating documents, even when they should be. The documents are usually generated first, with questions written inside them, and then the human becomes responsible for opening a new chat, answering each question, and only after that updating the document. This flow is wrong. When the answer
could materially affect the direction of the document, the agent should ask the human first, wait for the answer, and only then generate or finalize the document.

The generated documents are also sometimes much too large and written in English that is hard to understand for someone who is not a native English speaker. Reduce document length and use clearer, simpler English.

The PRD and planning stages need to work more vertically and less horizontally.

The current problem with long documents and over-detailed planning is that the developer loses the ability to quickly notice when the agent is going in the wrong direction. With very large, overengineered documents, the human ends up approving changes “on faith”, and only discovers months later that the architecture was broken.

The current mistake: letting the AI generate massive, hyper-detailed implementation plans, often 500 to 1000 lines long, before writing any code.

The desired solution: replace those huge implementation plans with a concise “Design Discussion” phase when appropriate. The developer does not need to read every line of a giant plan, but does need to read enough to build a clear mental model of what the AI is doing. The human should discuss the technical direction with the AI in a much smaller format. It
is much easier to fix the “building blueprint” with 10 minutes of good alignment than to fix the walls after they have already been built.

Also address instruction budget overload.

The current mistake: stuffing the LLM system prompt with dozens of behavioral rules and prohibitions.

The desired solution: simplify the prompts so the model’s attention is not fragmented. Following instructions should not feel like a game of luck because the prompt is overloaded with too many rules, duplicated guidance, and process-heavy text.

The biggest planning shift is horizontal development vs. vertical development.

Horizontal planning is our default today. When the agent is asked to plan implementation without a stronger structure, it naturally tends toward horizontal development. It tries to build the whole system by layers: first all database structure, then all services, then all APIs.

The problem with horizontal planning is that it is very easy to accumulate 1200 lines of code without anything being testable end to end, because no feature is complete. If the LLM made a mistake in the database layer, we may only discover it when hitting the API later, which forces refactoring across all three layers. Reviewing this kind of code becomes
almost impossible.

The desired approach is vertical planning. Force the LLM to plan implementation in vertical slices. Instead of doing “all database work”, each task should deliver one specific feature or behavior end to end, crossing the database, service, API, UI, tests, or any other required layer in one small package.

Each generated task should be immediately testable. We should not accumulate 1500 lines of unknown context. This should promote incremental programming, make code review much simpler, and make it easier to identify and quickly revert bugs.

You have permission to refactor everything if needed: all skills, all agents, all prompts, all workflows, all document templates, and any supporting Rubber Duck packaging. Quality is the priority.

I want to stop seeing extensive plans that are later poorly executed, followed by back-and-forth implementation and code review cycles with many avoidable findings to fix.

Review agents also need better judgment. Sometimes our agents “find hair in an egg”: they suggest unnecessary changes that only make the code messier, while missing adjustments that would actually matter for quality. Improve severity discipline and make review agents focus on meaningful correctness, maintainability, tests, API compatibility, security, data
handling, production risk, and real user impact. They should not flood the user with low-value nitpicks.

The desired energy is more “pragmatic programmer”: simple things done very well, instead of big overengineering that gives a false impression of “look what I know how to do” while being badly executed.

Requirements:

- Inspect the existing Rubber Duck repository structure before editing.
- Identify the skills, agents, prompts, document flows, review flows, and packaging files that control PRD, planning, implementation, document review, and code review behavior.
- Refactor the relevant files directly.
- Add or adjust guidance so agents ask concise, meaningful clarification questions before generating PRDs, plans, or major documents when ambiguity could materially change the result.
- Prevent the pattern where documents are generated first with unanswered questions inside them.
- Make generated PRDs, plans, and task documents shorter, clearer, easier to scan, and easier for non-native English speakers.
- Add a concise Design Discussion stage or behavior where it makes sense, before producing implementation plans.
- Rework planning guidance so implementation is broken into vertical, end-to-end, testable slices instead of horizontal layers.
- Simplify overloaded prompts. Remove duplicated, excessive, or overly procedural instructions where they reduce model focus.
- Improve review prompts and agents so they prioritize important findings and avoid low-value nitpicks.
- Preserve useful existing behavior, but do not keep weak structures only for compatibility.
- Prefer pragmatic, incremental, testable workflows over impressive-looking but fragile overengineering.

Acceptance criteria:

- PRD and planning flows clearly know when to ask the human before creating or finalizing a document.
- Questions are asked in the chat before document generation when the answers affect direction.
- Documents become shorter and easier to understand.
- Plans are centered around vertical slices that can be implemented and tested independently.
- Huge 500-1000 line implementation plans are no longer the default behavior.
- Agents are less likely to assume unclear requirements and more likely to ask a small number of useful questions.
- Review agents show better severity discipline and fewer unnecessary findings.
- The system feels more like a pragmatic senior engineer: clear questions, simple design, incremental delivery, meaningful review, and quality execution.

Output:

- Summarize the main changes made.
- List the files changed.
- Explain how the new behavior addresses the concerns above.
