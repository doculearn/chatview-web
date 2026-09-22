import { assign, setup } from 'xstate';

export type Workspace = 'interview' | 'build' | 'review' | 'share' | 'freelance' | 'support';
export const workspaces: { id: Workspace; name: string; verb: string; gain: string; detail: string }[] = [
  { id: 'interview', name: 'Customer cafe', verb: 'Interview', gain: '+2 evidence', detail: 'Observe a real workflow. Ask what happened last time, not whether your idea sounds good.' },
  { id: 'build', name: 'Prompt workshop', verb: 'Build a slice', gain: '+2 build / +1 debt', detail: 'Give your coding agent a bounded task and acceptance criteria. Generated code still needs review.' },
  { id: 'review', name: 'Test bench', verb: 'Review & test', gain: '+2 quality / -1 debt', detail: 'Read the diff, run tests, and check authorization. A convincing preview is not proof.' },
  { id: 'share', name: 'Public square', verb: 'Share progress', gain: '+2 reach', detail: 'Show a real workflow and an honest result. Invite feedback without exposing private user data.' },
  { id: 'freelance', name: 'Side gig', verb: 'Fund the runway', gain: '+3 runway', detail: 'Client work buys time, but consumes an action you could have spent on the product.' },
  { id: 'support', name: 'Feedback desk', verb: 'Help a user', gain: '+1 evidence / +1 quality', detail: 'After deployment, each support action also earns one retained customer in this simplified simulation.' },
];

export type Puzzle = {
  name: string; subtitle: string; kind: 'choice' | 'set' | 'order' | 'number'; prompt: string;
  facts: string[]; options: string[]; answer: number[]; explanation: string; hint: string;
};
export const checkpoints: Puzzle[] = [
  {
    name: 'Find a real problem', subtitle: 'CUSTOMER DISCOVERY', kind: 'choice',
    prompt: 'Three interview groups. Only one meets every condition in your research brief. Which one?',
    facts: ['Target: repeats the task weekly, already spends money on a workaround, and owns the buying decision.', 'Designers: weekly task; paid workaround; manager controls budget.', 'Tutors: weekly task; paid workaround; choose their own tools.', 'Clubs: monthly task; free spreadsheet; choose their own tools.'],
    options: ['Designers', 'Tutors', 'Clubs'], answer: [1],
    explanation: 'Tutors satisfy all three conditions. This is a research lead, not proof of willingness to buy: validate the specific problem next.',
    hint: 'Treat the brief as AND, not OR. Eliminate any group missing even one condition.',
  },
  {
    name: 'Cut the MVP', subtitle: 'SCOPE BUDGET', kind: 'set',
    prompt: 'Choose features within five build points. A tester must save a brief, retrieve it, and be prevented from saving an empty title.',
    facts: ['Budget: 5 points. Select all required features and nothing else.', 'Save = 2. Retrieve = 2. Title validation = 1. Themes = 2. Analytics = 3.'],
    options: ['Save a brief · 2', 'Retrieve a brief · 2', 'Title validation · 1', 'Custom themes · 2', 'Analytics dashboard · 3'], answer: [0, 1, 2],
    explanation: 'The three acceptance criteria cost exactly five points. Keeping cosmetic and reporting work outside the release makes the core assumption testable.',
    hint: 'Map one feature to each acceptance criterion. Sum their costs before adding anything.',
  },
  {
    name: 'Sequence the agent', subtitle: 'DEPENDENCY PUZZLE', kind: 'order',
    prompt: 'Queue these implementation tasks in dependency order. This project has no API contract yet.',
    facts: ['The endpoint needs an agreed data contract.', 'The form uses that endpoint.', 'The end-to-end save/reload test runs only once the form exists.'],
    options: ['Wire the form', 'Run the save/reload test', 'Agree the data contract', 'Implement the endpoint'], answer: [2, 3, 0, 1],
    explanation: 'Contract, endpoint, form, then the end-to-end check. Give an agent small, reviewable tasks in dependency order; unit tests can be written alongside each task.',
    hint: 'Start with the task that depends on none of the others. Then follow the dependency chain.',
  },
  {
    name: 'Close the access gap', subtitle: 'DEBUG THE DIFF', kind: 'set',
    prompt: 'The current tests prove owners can read a brief and signed-out visitors cannot. Which TWO extra checks expose the missing access boundary?',
    facts: ['Generated handler: if (!session) return 401; return briefs.findById(request.id);', 'No ownership condition appears in the lookup.', 'Existing checks: own brief = 200; signed-out = 401.'],
    options: ['User B requests user A\'s brief: must be denied', 'Repeat the own-brief happy path', 'Query must constrain both brief ID and session user ID', 'Assert that the title is blue'], answer: [0, 2],
    explanation: 'Authentication is not authorization. A signed-in stranger must not read another account\'s record. Verify both the denied request and the ownership-scoped lookup.',
    hint: 'The handler knows someone is signed in, but never asks who owns the requested record.',
  },
  {
    name: 'Release responsibly', subtitle: 'DEPLOYMENT ORDER', kind: 'order',
    prompt: 'Arrange a safe release sequence for this project. The smoke test requires the deployed URL.',
    facts: ['Server-only secrets and a rollback target must exist before deployment.', 'A production smoke test needs a live deployment.', 'Invite the first users only after the smoke test passes.'],
    options: ['Invite first users', 'Run the production smoke test', 'Set server secrets and rollback target', 'Deploy the reviewed build'], answer: [2, 3, 1, 0],
    explanation: 'Prepare configuration and rollback, deploy, test the real URL, then invite users. Never put a private API key in browser-visible environment variables.',
    hint: 'Work backwards from inviting users. What must be verified before they arrive?',
  },
  {
    name: 'Read the right signal', subtitle: 'COHORT PUZZLE', kind: 'number',
    prompt: 'What is week-two retention for the original cohort? Enter a whole-number percentage.',
    facts: ['Week one: 20 people activated.', 'Week two: 8 of those same people returned.', 'Week two also brought 12 brand-new people. Do not mix them into the original cohort.'],
    options: [], answer: [40],
    explanation: '8 / 20 = 40%. The 12 new people belong to a different cohort. Retention measures return behavior; a busy signup chart can hide a leaky product.',
    hint: 'Use returning original users divided by original activated users, multiplied by 100.',
  },
];

export type FounderState = {
  week: number; actions: number; runway: number; evidence: number; build: number; quality: number;
  debt: number; reach: number; customers: number; milestone: number; used: Workspace[];
  pawn: Workspace | 'checkpoint' | 'start'; result: 'won' | 'lost' | null;
  feedback: string; log: string[]; hinted: number[]; mistakes: number;
};
export type FounderEvent = { type: 'WORK'; workspace: Workspace } | { type: 'SOLVE'; answer: number[] } | { type: 'END_WEEK' } | { type: 'HINT' } | { type: 'RESET' };

export const weeklyEvents = [
  'A quiet week. Keep the scope small.', 'A community reply surfaces a real pain point. +1 evidence.',
  'An integration changes. +1 technical debt.', 'A useful demo gets shared. +1 reach.',
  'A surprise hosting bill. -1 extra runway.', 'A quiet week. Follow up with a tester.',
  'A user sends a detailed bug report. +1 evidence.', 'A dependency needs attention. +1 technical debt.',
  'A community introduction opens a door. +1 reach.', 'A small tool renewal is due. -1 extra runway.',
  'Last week. Finish the experiment, not the wishlist.',
];

export function initialFounderState(): FounderState {
  return { week: 1, actions: 2, runway: 10, evidence: 0, build: 0, quality: 0, debt: 0, reach: 0,
    customers: 0, milestone: 0, used: [], pawn: 'start', result: null, feedback: '',
    log: ['Week 1: ten runway tokens, two actions. Your startup begins here.'], hinted: [], mistakes: 0 };
}

export function gateRequirements(state: FounderState): { label: string; met: boolean }[] {
  switch (state.milestone) {
    case 0: case 1: return [{ label: '2 evidence (spent)', met: state.evidence >= 2 }];
    case 2: return [{ label: '4 build (spent)', met: state.build >= 4 }];
    case 3: return [{ label: '3 quality', met: state.quality >= 3 }, { label: 'Debt at most 1', met: state.debt <= 1 }];
    case 4: return [{ label: '2 reach', met: state.reach >= 2 }, { label: '3 quality', met: state.quality >= 3 }, { label: 'Debt at most 1', met: state.debt <= 1 }];
    case 5: return [{ label: '3 retained customers', met: state.customers >= 3 }];
    default: return [];
  }
}

export function answerIsCorrect(index: number, answer: number[]): boolean {
  const puzzle = checkpoints[index];
  if (!puzzle || answer.some(value => !Number.isInteger(value)) || answer.length !== puzzle.answer.length) return false;
  const candidate = puzzle.kind === 'set' ? [...answer].sort((first, second) => first - second) : answer;
  return candidate.every((value, position) => value === puzzle.answer[position]);
}

export function advanceFounder(state: FounderState, event: FounderEvent): FounderState {
  if (event.type === 'RESET') return initialFounderState();
  if (state.result) return state;
  const next = { ...state, used: [...state.used], log: [...state.log], hinted: [...state.hinted], feedback: '' };
  function record(message: string) { next.feedback = message; next.log = [`Week ${next.week}: ${message}`, ...next.log].slice(0, 30); }
  if (event.type === 'HINT') {
    if (!next.hinted.includes(next.milestone)) next.hinted.push(next.milestone);
    record(checkpoints[next.milestone].hint);
    return next;
  }
  if (event.type === 'END_WEEK') {
    next.runway -= 1;
    if (next.week >= 12 || next.runway <= 0) {
      next.result = 'lost';
      record(next.week >= 12 ? 'The twelve-week experiment is over. Try a tighter plan.' : 'Runway exhausted. A side gig could have bought another week.');
      return next;
    }
    const eventIndex = next.week - 1;
    next.week += 1;
    next.actions = 2;
    next.used = [];
    if (eventIndex === 1 || eventIndex === 6) next.evidence += 1;
    if (eventIndex === 2 || eventIndex === 7) next.debt += 1;
    if (eventIndex === 3 || eventIndex === 8) next.reach += 1;
    if (eventIndex === 4 || eventIndex === 9) next.runway = Math.max(0, next.runway - 1);
    if (next.runway === 0) next.result = 'lost';
    record(weeklyEvents[eventIndex]);
    return next;
  }
  if (next.actions <= 0) return state;
  if (event.type === 'WORK') {
    const workspace = workspaces.find(item => item.id === event.workspace);
    if (!workspace || next.used.includes(event.workspace)) return state;
    next.actions -= 1;
    next.used.push(event.workspace);
    next.pawn = event.workspace;
    switch (event.workspace) {
      case 'interview': next.evidence += 2; break;
      case 'build': next.build += 2; next.debt += 1; break;
      case 'review': next.quality += 2; next.debt = Math.max(0, next.debt - 1); break;
      case 'share': next.reach += 2; break;
      case 'freelance': next.runway += 3; break;
      case 'support': next.evidence += 1; next.quality += 1; if (next.milestone >= 5) next.customers += 1; break;
    }
    record(`${workspace.verb}. ${workspace.detail}${event.workspace === 'support' && next.milestone >= 5 ? ' +1 retained customer.' : ''}`);
    return next;
  }
  if (event.type === 'SOLVE') {
    if (gateRequirements(next).some(requirement => !requirement.met)) return state;
    next.actions -= 1;
    next.pawn = 'checkpoint';
    if (!answerIsCorrect(next.milestone, event.answer)) {
      next.mistakes += 1;
      record('That answer does not satisfy the brief. One action spent; no resources taken. Revisit the clues or use a hint.');
      return next;
    }
    const puzzle = checkpoints[next.milestone];
    if (next.milestone < 2) next.evidence -= 2;
    if (next.milestone === 2) next.build -= 4;
    if (next.milestone === 4) next.customers += 1;
    next.milestone += 1;
    if (next.milestone === checkpoints.length) next.result = 'won';
    record(`${puzzle.name} cleared. ${puzzle.explanation}`);
    return next;
  }
  return state;
}

export const FounderBoard = setup({ types: { context: {} as FounderState, events: {} as FounderEvent } }).createMachine({
  id: 'founder-board', context: initialFounderState, initial: 'playing',
  on: { RESET: { target: '.playing', actions: assign(() => initialFounderState()) } },
  states: {
    playing: {
      always: { guard: ({ context }) => context.result !== null, target: 'finished' },
      on: {
        WORK: { actions: assign(({ context, event }) => advanceFounder(context, event)) },
        SOLVE: { actions: assign(({ context, event }) => advanceFounder(context, event)) },
        HINT: { actions: assign(({ context, event }) => advanceFounder(context, event)) },
        END_WEEK: { actions: assign(({ context, event }) => advanceFounder(context, event)) },
      },
    },
    finished: {},
  },
});