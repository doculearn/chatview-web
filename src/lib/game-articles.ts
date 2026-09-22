export const gameArticles = [
  {
    slug: 'vibe-coding-startup-checklist',
    title: 'The vibe coding startup checklist: from first prompt to first users',
    description: 'A practical six-step workflow for founders using AI coding agents: scope, prompt, review, test, deploy, and learn. Practise the decisions in the free Ship It game.',
    readMinutes: 6,
    sections: [
      { title: 'An agent can write code. You still own the decisions.', paragraphs: [
        'Vibe coding can shorten the distance between an idea and a working prototype. It does not remove the need to choose a user, understand the code you ship, or check that the product solves a problem. A polished preview is evidence that a page renders, not evidence that a startup works.',
        'Use this checklist for one small release. Our free solo board game, Ship It, rehearses these tradeoffs through limited actions, runway tokens, and six original logic puzzles. Finishing a game is not a qualification in software engineering; you must still execute and verify the workflow on your real project.',
      ] },
      { title: '1. Scope one useful workflow', paragraphs: [
        'Name the user and the job before naming the features. "Freelance designers need to save a client brief and retrieve it before a call" is a more useful starting point than "an AI productivity platform." Pick a success condition you can observe, such as three testers saving and retrieving a brief without help.',
        'Write down what is explicitly outside the release: billing, team workspaces, imports, or recommendations. A smaller scope makes both human review and agent work easier. It also makes a disappointing result easier to interpret: you know which assumption you tested.',
      ] },
      { title: '2. Prompt with boundaries and acceptance criteria', paragraphs: [
        'Give the agent the repository context, the small task, the existing conventions, and a way to check the result. Ask for a plan before a broad change. Work in reviewable increments instead of asking it to generate every feature at once.',
        'Example: "Add a client-brief form using our existing form components. It needs a title and notes. Reject an empty title, save for the signed-in user, and show a clear success state. Add focused tests. Do not change billing or authentication configuration. Summarize the files changed and the checks run."',
        'The prompt is a starting specification, not a warranty. An agent can misunderstand a constraint or produce a test that repeats its own mistake. Your next steps are where you collect evidence.',
      ] },
      { title: '3. Review the diff, especially the boundaries', paragraphs: [
        'Read changed files and dependency additions. Ask why an unrelated file changed. For a saved brief, verify that one user cannot retrieve another user\'s record. Trace where secrets are read and make sure they never enter browser bundles, public environment variables, or logs.',
        'Treat generated explanations as claims to verify. Request a walkthrough of unfamiliar code, then inspect the actual implementation. For sensitive workflows such as payments, access control, or personal data, involve someone qualified to review those risks.',
      ] },
      { title: '4. Test the journey and its failure cases', paragraphs: [
        'Run the tests and read their output. For the brief example, cover a valid save and reload, an empty title, a failed network request, and an unauthorized read. A green test suite that never checks authorization cannot establish authorization correctness.',
        'Then use the interface as a person would. Try a phone-sized viewport, a keyboard, and a slow connection. Confirm that a failed save is not presented as success and that a retry does not silently duplicate data.',
      ] },
      { title: '5. Deploy with a way back', paragraphs: [
        'Use the deployment platform\'s server-side secret settings. A variable prefixed for browser exposure, such as NEXT_PUBLIC in Next.js, is not a secret store. Deploy the smallest useful release, retain the previous version, and document how to roll back.',
        'Test the production URL after deployment. Check configuration, a real save-and-reload journey, and error logs. A successful build does not prove the live database, permissions, or environment values are correct.',
      ] },
      { title: '6. Learn from a few real users', paragraphs: [
        'Observe whether users finish the intended job. Ask what they expected at the point they hesitated. Prefer concrete behavior over a general "looks great." Record the result, change one thing, and run the workflow again.',
        'A useful build-in-public update contains the workflow shipped, an honest observation, and the next experiment. Never publish private customer records or credentials as proof of progress. ChatView can help you reach your coding agent from your phone; it does not replace your judgment about what is safe to approve.',
      ] },
    ],
    sources: [
      { title: 'GitHub: responsible use of GitHub Copilot code review', url: 'https://docs.github.com/en/copilot/responsible-use/code-review' },
      { title: 'Next.js: environment variables', url: 'https://nextjs.org/docs/app/guides/environment-variables' },
      { title: 'OWASP: authorization guidance', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html' },
    ],
  },
  {
    slug: 'build-in-public-first-user-feedback',
    title: 'Build in public without the noise: a first-user feedback loop',
    description: 'A repeatable way for indie founders to turn a small release into useful feedback: show the workflow, observe friction, publish honest results, and test one change.',
    readMinutes: 5,
    sections: [
      { title: 'A launch post is an invitation, not validation', paragraphs: [
        'An announcement can attract attention without telling you whether your product solves a problem. Views and likes measure responses to the announcement. They are not substitutes for watching a person finish the job your product promises.',
        'For a founder using AI coding tools, this distinction is important. Code can arrive faster than understanding. A tight feedback loop stops that speed from turning into a larger collection of untested features. The final checkpoint in the Ship It board game asks you to distinguish returning users from new signups.',
      ] },
      { title: 'Start with one observable task', paragraphs: [
        'Invite someone from your intended audience to complete a concrete job. For a brief-saving app: "Save a client brief, leave the page, and find it again." Avoid walking them through each click. Ask permission to take notes or record the session, and make it easy to decline.',
        'Separate your observations from your explanations. "The tester clicked the heading twice" is an observation. "They need a dashboard redesign" is a hypothesis. Keep the two in separate columns so you do not turn one confusing moment into a large, premature rewrite.',
      ] },
      { title: 'Ask about the moment, not the imaginary roadmap', paragraphs: [
        'After a hesitation, ask what the person expected to happen. Ask how they solve the problem today and what would make them return. These questions are more grounded than asking whether they would use a hypothetical set of features.',
        'A feature request can point to a real problem without being the right solution. "Add a reminder" might mean the saved brief is hard to find, the user has no established routine, or a reminder really is needed. Ask for the situation that produced the request before putting it into the backlog.',
      ] },
      { title: 'Publish a small, honest update', paragraphs: [
        'A useful update can be three short parts: what shipped, what happened, and what you will test next. For example: "Shipped brief saving. Two of three testers finished unaided; one missed the save button. Next, I am testing a clearer saved state." These are illustrative numbers, not ChatView performance claims.',
        'Show the workflow with synthetic data. Remove names, email addresses, internal URLs, tokens, and private messages from screenshots. Get explicit permission before identifying a tester or quoting private feedback. Building in public should not mean making your users public.',
        'Link to the actual working tool or a useful explanation. Give readers a reason to visit beyond helping your metrics. A free game, a concrete checklist, or a clear rules reference can earn a voluntary link because another person finds it worth sharing. None guarantees a domain-rating increase.',
      ] },
      { title: 'Turn feedback into a bounded coding task', paragraphs: [
        'Choose one change and tell your coding agent what evidence motivated it. Define the behavior to preserve and the test that will show improvement. A prompt such as "Make the successful save state visible without changing the database schema" is easier to review than "Improve the UX."',
        'Review the diff, run the relevant checks, deploy, and return to the same user task. Keep the result even when the experiment fails. Repeated small observations are more useful than a public story in which every change is presented as a breakthrough.',
      ] },
      { title: 'A weekly rhythm you can sustain', paragraphs: [
        'Pick a narrow question at the start of the week. Ship one testable change, arrange a few conversations, and write one update with the result. Reserve time for bug fixes and support. Do not let the content schedule become a second product competing with the first.',
        'Use the Ship It checklist as a reminder: scope, prompt, review, test, deploy, learn. Repeat the cycle when new evidence arrives, not simply because the agent can generate another feature.',
      ] },
    ],
    sources: [
      { title: 'GOV.UK Service Manual: using moderated usability testing', url: 'https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing' },
      { title: 'Google Search Central: creating helpful, reliable, people-first content', url: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content' },
    ],
  },
] as const;