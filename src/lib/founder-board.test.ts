import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createActor } from 'xstate';
import { advanceFounder, answerIsCorrect, checkpoints, FounderBoard, initialFounderState, type Workspace } from './founder-board';

test('two actions per week; each workspace only once; debt is not negative', () => {
  const first = advanceFounder(initialFounderState(), { type: 'WORK', workspace: 'review' });
  assert.equal(first.quality, 2);
  assert.equal(first.debt, 0);
  assert.equal(advanceFounder(first, { type: 'WORK', workspace: 'review' }), first);
  const second = advanceFounder(first, { type: 'WORK', workspace: 'interview' });
  assert.equal(second.actions, 0);
  assert.equal(advanceFounder(second, { type: 'WORK', workspace: 'build' }), second);
});

test('checkpoint resource gates cannot be bypassed; errors cost focus but not evidence', () => {
  const state = initialFounderState();
  assert.equal(advanceFounder(state, { type: 'SOLVE', answer: [1] }), state);
  const ready = advanceFounder(state, { type: 'WORK', workspace: 'interview' });
  const wrong = advanceFounder(ready, { type: 'SOLVE', answer: [0] });
  assert.equal(wrong.evidence, 2);
  assert.equal(wrong.actions, 0);
  assert.equal(wrong.mistakes, 1);
});

test('set, sequence, and numeric puzzles validate exact solutions', () => {
  assert.equal(answerIsCorrect(1, [2, 0, 1]), true);
  assert.equal(answerIsCorrect(1, [0, 0, 2]), false);
  assert.equal(answerIsCorrect(2, [2, 3, 0, 1]), true);
  assert.equal(answerIsCorrect(2, [0, 1, 2, 3]), false);
  assert.equal(answerIsCorrect(5, [40]), true);
  assert.equal(answerIsCorrect(5, [40.1]), false);
  assert.equal(answerIsCorrect(6, []), false);
});

test('runway, surprise bills, and the week limit can end a run', () => {
  assert.equal(advanceFounder({ ...initialFounderState(), runway: 1 }, { type: 'END_WEEK' }).result, 'lost');
  assert.equal(advanceFounder({ ...initialFounderState(), week: 5, runway: 2 }, { type: 'END_WEEK' }).result, 'lost');
  assert.equal(advanceFounder({ ...initialFounderState(), week: 12 }, { type: 'END_WEEK' }).result, 'lost');
});

test('support only brings retained customers after release', () => {
  assert.equal(advanceFounder(initialFounderState(), { type: 'WORK', workspace: 'support' }).customers, 0);
  assert.equal(advanceFounder({ ...initialFounderState(), milestone: 5 }, { type: 'WORK', workspace: 'support' }).customers, 1);
});

test('a deliberate eight-week strategy wins through the real state machine', () => {
  const actor = createActor(FounderBoard).start();
  const work = (workspace: Workspace) => actor.send({ type: 'WORK', workspace });
  const solve = () => {
    const before = actor.getSnapshot().context.milestone;
    actor.send({ type: 'SOLVE', answer: checkpoints[before].answer });
    assert.equal(actor.getSnapshot().context.milestone, before + 1);
  };
  const week = () => actor.send({ type: 'END_WEEK' });
  work('interview'); solve(); week();
  work('interview'); solve(); week();
  work('build'); work('review'); week();
  work('build'); work('review'); week();
  solve(); solve(); week();
  work('share'); solve(); week();
  work('support'); work('freelance'); week();
  work('support'); solve();
  assert.equal(actor.getSnapshot().context.result, 'won');
  assert.equal(actor.getSnapshot().context.customers, 3);
  assert.equal(actor.getSnapshot().value, 'finished');
  const finished = actor.getSnapshot().context;
  actor.send({ type: 'WORK', workspace: 'build' });
  assert.equal(actor.getSnapshot().context, finished);
  actor.send({ type: 'RESET' });
  assert.deepEqual(actor.getSnapshot().context, initialFounderState());
  actor.stop();
});