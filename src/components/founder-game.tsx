'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { createActor } from 'xstate';
import { ArrowRight, ArrowUpRight, Check, CircleHelp, Coins, FlaskConical, Hammer, Lightbulb, LockKeyhole, Megaphone, MessageCircle, Rocket, RotateCcw, Share2, ShieldCheck, Undo2, Users, X } from 'lucide-react';
import { checkpoints, FounderBoard, gateRequirements, initialFounderState, weeklyEvents, workspaces, type FounderEvent, type FounderState, type Workspace } from '@/lib/founder-board';
import styles from './founder-game.module.css';

const icons = { interview: MessageCircle, build: Hammer, review: ShieldCheck, share: Megaphone, freelance: Coins, support: Users };
const locations: Record<Workspace, string> = { interview: 'cafe', build: 'workshop', review: 'bench', share: 'square', freelance: 'gig', support: 'feedback' };
const metrics = [
  { key: 'evidence', label: 'Evidence', Icon: FlaskConical },
  { key: 'build', label: 'Build', Icon: Hammer },
  { key: 'quality', label: 'Quality', Icon: ShieldCheck },
  { key: 'debt', label: 'Debt', Icon: CircleHelp },
  { key: 'reach', label: 'Reach', Icon: Megaphone },
  { key: 'customers', label: 'Customers', Icon: Users },
] as const;

function PuzzleDesk({ state, send }: { state: FounderState; send: (event: FounderEvent) => void }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [numeric, setNumeric] = useState('');
  const puzzle = checkpoints[state.milestone];
  const requirements = gateRequirements(state);
  const ready = state.actions > 0 && requirements.every(requirement => requirement.met);
  const answer = puzzle.kind === 'number' ? [Number(numeric)] : selected;
  const filled = puzzle.kind === 'number' ? numeric.trim() !== '' && Number.isInteger(Number(numeric)) : puzzle.kind === 'order' ? selected.length === puzzle.options.length : selected.length > 0;

  function choose(index: number) {
    if (puzzle.kind === 'choice') setSelected([index]);
    else if (puzzle.kind === 'set') setSelected(current => current.includes(index) ? current.filter(value => value !== index) : [...current, index]);
    else setSelected(current => current.includes(index) ? current : [...current, index]);
  }

  return <section className={styles.desk} aria-label="Checkpoint puzzle" data-milestone={state.milestone}>
    <div className={styles.deskTop}><span>THE PUZZLE DESK</span><span>{String(state.milestone + 1).padStart(2, '0')} / 06</span></div>
    <p className={styles.kicker}>{puzzle.subtitle}</p><h2>{puzzle.name}</h2>
    <div className={styles.requirements}>{requirements.map(requirement => <span key={requirement.label} className={requirement.met ? styles.met : ''}>{requirement.met ? <Check size={13} /> : <LockKeyhole size={13} />}{requirement.label}</span>)}</div>
    <p className={styles.prompt}>{puzzle.prompt}</p>
    <ul className={styles.clues}>{puzzle.facts.map(fact => <li key={fact}>{fact}</li>)}</ul>
    {puzzle.kind === 'order' && <div className={styles.sequence} aria-label="Your task order">
      {selected.length ? <ol>{selected.map((option, index) => <li key={option}><b>{index + 1}</b>{puzzle.options[option]}</li>)}</ol> : <p>Task queue empty</p>}
      <button aria-label="Undo last task" title="Undo last task" disabled={!selected.length} onClick={() => setSelected(current => current.slice(0, -1))}><Undo2 size={17} /></button>
    </div>}
    {puzzle.kind === 'number' ? <label className={styles.numberInput}>Week-two retention<input aria-label="Week-two retention percentage" inputMode="numeric" type="number" min="0" max="100" step="1" value={numeric} onChange={event => setNumeric(event.target.value)} /><span>%</span></label>
      : <div className={styles.choices} role="group" aria-label={puzzle.kind === 'order' ? 'Available tasks' : 'Puzzle answer'}>
        {puzzle.options.map((option, index) => puzzle.kind === 'order'
          ? <button key={option} onClick={() => choose(index)} disabled={selected.includes(index)} data-option={index}><span className={styles.choiceMark}>{selected.includes(index) ? selected.indexOf(index) + 1 : String.fromCharCode(65 + index)}</span>{option}</button>
          : <label key={option} className={selected.includes(index) ? styles.selected : ''}><input type={puzzle.kind === 'choice' ? 'radio' : 'checkbox'} name="puzzle-answer" checked={selected.includes(index)} onChange={() => choose(index)} data-option={index} />{option}</label>)}
      </div>}
    <div className={styles.deskActions}>
      <button className={styles.primary} disabled={!ready || !filled} onClick={() => send({ type: 'SOLVE', answer })}>Submit / 1 action <ArrowRight size={17} /></button>
      <button className={styles.iconButton} aria-label="Reveal puzzle hint" title="Reveal puzzle hint" onClick={() => send({ type: 'HINT' })}><Lightbulb size={19} /></button>
    </div>
    {!ready && <p className={styles.locked}>{state.actions === 0 ? 'No actions left this week.' : 'Earn the required resources on the board.'}</p>}
    {state.hinted.includes(state.milestone) && <p className={styles.hint}>{puzzle.hint}</p>}
  </section>;
}

export function FounderGame() {
  const actor = useRef<ReturnType<typeof createActor<typeof FounderBoard>> | null>(null);
  const [state, setState] = useState(initialFounderState);
  const [notice, setNotice] = useState('');
  const [confirmWeek, setConfirmWeek] = useState(false);
  const [run, setRun] = useState(0);
  const [view, setView] = useState<'board' | 'puzzle'>('board');
  const restartDialog = useRef<HTMLDialogElement>(null);
  const desk = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const game = createActor(FounderBoard);
    const subscription = game.subscribe(snapshot => setState(snapshot.context));
    actor.current = game;
    game.start();
    return () => { subscription.unsubscribe(); game.stop(); actor.current = null; };
  }, []);
  const send = (event: FounderEvent) => actor.current?.send(event);
  const ready = gateRequirements(state).every(requirement => requirement.met);
  const activeView = state.result ? 'puzzle' : view;

  function showView(next: 'board' | 'puzzle') {
    setView(next);
    if (window.matchMedia('(max-width: 960px)').matches) {
      document.getElementById(`founder-${next}-tab`)?.focus({ preventScroll: true });
      document.getElementById('founder-view-tabs')?.scrollIntoView({ block: 'start' });
    }
  }

  function restart() {
    send({ type: 'RESET' });
    setRun(current => current + 1);
    setConfirmWeek(false);
    setNotice('');
    setView('board');
    restartDialog.current?.close();
  }

  async function share() {
    const text = `${state.result === 'won' ? `I shipped in week ${state.week} with ${state.customers} retained customers.` : 'A solo board game for indie founders.'} Play Ship It: https://chat-view.xyz/games/ship-it`;
    try { await navigator.clipboard.writeText(text); setNotice('Game link copied.'); }
    catch { setNotice('Share: https://chat-view.xyz/games/ship-it'); }
  }

  return <div className={styles.game}>
    <div className={styles.topbar}>
      <div className={styles.week}><span>WEEK</span><strong>{String(state.week).padStart(2, '0')}<small> / 12</small></strong></div>
      <div className={styles.focus}><span>ACTIONS</span><div aria-label={`${state.actions} actions remaining`}><i data-active={state.actions > 0} /><i data-active={state.actions > 1} /><b>{state.actions}/2</b></div></div>
      <div className={styles.runway}><span>RUNWAY</span><strong><Coins size={18} />{state.runway}<small>tokens</small></strong></div>
      <div className={styles.tools}><button className={styles.iconButton} aria-label="New founder game" title="New game" onClick={() => restartDialog.current?.showModal()}><RotateCcw size={18} /></button><button className={styles.iconButton} aria-label="Copy game link" title="Copy game link" onClick={share}><Share2 size={18} /></button><Link className={styles.iconButton} href="/blog/vibe-coding-startup-checklist#board-rules" title="Game rules" aria-label="Game rules"><CircleHelp size={18} /></Link></div>
    </div>
    <div id="founder-view-tabs" className={styles.mobileTabs} role="tablist" aria-label="Game view" onKeyDown={event => {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        showView(event.key === 'Home' ? 'board' : event.key === 'End' ? 'puzzle' : activeView === 'board' ? 'puzzle' : 'board');
      }
    }}>
      <button id="founder-board-tab" role="tab" aria-selected={activeView === 'board'} aria-controls="founder-board-panel" tabIndex={activeView === 'board' ? 0 : -1} disabled={!!state.result} onClick={() => showView('board')}><Hammer size={17} />Board</button>
      <button id="founder-puzzle-tab" role="tab" aria-selected={activeView === 'puzzle'} aria-controls="founder-puzzle-panel" tabIndex={activeView === 'puzzle' ? 0 : -1} onClick={() => showView('puzzle')}><Lightbulb size={17} />{state.result ? 'Result' : `Puzzle ${state.milestone + 1}/6`}{ready && !state.result && <span className={styles.readyDot} aria-label="Resources ready" />}</button>
    </div>
    <div className={styles.layout} data-view={activeView}>
      <div id="founder-board-panel" className={styles.left}>
        <div className={styles.board} role="group" aria-label="Founder board">
          {workspaces.map(workspace => {
            const Icon = icons[workspace.id];
            const used = state.used.includes(workspace.id);
            const occupied = state.pawn === workspace.id;
            return <button key={workspace.id} style={{ gridArea: locations[workspace.id] }} data-workspace={workspace.id}
              className={`${styles.tile} ${used ? styles.used : ''} ${occupied ? styles.occupied : ''}`}
              aria-label={`${workspace.verb}, ${workspace.gain}${used ? ', used this week' : ''}`}
              title={workspace.detail} disabled={used || state.actions === 0 || !!state.result} onClick={() => { setConfirmWeek(false); send({ type: 'WORK', workspace: workspace.id }); }}>
              <span className={styles.tileTop}><Icon size={22} />{used ? <Check size={13} /> : <ArrowUpRight size={13} />}</span>
              <strong>{workspace.name}</strong><span className={styles.gain}>{workspace.gain}{workspace.id === 'support' && state.milestone >= 5 ? ' / +1 customer' : ''}</span>
              <span className={styles.tileFoot}>{occupied ? <><span className={styles.pawn}><Rocket size={13} /></span>Your founder</> : workspace.verb}</span>
            </button>;
          })}
          <div className={styles.center}>
            <div className={styles.centerBadge}><Rocket size={27} strokeWidth={1.5} /></div>
            <p>FROM IDEA TO</p><h2>First<br />customers.</h2>
            <span className={styles.goalCount}>{state.customers}<small> / 3</small></span>
            <div className={styles.stamps} aria-label={`${state.milestone} of 6 checkpoints complete`}>{checkpoints.map((checkpoint, index) => <span title={checkpoint.name} key={checkpoint.name} data-complete={index < state.milestone}>{index < state.milestone ? <Check size={12} /> : index + 1}</span>)}</div>
          </div>
          <button style={{ gridArea: 'gate' }} className={`${styles.tile} ${styles.gate}`} disabled={!!state.result} onClick={() => { showView('puzzle'); if (!window.matchMedia('(max-width: 960px)').matches) { desk.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' }); desk.current?.focus({ preventScroll: true }); } }}>
            <span className={styles.tileTop}>{ready ? <Rocket size={22} /> : <LockKeyhole size={22} />}<ArrowRight size={14} /></span><strong>Launch gate</strong><span className={styles.gain}>{state.result === 'won' ? 'All six stamps earned' : `Checkpoint ${Math.min(6, state.milestone + 1)} / 6`}</span><span className={styles.tileFoot}>{state.pawn === 'checkpoint' ? <span className={styles.pawn}><Rocket size={13} /></span> : null}{ready ? 'Puzzle ready' : 'Gather resources'}</span>
          </button>
          <button style={{ gridArea: 'week' }} className={`${styles.tile} ${styles.calendar}`} disabled={!!state.result} onClick={() => state.actions > 0 ? setConfirmWeek(true) : send({ type: 'END_WEEK' })}>
            <span className={styles.tileTop}><span className={styles.calendarNumber}>{String(Math.min(12, state.week + 1)).padStart(2, '0')}</span><ArrowRight size={14} /></span><strong>{state.week === 12 ? 'End experiment' : 'Next week'}</strong><span className={styles.gain}>-1 runway / reset actions</span><span className={styles.tileFoot}>{state.actions ? `${state.actions} action${state.actions === 1 ? '' : 's'} unspent` : 'Move the calendar'}</span>
          </button>
        </div>
        {confirmWeek && !state.result && <div className={styles.confirm} role="group" aria-label="Confirm next week"><p>Leave {state.actions} action{state.actions === 1 ? '' : 's'} unused?</p><button onClick={() => { send({ type: 'END_WEEK' }); setConfirmWeek(false); }}>End week</button><button onClick={() => setConfirmWeek(false)}>Keep working</button></div>}
        <div className={styles.resources} aria-label="Startup resources">{metrics.map(({ key, label, Icon }) => <div key={key} data-resource={key}><span><Icon size={14} />{label}</span><strong>{state[key]}</strong></div>)}</div>
        <div className={styles.event}><span>NEXT WEEK / {state.week >= 12 ? 'DEADLINE' : 'EVENT'}</span><p>{state.week >= 12 ? 'The experiment ends. Clear the final checkpoint before advancing.' : weeklyEvents[state.week - 1]}</p></div>
        <div className={styles.feedback} role="status" aria-live="polite">{state.feedback || 'Your first move: find evidence before you build.'}</div>
        <details className={styles.log}><summary>Founder journal <span>{state.log.length} entries</span></summary><ol>{state.log.map((entry, index) => <li key={`${index}-${entry}`}>{entry}</li>)}</ol></details>
      </div>
      <div id="founder-puzzle-panel" ref={desk} tabIndex={-1} className={styles.deskContainer}>
        <div className={styles.mobileFeedback} role="status">{state.feedback}</div>
        {state.result ? <section className={styles.result} aria-label="Game result"><Rocket size={36} /><p className={styles.kicker}>{state.result === 'won' ? 'EXPERIMENT COMPLETE' : 'A LESSON, NOT THE END'}</p><h2>{state.result === 'won' ? 'Small scope. Real progress.' : 'Time to regroup.'}</h2><p>{state.result === 'won' ? `Six checkpoints, ${state.customers} retained customers, and ${state.runway} runway left. Your week-${state.week} launch made it.` : state.feedback}</p><dl><div><dt>Checkpoints</dt><dd>{state.milestone}/6</dd></div><div><dt>Hints</dt><dd>{state.hinted.length}</dd></div><div><dt>Retries</dt><dd>{state.mistakes}</dd></div></dl><button className={styles.primary} onClick={restart}>New experiment <RotateCcw size={17} /></button><button className={styles.shareResult} onClick={share}><Share2 size={16} />Share your board</button><Link href="/blog/vibe-coding-startup-checklist">Take the checklist into your next project</Link></section>
          : <PuzzleDesk key={`${run}-${state.milestone}`} state={state} send={send} />}
      </div>
    </div>
    <p className={styles.notice} role="status">{notice}</p>
    <dialog ref={restartDialog} className={styles.dialog}><button className={styles.close} aria-label="Cancel restart" onClick={() => restartDialog.current?.close()}><X size={19} /></button><h2>Start a new experiment?</h2><p>The current board and journal will be cleared.</p><button className={styles.primary} onClick={restart}>New game <RotateCcw size={17} /></button><button className={styles.shareResult} onClick={() => restartDialog.current?.close()}>Keep this board</button></dialog>
  </div>;
}