const MEMO_STORAGE_KEY = 'vcmemo.onepager.v1';

function blankMemoData() {
  const blank = {
    company: '', author: '', date: new Date().toISOString().slice(0, 10), version: 'v1',
    reco: '', recoWhy: '',
    round: '', amount: '', preMoney: '', ticket: '', coInvestors: '',
    activity: '',
    thesisIf: '', thesisThen: '', thesisOutcome: '', falsifiedIf: '',
    facts: [
      { text: '', source: '', date: '', status: 'declared' },
      { text: '', source: '', date: '', status: 'declared' },
      { text: '', source: '', date: '', status: 'declared' }
    ],
    whyTeam: '', whyTeamConv: 'med', whyNow: '', whyNowConv: 'med',
    beliefs: [{ text: '', because: '', conv: 'med' }],
    unknowns: [{ q: '', how: '' }, { q: '', how: '' }],
    risks: [{ text: '', mitigation: '' }, { text: '', mitigation: '' }],
    bearCase: '',
    dilution: '', exitValue: '', fundSize: '',
    ovOwnership: '', ovResidual: '', ovMultiple: '', ovFraction: ''
  };
  blank.nextAction = ''; blank.nextOwner = ''; blank.nextDue = ''; blank.nextQuestion = '';
  return blank;
}

function restoreMemoSnapshot(saved, compact) {
  const blank = blankMemoData();
  const storedD = saved && saved.d && typeof saved.d === 'object' && !Array.isArray(saved.d)
    ? saved.d : {};
  const rows = key => {
    const value = storedD[key];
    if (!Array.isArray(value)) return blank[key];
    return value.map(row => row && typeof row === 'object' && !Array.isArray(row)
      ? Object.assign({}, blank[key][0], row)
      : Object.assign({}, blank[key][0]));
  };
  return {
    lang: (saved && saved.lang) || null,
    mode: (saved && saved.mode) || 'full',
    step: (saved && Number.isInteger(saved.step) && saved.step >= 0) ? saved.step : 0,
    leftOpen: compact ? false : !(saved && saved.leftOpen === false),
    rightOpen: compact ? false : !(saved && saved.rightOpen === false),
    d: Object.assign({}, blank, storedD, {
      facts: rows('facts'), beliefs: rows('beliefs'),
      unknowns: rows('unknowns'), risks: rows('risks')
    })
  };
}

class Component extends DCLogic {
  state = (() => {
    let saved = null;
    let storageError = false;
    try {
      const raw = localStorage.getItem(MEMO_STORAGE_KEY);
      try { saved = JSON.parse(raw || 'null'); } catch (e) { saved = null; }
    } catch (e) { storageError = true; }
    const compact = typeof window !== 'undefined' && typeof window.matchMedia === 'function' &&
      window.matchMedia('(max-width: 60rem)').matches;
    return Object.assign({
      view: 'form', overflow: false, leftW: 252, rightW: 316,
      editingOverrides: {}, storageError: storageError
    }, restoreMemoSnapshot(saved, compact));
  })();

  rootRef = React.createRef();
  pageRef = React.createRef();
  headingRef = React.createRef();
  previewRef = React.createRef();
  compactQuery = null;
  compactListener = null;
  hasUnsavedDraft = false;
  storageListener = event => {
    if (!event || event.key !== MEMO_STORAGE_KEY || this.hasUnsavedDraft) return;
    let saved = null;
    if (event.newValue != null) {
      try { saved = JSON.parse(event.newValue); } catch (e) { return; }
    }
    const compact = typeof window !== 'undefined' && typeof window.matchMedia === 'function' &&
      window.matchMedia('(max-width: 60rem)').matches;
    this.setState(Object.assign({}, restoreMemoSnapshot(saved, compact), {
      view: this.state.view,
      overflow: this.state.overflow,
      leftW: this.state.leftW,
      rightW: this.state.rightW,
      editingOverrides: {},
      storageError: this.state.storageError
    }));
  };

  /* ---------- persistence ---------- */
  save() {
    try {
      localStorage.setItem(MEMO_STORAGE_KEY, JSON.stringify({
        lang: this.state.lang, mode: this.state.mode, step: this.state.step, d: this.state.d,
        leftW: this.state.leftW, rightW: this.state.rightW,
        leftOpen: this.state.leftOpen, rightOpen: this.state.rightOpen
      }));
      this.hasUnsavedDraft = false;
      if (this.state.storageError) this.setState({ storageError: false });
      return true;
    } catch (e) {
      this.hasUnsavedDraft = true;
      if (!this.state.storageError) this.setState({ storageError: true });
      return false;
    }
  }
  clearSavedMemo() {
    try {
      localStorage.removeItem(MEMO_STORAGE_KEY);
      this.hasUnsavedDraft = false;
      if (this.state.storageError) this.setState({ storageError: false });
      if (typeof window !== 'undefined') window.location.reload();
      return true;
    } catch (e) {
      if (!this.state.storageError) this.setState({ storageError: true });
      return false;
    }
  }
  up(patch) { this.setState(patch, () => this.save()); }
  setD(k, v) { this.up({ d: Object.assign({}, this.state.d, { [k]: v }) }); }
  ev(k) { return (e) => { this.grow(e.target); this.setD(k, e.target.value); }; }
  setRow(list, i, k, v) {
    const arr = this.state.d[list].map((r, j) => j === i ? Object.assign({}, r, { [k]: v }) : r);
    this.setD(list, arr);
  }
  addRow(list, blank) { this.setD(list, this.state.d[list].concat([blank])); }
  delRow(list, i) {
    const arr = this.state.d[list].filter((_, j) => j !== i);
    const rows = arr.length ? arr : [blank2(list)];
    this.setState({ d: Object.assign({}, this.state.d, { [list]: rows }) }, () => {
      this.save();
      const root = this.rootRef.current;
      const addButton = root && root.querySelector('[data-add-list="' + list + '"]');
      if (addButton) addButton.focus();
    });
    function blank2(l) {
      if (l === 'facts') return { text: '', source: '', date: '', status: 'declared' };
      if (l === 'beliefs') return { text: '', because: '', conv: 'med' };
      if (l === 'unknowns') return { q: '', how: '' };
      return { text: '', mitigation: '' };
    }
  }

  /* ---------- textarea autogrow ---------- */
  grow(el) { if (!el) return; el.style.height = 'auto'; el.style.height = (el.scrollHeight + 1) + 'px'; }
  growAll() {
    const root = this.rootRef.current; if (!root) return;
    root.querySelectorAll('textarea').forEach(el => this.grow(el));
  }
  togglePane(side) {
    return () => {
      const wasOpen = side === 'left' ? this.state.leftOpen : this.state.rightOpen;
      this.setState(
        side === 'left' ? { leftOpen: !wasOpen } : { rightOpen: !wasOpen },
        () => {
          this.save();
          if (!wasOpen) return;
          const root = this.rootRef.current;
          const control = root && root.querySelector('[data-pane-toggle="' + side + '"]');
          if (control) control.focus();
        }
      );
    };
  }

  componentDidMount() {
    this.growAll();
    this.measure();
    this.syncDocumentMetadata();
    if (typeof window === 'undefined') return;
    if (typeof window.addEventListener === 'function') window.addEventListener('storage', this.storageListener);
    if (typeof window.matchMedia !== 'function') return;
    this.compactQuery = window.matchMedia('(max-width: 60rem)');
    this.compactListener = e => {
      if (e.matches) this.setState({ leftOpen: false, rightOpen: false });
    };
    if (this.compactQuery.addEventListener) this.compactQuery.addEventListener('change', this.compactListener);
    else if (this.compactQuery.addListener) this.compactQuery.addListener(this.compactListener);
  }
  componentDidUpdate() { this.growAll(); this.measure(); this.syncDocumentMetadata(); }
  componentWillUnmount() {
    if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
      window.removeEventListener('storage', this.storageListener);
    }
    if (!this.compactQuery || !this.compactListener) return;
    if (this.compactQuery.removeEventListener) this.compactQuery.removeEventListener('change', this.compactListener);
    else if (this.compactQuery.removeListener) this.compactQuery.removeListener(this.compactListener);
  }
  measure() {
    const p = this.pageRef.current;
    if (!p) { if (this.state.overflow) this.setState({ overflow: false }); return; }
    const over = p.scrollHeight > 1128;
    if (over !== this.state.overflow) this.setState({ overflow: over });
  }

  /* ---------- helpers ---------- */
  lang() { return this.state.lang || this.props.defaultLang || 'fr'; }
  fr() { return this.lang() === 'fr'; }
  syncDocumentMetadata() {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = this.lang();
    document.title = this.fr() ? 'Simulateur de note d’investissement' : 'Investment memo simulator';
  }
  num(v) {
    return parseMemoNumber(v);
  }
  fmt(n, dec) {
    if (n == null || !Number.isFinite(n)) return '—';
    try {
      return new Intl.NumberFormat(this.fr() ? 'fr-FR' : 'en-US',
        dec == null ? { maximumSignificantDigits: 6 } : { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n);
    } catch (e) { return n.toFixed(dec); }
  }
  fdate(v) {
    if (!v) return '';
    const p = String(v).split('-');
    if (p.length !== 3) return v;
    return this.fr() ? p[2] + '/' + p[1] + '/' + p[0] : p[2] + ' ' +
      ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][parseInt(p[1], 10) - 1] + ' ' + p[0];
  }
  filled(v) { return !!(v && String(v).trim().length); }

  /* ---------- copy ---------- */
  T() {
    const fr = this.fr();
    const p = (a, b) => fr ? a : b;
    return {
      appKicker: p('Note d’investissement · gabarit one-pager', 'Investment memo · one-pager template'),
      storageError: p(
        'Enregistrement local indisponible. La saisie reste ouverte, mais sera perdue si vous rechargez la page.',
        'Local saving is unavailable. Your draft remains open, but will be lost if you reload the page.'
      ),
      modeFull: p('Mémo complet', 'Full memo'),
      modeScreen: p('Screening', 'Screening'),
      viewForm: p('Saisie', 'Draft'),
      viewPreview: p('Aperçu', 'Preview'),
      exportPdf: p('Export PDF', 'Export PDF'),
      railTitle: p('Blocs', 'Blocks'),
      railFoot: p('Les proportions indiquées valent pour une page. Un bloc qui déborde en dit long sur ce qu’on n’a pas tranché.', 'The shares are for one page. A block that overruns tells you what has not been settled.'),
      block: p('Bloc', 'Block'),
      cur: p('M€', '€M'),
      completeness: p('Complétude', 'Completeness'),
      sixTitle: p('Champs de la note', 'Memo fields'),
      sixSub: p('Présence des champs et validité numérique, sans évaluation du raisonnement.', 'Field presence and numeric validity, not an assessment of reasoning.'),
      errTitle: p('Erreurs fréquentes', 'Common failures'),
      seeOnePager: p('Voir le one-pager', 'See the one-pager'),
      reset: p('Vider le formulaire', 'Clear the form'),
      backToDraft: p('Retour à la saisie', 'Back to draft'),
      onePage: p('une page, sans réduction du corps', 'one page, body size untouched'),
      overflowOk: p('Tient sur une page.', 'Fits on one page.'),
      overflowBad: p('Dépasse une page — coupez, ne réduisez pas.', 'Overruns one page — cut, do not shrink.'),
      pvReco: p('Recommandation', 'Recommendation'),
      /* reco */
      lblRecoWhy: p('La raison principale, en une phrase', 'The main reason, in one sentence'),
      phRecoWhy: p('Si « poursuivre », nommer la question unique que l’étape suivante doit trancher.', 'If “keep digging”, name the single question the next step must settle.'),
      /* deal */
      lblCompany: p('Entreprise', 'Company'),
      phCompany: p('Nom de l’entreprise', 'Company name'),
      lblAuthor: p('Auteur', 'Author'),
      phAuthor: p('Qui signe la note', 'Who signs the note'),
      lblDate: p('Date', 'Date'),
      lblVersion: p('Version', 'Version'),
      dealTerms: p('Opération', 'The deal'),
      lblRound: p('Tour', 'Round'),
      phRound: p('Série A', 'Series A'),
      lblCoInv: p('Co-investisseurs', 'Co-investors'),
      phCoInv: p('Qui d’autre est autour de la table', 'Who else is at the table'),
      lblAmount: p('Levée', 'Round size'),
      lblPre: p('Pre-money', 'Pre-money'),
      lblTicket: p('Ticket proposé', 'Proposed ticket'),
      ownAtEntry: p('Ownership à l’entrée', 'Ownership at entry'),
      /* activity */
      lblActivity: p('Ce que fait l’entreprise', 'What the company does'),
      phActivity: p('Pour qui, et à la place de quoi. Une phrase, sans jargon, compréhensible hors du secteur.', 'For whom, and instead of what. One sentence, no jargon, legible outside the sector.'),
      /* thesis */
      thesisRead: p('Ce que le lecteur lira', 'What the reader will read'),
      lblFalsify: p('La thèse est fausse si', 'The thesis is wrong if'),
      falsifyNote: p('un fait, pas une généralité', 'a fact, not a generality'),
      phFalsify: p('Le fait qui, s’il était établi, invaliderait le raisonnement.', 'The fact that, if established, would invalidate the reasoning.'),
      /* facts */
      phSource: p('source', 'source'),
      verified: p('vérifié', 'verified'),
      declared: p('déclaratif', 'declared'),
      addFact: p('Ajouter un fait', 'Add a fact'),
      factsNote: p('Tout chiffre porte une date, une source, et son statut.', 'Every figure carries a date, a source, and its status.'),
      /* beliefs */
      conviction: p('Conviction', 'Conviction'),
      convHigh: p('élevée', 'high'),
      convMed: p('moyenne', 'medium'),
      convLow: p('faible', 'low'),
      otherBeliefs: p('Autres jugements', 'Other judgements'),
      phBelief: p('Jugement assumé', 'A judgement you own'),
      phBecause: p('parce que…', 'because…'),
      addBelief: p('Ajouter un jugement', 'Add a judgement'),
      /* unknowns */
      phUnknown: p('Question ouverte qui changerait la réponse', 'Open question that would change the answer'),
      liftedBy: p('se lève par', 'lifted by'),
      phHow: p('action de vérification précise et réalisable', 'precise, feasible verification step'),
      addUnknown: p('Ajouter une inconnue', 'Add an unknown'),
      unknownsNote: p('Des questions, pas des tâches à faire.', 'Questions, not to-dos.'),
      /* risks */
      phRisk: p('Risque structurant, propre à cette entreprise', 'Structural risk, specific to this company'),
      mitigation: p('atténuation', 'mitigation'),
      phMitigation: p('atténuation, ou raison de l’accepter', 'mitigation, or reason to accept it'),
      addRisk: p('Ajouter un risque', 'Add a risk'),
      riskOk: p('Deux ou trois au maximum, hiérarchisés.', 'Two or three at most, ranked.'),
      riskTooMany: p('Au-delà de trois, ce ne sont plus des risques : c’est une liste.', 'Past three, these are no longer risks: it is a list.'),
      lblBear: p('Cas défavorable — le meilleur argument contre', 'Bear case — the best argument against'),
      phBear: p('Deux phrases, rédigées comme les écrirait quelqu’un qui veut passer.', 'Two sentences, written as someone who wants to pass would write them.'),
      bearNote: p('Si vous ne parvenez pas à le rendre convaincant, la diligence n’est pas terminée.', 'If you cannot make it convincing, diligence is not finished.'),
      /* arithmetic */
      lblDilution: p('Dilution attendue', 'Expected dilution'),
      lblExit: p('Sortie envisagée', 'Assumed exit'),
      lblFund: p('Taille du fonds', 'Fund size'),
      computed: p('Calculé', 'Computed'),
      overrideNote: p('Une saisie manuelle doit rester compatible avec les hypothèses. Pour un autre scénario, modifier les hypothèses.', 'A manual value must agree with the assumptions. For another scenario, change the assumptions.'),
      method: p('Tour primaire simple : le ticket est inclus dans la levée. La sortie est une valeur des fonds propres et la dilution est cumulée jusqu’à la sortie. Résultats bruts, hors frais, fiscalité et préférences de liquidation.', 'Simple primary round: the ticket is part of the round. Exit means equity value and dilution is cumulative through exit. Gross results, excluding fees, taxes and liquidation preferences.'),
      cOwnership: p('Ownership à l’entrée', 'Ownership at entry'),
      cResidual: p('Part résiduelle à la sortie', 'Residual stake at exit'),
      cMultiple: p('Multiple sur la ligne', 'Multiple on the line'),
      cFraction: p('Retour en fraction du fonds', 'Return as a fraction of the fund'),
      fOwnership: p('ticket ÷ (pre-money + levée)', 'ticket ÷ (pre-money + round)'),
      fResidual: p('ownership × (1 − dilution)', 'ownership × (1 − dilution)'),
      fMultiple: p('(sortie × part résiduelle) ÷ ticket', '(exit × residual) ÷ ticket'),
      fFraction: p('retour ÷ taille du fonds', 'return ÷ fund size'),
      override: p('modifier', 'override'),
      restore: p('recalculer', 'recompute'),
      /* next */
      lblAction: p('Action précise', 'Precise action'),
      phAction: p('Ce qui sera fait, concrètement', 'What will be done, concretely'),
      lblOwner: p('Responsable', 'Owner'),
      phOwner: p('Une personne, pas une équipe', 'A person, not a team'),
      lblDue: p('Échéance', 'Due'),
      lblMustSettle: p('Doit trancher', 'Must settle'),
      phMustSettle: p('La question, formulée de façon à admettre une réponse.', 'The question, phrased so that it admits an answer.'),
      mustSettleNote: p('Une intention n’est pas une étape.', 'An intention is not a step.')
    };
  }

  blockMeta() {
    const fr = this.fr(); const p = (a, b) => fr ? a : b;
    return {
      reco: { name: p('Recommandation', 'Recommendation'), share: '10 %', hint: p('En haut, jamais en bas. Un mémo qui fait attendre sa conclusion est lu pour la trouver, non pour l’évaluer.', 'At the top, never at the bottom. A memo that withholds its conclusion gets read to find it, not to judge it.') },
      deal: { name: p('En-tête & opération', 'Header & deal'), share: '', hint: p('Ce qui identifie la note, et ce qui est sur la table. Rien d’autre : l’ownership se calcule seul.', 'What identifies the note, and what is on the table. Nothing else: ownership computes itself.') },
      activity: { name: p('Activité', 'What they do'), share: '', hint: p('Ce que fait l’entreprise, pour qui, et à la place de quoi. Une phrase — si elle en demande deux, c’est que vous ne l’avez pas comprise.', 'What the company does, for whom, and instead of what. One sentence — if it takes two, you have not understood it.') },
      thesis: { name: p('Thèse', 'Thesis'), share: '10 %', hint: p('Une thèse est un mécanisme, pas une taille de marché. Elle doit être réfutable : sans condition de réfutation, ce n’est qu’un avis.', 'A thesis is a mechanism, not a market size. It must be refutable: with no falsification condition, it is only an opinion.') },
      facts: { name: p('Ce que nous savons', 'What we know'), share: '25 %', hint: p('Faits vérifiables, datés et sourcés. Le statut compte autant que le chiffre : vérifié auprès d’un tiers, ou déclaratif non recoupé.', 'Verifiable facts, dated and sourced. Status matters as much as the figure: third-party verified, or founder-declared and unchecked.') },
      beliefs: { name: p('Ce que nous croyons', 'What we believe'), share: '10 %', hint: p('Jugements assumés, distincts des faits. Deux d’entre eux ne sont pas optionnels : pourquoi cette équipe, et pourquoi maintenant.', 'Judgements you own, kept apart from facts. Two of them are not optional: why this team, and why now.') },
      unknowns: { name: p('Ce que nous ignorons', 'What we don’t know'), share: '15 %', hint: p('Les inconnues qui changeraient la réponse — pas celles qui la nuanceraient. Chacune se lève par une action nommée.', 'The unknowns that would change the answer — not the ones that would qualify it. Each is lifted by a named action.') },
      risks: { name: p('Risques & cas défavorable', 'Risks & bear case'), share: '15 %', hint: p('Deux ou trois au maximum. Concurrence, exécution, recrutement ne sont pas des risques : ce sont des mots qui vont à tout dossier.', 'Two or three at most. Competition, execution, hiring are not risks: they are words that fit any deal.') },
      arith: { name: p('Arithmétique', 'Arithmetic'), share: '5 %', hint: p('Qu’obtient-on pour ce qu’on paie. Les valeurs se calculent depuis l’opération ; on ne les remplace que si l’on sait pourquoi.', 'What we get for what we pay. Values compute from the deal; you only override them when you know why.') },
      next: { name: p('Prochaine étape', 'Next step'), share: '10 %', hint: p('Une action, un responsable, une échéance — et la question que l’action doit trancher.', 'One action, one owner, one deadline — and the question the action must settle.') }
    };
  }

  order() {
    return this.state.mode === 'screen'
      ? ['reco', 'deal', 'thesis', 'facts', 'next']
      : ['reco', 'deal', 'activity', 'thesis', 'facts', 'beliefs', 'unknowns', 'risks', 'arith', 'next'];
  }

  /* ---------- completion ---------- */
  req(id) {
    const d = this.state.d, F = v => this.filled(v), screen = this.state.mode === 'screen';
    const c = this.calc();
    const list = [];
    if (id === 'reco') { list.push(F(d.reco), F(d.recoWhy)); }
    if (id === 'deal') {
      list.push(F(d.company), F(d.date), F(d.round), c.amt != null, c.pre != null, c.tick != null);
      if (!screen) list.push(F(d.author));
    }
    if (id === 'activity') list.push(F(d.activity));
    if (id === 'thesis') {
      list.push(F(d.thesisIf), F(d.thesisThen));
      list.push(F(d.thesisOutcome), F(d.falsifiedIf));
    }
    if (id === 'facts') {
      for (let i = 0; i < 3; i++) {
        const f = d.facts[i] || {};
        list.push(F(f.text));
        list.push(F(f.source), F(f.date));
      }
    }
    if (id === 'beliefs') list.push(F(d.whyTeam), F(d.whyNow));
    if (id === 'unknowns') {
      for (let i = 0; i < 2; i++) { const u = d.unknowns[i] || {}; list.push(F(u.q), F(u.how)); }
    }
    if (id === 'risks') {
      for (let i = 0; i < 2; i++) { const r = d.risks[i] || {}; list.push(F(r.text), F(r.mitigation)); }
      list.push(F(d.bearCase));
    }
    if (id === 'arith') {
      list.push(c.dil != null, c.exit != null, c.fund != null);
      for (const key of ['ovOwnership', 'ovResidual', 'ovMultiple', 'ovFraction']) {
        if (this.filled(d[key]) || this.state.editingOverrides[key]) list.push(!c.errors[key]);
      }
    }
    if (id === 'next') {
      list.push(F(d.nextQuestion));
      if (!screen) list.push(F(d.nextAction), F(d.nextOwner), F(d.nextDue));
    }
    return list;
  }

  calc() {
    if (this.state.mode === 'screen') {
      const { preMoney, amount, ticket } = this.state.d;
      return calculateMemo({ preMoney, amount, ticket });
    }
    return calculateMemo(this.state.d, this.state.editingOverrides);
  }

  /* ---------- nav ---------- */
  go(i) {
    const o = this.order();
    const compact = typeof window !== 'undefined' && typeof window.matchMedia === 'function' &&
      window.matchMedia('(max-width: 60rem)').matches;
    this.setState(Object.assign(
      { step: Math.max(0, Math.min(o.length - 1, i)) },
      compact ? { leftOpen: false, rightOpen: false } : {}
    ), () => {
      this.save();
      const m = this.rootRef.current && this.rootRef.current.querySelector('main');
      if (m) m.scrollTop = 0;
      if (this.headingRef.current) this.headingRef.current.focus();
    });
  }
  goToBlock(id) { const i = this.order().indexOf(id); if (i >= 0) this.go(i); }

  renderVals() {
    const t = this.T(), d = this.state.d, meta = this.blockMeta(), order = this.order();
    const fr = this.fr(), p = (a, b) => fr ? a : b;
    const step = Math.min(this.state.step, order.length - 1);
    const activeId = order[step];
    const c = this.calc();
    const accent = this.props.accent || '#8A2B22';
    const labels = { preMoney: t.lblPre, amount: t.lblAmount, ticket: t.lblTicket, dilution: t.lblDilution, exitValue: t.lblExit, fundSize: t.lblFund,
      ovOwnership: t.cOwnership, ovResidual: t.cResidual, ovMultiple: t.cMultiple, ovFraction: t.cFraction };
    const messages = {
      missing: p('À renseigner pour permettre le calcul.', 'Enter a value to enable the calculation.'),
      number: p('Nombre complet attendu : 1 234,56 ou 1234.56, sans unité ni exposant.', 'Enter a complete number: 1 234,56 or 1234.56, without units or exponents.'),
      positive: p('La valeur doit être strictement positive.', 'The value must be strictly positive.'),
      nonnegative: p('La valeur doit être positive ou nulle.', 'The value must be zero or positive.'),
      percent: p('Le pourcentage doit être compris entre 0 et 100 %.', 'The percentage must be between 0 and 100%.'),
      ticket: p('Le ticket doit être inclus dans la levée et ne peut pas la dépasser.', 'The ticket is part of the round and cannot exceed it.'),
      dependency: p('Renseigner ou corriger les hypothèses nécessaires avant de remplacer ce résultat.', 'Enter or correct the required assumptions before replacing this result.'),
      inconsistent: p('Valeur incompatible avec les hypothèses. Corriger la saisie, modifier les hypothèses ou recalculer.', 'Value inconsistent with the assumptions. Correct it, change the assumptions or recompute.')
    };
    const numericHelp = Object.fromEntries(Object.keys(labels).map(key => [key, {
      invalid: !!c.errors[key], message: c.errors[key] ? messages[c.errors[key]] : ''
    }]));
    const ownDeps = ['preMoney', 'amount', 'ticket', 'ovOwnership'];
    const residualDeps = ownDeps.concat('dilution', 'ovResidual');
    const returnDeps = residualDeps.concat('exitValue');
    const reason = (value, deps) => value != null ? '' : p('Indisponible — ', 'Unavailable — ') +
      (deps.filter(key => c.errors[key]).map(key => labels[key] + ' : ' + messages[c.errors[key]]).join(' ') ||
        p('calcul hors de la plage numérique représentable.', 'calculation outside the representable numeric range.'));
    const showShares = this.props.showPageShares !== false;
    const dense = (this.props.density || 'comfortable') === 'compact';

    const recoMeta = {
      invest: { label: p('Investir', 'Invest'), color: '#2F5A3E', sub: p('la thèse tient, le prix se défend', 'thesis holds, price defensible') },
      pass: { label: p('Passer', 'Pass'), color: accent, sub: p('une raison, pas un faisceau', 'one reason, not a bundle') },
      diligence: { label: p('Poursuivre la diligence', 'Keep digging'), color: '#7A550F', sub: p('une question à trancher, nommée', 'one named question to settle') }
    };

    /* rail */
    const rail = order.map((id, i) => {
      const r = this.req(id), done = r.filter(Boolean).length;
      const pct = r.length ? Math.round(done / r.length * 100) : 0;
      const active = i === step;
      return {
        num: String(i + 1).padStart(2, '0'),
        name: meta[id].name,
        share: showShares ? meta[id].share : '',
        pct: pct,
        barColor: pct === 100 ? '#2F5A3E' : (pct > 0 ? accent : '#DFD9CB'),
        numColor: active ? accent : '#695F50',
        nameWeight: active ? 600 : 400,
        current: active ? 'step' : 'false',
        rowStyle: 'display:flex; gap:12px; align-items:flex-start; width:100%; text-align:left; cursor:pointer; padding:' +
          (dense ? '10px' : '13px') + ' 18px 12px; border:0; border-left:2px solid ' + (active ? '#16150F' : 'transparent') +
          '; background:' + (active ? '#FBFAF6' : 'transparent') + '; color:' + (active ? '#16150F' : '#4A4539'),
        go: () => this.go(i)
      };
    });

    /* score */
    let done = 0, total = 0;
    order.forEach(id => { const r = this.req(id); done += r.filter(Boolean).length; total += r.length; });
    const score = total ? Math.round(done / total * 100) : 0;

    /* six questions */
    const F = v => this.filled(v);
    const q = (this.state.mode === 'screen' ? [
      { text: p('Recommandation et raison renseignées', 'Recommendation and reason entered'), ok: this.req('reco').every(Boolean), to: 'reco' },
      { text: p('Opération renseignée et participation calculable', 'Deal entered and entry stake available'), ok: this.req('deal').every(Boolean) && c.ownEff != null, to: 'deal' },
      { text: p('Condition, mécanisme et issue renseignés', 'Condition, mechanism and outcome entered'), ok: F(d.thesisIf) && F(d.thesisThen) && F(d.thesisOutcome), to: 'thesis' },
      { text: p('Condition de réfutation renseignée', 'Falsification condition entered'), ok: F(d.falsifiedIf), to: 'thesis' },
      { text: p('Trois faits, sources et dates renseignés', 'Three facts, sources and dates entered'), ok: this.req('facts').every(Boolean), to: 'facts' },
      { text: p('Question bloquante renseignée', 'Blocking question entered'), ok: F(d.nextQuestion), to: 'next' }
    ] : [
      { text: p('Pourquoi ce dossier devient-il très grand s’il réussit ?', 'Why does this become very large if it works?'), ok: F(d.thesisThen) && F(d.thesisOutcome) && c.exit != null, to: 'thesis' },
      { text: p('Pourquoi cette équipe ?', 'Why this team?'), ok: F(d.whyTeam), to: this.state.mode === 'screen' ? 'facts' : 'beliefs' },
      { text: p('Pourquoi maintenant ?', 'Why now?'), ok: F(d.whyNow), to: this.state.mode === 'screen' ? 'facts' : 'beliefs' },
      { text: p('Qu’est-ce qui doit être vrai pour que la thèse tienne ?', 'What must be true for the thesis to hold?'), ok: F(d.thesisIf), to: 'thesis' },
      { text: p('Qu’est-ce qui vous donnerait tort ?', 'What would prove you wrong?'), ok: F(d.falsifiedIf) && (this.state.mode === 'screen' || F(d.bearCase)), to: 'thesis' },
      { text: p('Qu’obtient-on pour ce qu’on paie ?', 'What do we get for what we pay?'), ok: c.ownEff != null && c.multEff != null, to: this.state.mode === 'screen' ? 'deal' : 'arith' }
    ]).map(x => ({
      text: x.text, mark: x.ok ? '✓' : '',
      markBg: x.ok ? '#2F5A3E' : 'transparent',
      markBorder: x.ok ? '#2F5A3E' : '#CFC8B8',
      color: x.ok ? '#16150F' : '#695F50',
      go: () => this.goToBlock(x.to)
    }));

    const errs = fr ? [
      'Reformuler le dossier du fondateur sans jugement propre — cela se voit dès la deuxième ligne.',
      'Une taille de marché sans mécanisme : un chiffre de TAM n’est pas une thèse.',
      'Des risques génériques — concurrence, exécution, recrutement — applicables à n’importe quelle entreprise.',
      'Un raisonnement qui ménage toutes les issues et ne prend donc aucune position.',
      'La conclusion placée en dernière ligne.'
    ] : [
      'Restating the founder’s deck with no judgement of your own — it shows by the second line.',
      'A market size with no mechanism: a TAM figure is not a thesis.',
      'Generic risks — competition, execution, hiring — that fit any company.',
      'Reasoning that hedges every outcome and therefore takes no position.',
      'The conclusion placed on the last line.'
    ];

    /* rows */
    const factPh = fr ? [
      'Traction : revenu, clients, rétention, cycle de vente',
      'Équipe : ce que les fondateurs ont construit ou dirigé avant',
      'Produit : ce qui est en production, mesuré ou validé par un tiers',
      'Marché : un fait de terrain établi par vos soins',
      'Fait chiffré et vérifiable'
    ] : [
      'Traction: revenue, customers, retention, sales cycle',
      'Team: what the founders built or ran before',
      'Product: what is in production, measured or third-party validated',
      'Market: a field fact you established yourself',
      'A quantified, verifiable fact'
    ];
    const pill = (on, c1) => 'font:500 8.5px/1 \'JetBrains Mono\',monospace; letter-spacing:.1em; text-transform:uppercase; padding:7px 9px; cursor:pointer; border:0; background:' +
      (on ? c1 : 'transparent') + '; color:' + (on ? '#FBFAF6' : '#695F50');

    const facts = d.facts.map((f, i) => ({
      num: String(i + 1).padStart(2, '0'),
      text: f.text, source: f.source, date: f.date,
      textLabel: p('Fait ' + (i + 1), 'Fact ' + (i + 1)),
      sourceLabel: p('Source ' + (i + 1), 'Source ' + (i + 1)),
      dateLabel: p('Date du fait ' + (i + 1), 'Fact ' + (i + 1) + ' date'),
      statusLabel: p('Statut du fait ' + (i + 1), 'Fact ' + (i + 1) + ' status'),
      removeLabel: p('Supprimer le fait ' + (i + 1), 'Remove fact ' + (i + 1)),
      ph: factPh[i] || factPh[4],
      onText: this.rowEv('facts', i, 'text'),
      onSource: e => this.setRow('facts', i, 'source', e.target.value),
      onDate: e => this.setRow('facts', i, 'date', e.target.value),
      setVerified: () => this.setRow('facts', i, 'status', 'verified'),
      setDeclared: () => this.setRow('facts', i, 'status', 'declared'),
      verifiedSelected: f.status === 'verified',
      declaredSelected: f.status !== 'verified',
      stVerified: pill(f.status === 'verified', '#2F5A3E'),
      stDeclared: pill(f.status !== 'verified', '#7A550F'),
      remove: () => this.delRow('facts', i)
    }));

    const convLevels = (val, onPick) => [
      { k: 'high', label: t.convHigh, c: '#2F5A3E' },
      { k: 'med', label: t.convMed, c: '#7A550F' },
      { k: 'low', label: t.convLow, c: '#695F50' }
    ].map(l => ({ label: l.label, selected: val === l.k, style: pill(val === l.k, l.c), pick: () => onPick(l.k) }));

    const pillars = [
      {
        label: p('Pourquoi cette équipe plutôt qu’une autre sur ce problème', 'Why this team rather than another on this problem'),
        convictionLabel: p('Niveau de conviction — équipe', 'Conviction level — team'),
        ph: p('Le jugement, et la raison qui le porte.', 'The judgement, and the reason behind it.'),
        value: d.whyTeam, onChange: this.ev('whyTeam'),
        levels: convLevels(d.whyTeamConv, k => this.setD('whyTeamConv', k))
      },
      {
        label: p('Pourquoi maintenant — ce qui a changé récemment', 'Why now — what changed recently'),
        convictionLabel: p('Niveau de conviction — temporalité', 'Conviction level — timing'),
        ph: p('Ce qui rend la fenêtre ouverte aujourd’hui et pas il y a trois ans.', 'What makes the window open today and not three years ago.'),
        value: d.whyNow, onChange: this.ev('whyNow'),
        levels: convLevels(d.whyNowConv, k => this.setD('whyNowConv', k))
      }
    ];

    const beliefs = d.beliefs.map((b, i) => ({
      num: String(i + 1).padStart(2, '0'),
      text: b.text, because: b.because,
      textLabel: p('Jugement ' + (i + 1), 'Judgement ' + (i + 1)),
      becauseLabel: p('Raison ' + (i + 1), 'Reason ' + (i + 1)),
      convictionLabel: p('Niveau de conviction du jugement ' + (i + 1), 'Judgement ' + (i + 1) + ' conviction level'),
      removeLabel: p('Supprimer le jugement ' + (i + 1), 'Remove judgement ' + (i + 1)),
      onText: this.rowEv('beliefs', i, 'text'),
      onBecause: e => this.setRow('beliefs', i, 'because', e.target.value),
      levels: convLevels(b.conv, k => this.setRow('beliefs', i, 'conv', k)),
      remove: () => this.delRow('beliefs', i)
    }));

    const unknowns = d.unknowns.map((u, i) => ({
      num: String(i + 1).padStart(2, '0'),
      q: u.q, how: u.how,
      questionLabel: p('Question ' + (i + 1), 'Question ' + (i + 1)),
      verificationLabel: p('Action de vérification ' + (i + 1), 'Verification action ' + (i + 1)),
      removeLabel: p('Supprimer la question ' + (i + 1), 'Remove question ' + (i + 1)),
      onQ: this.rowEv('unknowns', i, 'q'),
      onHow: e => this.setRow('unknowns', i, 'how', e.target.value),
      remove: () => this.delRow('unknowns', i)
    }));

    const risks = d.risks.map((r, i) => ({
      num: String(i + 1).padStart(2, '0'),
      text: r.text, mitigation: r.mitigation,
      riskLabel: p('Risque ' + (i + 1), 'Risk ' + (i + 1)),
      mitigationLabel: p('Atténuation ' + (i + 1), 'Mitigation ' + (i + 1)),
      removeLabel: p('Supprimer le risque ' + (i + 1), 'Remove risk ' + (i + 1)),
      numColor: i > 2 ? accent : '#695F50',
      onText: this.rowEv('risks', i, 'text'),
      onMitigation: e => this.setRow('risks', i, 'mitigation', e.target.value),
      remove: () => this.delRow('risks', i)
    }));

    /* arithmetic rows */
    const mkRow = (key, label, formula, unit, value, deps) => {
      const ovKey = 'ov' + key;
      const isOv = !!this.state.editingOverrides[ovKey] || this.filled(d[ovKey]);
      return {
        label: label, formula: formula, unit: unit,
        id: 'memo-' + ovKey, helpId: 'memo-' + ovKey + '-help',
        invalid: !!c.errors[ovKey], reason: reason(value, deps),
        isOverridden: isOv, isComputed: !isOv,
        display: value == null ? '—' : this.fmt(value) + (unit ? ' ' + unit : ''),
        ov: d[ovKey],
        onOv: e => this.setD(ovKey, e.target.value),
        toggle: () => this.up({
          editingOverrides: Object.assign({}, this.state.editingOverrides, { [ovKey]: !isOv }),
          d: Object.assign({}, d, { [ovKey]: isOv || value == null ? '' : new Intl.NumberFormat('en-US', { useGrouping: false, maximumSignificantDigits: 21 }).format(value) })
        }),
        btnLabel: isOv ? t.restore : t.override,
        btnStyle: 'font:400 9px/1 \'JetBrains Mono\',monospace; letter-spacing:.1em; text-transform:uppercase; color:' +
          (isOv ? accent : '#695F50') + '; background:transparent; border:0; text-align:right; cursor:pointer; padding:4px 0'
      };
    };
    const calcRows = [
      mkRow('Ownership', t.cOwnership, t.fOwnership, '%', c.ownEff, ownDeps),
      mkRow('Residual', t.cResidual, t.fResidual, '%', c.residEff, residualDeps),
      mkRow('Multiple', t.cMultiple, t.fMultiple, '×', c.multEff, returnDeps.concat('ovMultiple')),
      mkRow('Fraction', t.cFraction, t.fFraction, '×', c.fracEff, returnDeps.concat('fundSize', 'ovFraction'))
    ];

    const cur = t.cur;
    const arithSentence = (() => {
      const show = (value, unit) => value == null ? p('indisponible', 'unavailable') : this.fmt(value) + ' ' + unit;
      return [
        t.cOwnership + ' : ' + show(c.ownEff, '%'),
        p('Dilution cumulée', 'Cumulative dilution') + ' : ' + show(c.dil, '%'),
        t.cResidual + ' : ' + show(c.residEff, '%'),
        p('Valeur de sortie des fonds propres', 'Exit equity value') + ' : ' + show(c.exit, cur),
        t.lblFund + ' : ' + show(c.fund, cur),
        p('Produit brut de sortie', 'Gross exit proceeds') + ' : ' + show(c.ret, cur),
        t.cMultiple + ' : ' + show(c.multEff, '×'),
        t.cFraction + ' : ' + show(c.fracEff, '×')
      ].join('. ') + '.';
    })();

    const thesisSentence = (() => {
      const a = d.thesisIf || (fr ? '[condition observable]' : '[observable condition]');
      const b = d.thesisThen || (fr ? '[mécanisme de création de valeur]' : '[value-creation mechanism]');
      const cc = d.thesisOutcome || (fr ? '[issue]' : '[outcome]');
      return fr
        ? 'Si ' + a + ' se confirme, alors ' + b + ', ce qui place l’entreprise en position de ' + cc + '.'
        : 'If ' + a + ' holds, then ' + b + ', which puts the company in a position to ' + cc + '.';
    })();

    /* preview */
    const rm = recoMeta[d.reco];
    const metaBits = [d.author, this.fdate(d.date), d.version, fr ? 'Confidentiel — usage interne' : 'Confidential — internal use']
      .filter(x => this.filled(x)).join('  ·  ');
    const dealBits = [
      d.round ? (fr ? 'Tour ' : 'Round ') + d.round : '',
      c.amt != null ? (fr ? 'levée ' : 'raise ') + this.fmt(c.amt) + ' ' + cur : p('levée indisponible', 'round size unavailable'),
      c.pre != null ? 'pre-money ' + this.fmt(c.pre) + ' ' + cur : p('pre-money indisponible', 'pre-money unavailable'),
      c.tick != null ? 'ticket ' + this.fmt(c.tick) + ' ' + cur : p('ticket indisponible', 'ticket unavailable'),
      c.ownEff != null ? (fr ? 'ownership à l’entrée ' : 'ownership at entry ') + this.fmt(c.ownEff) + ' %' : p('ownership à l’entrée indisponible', 'ownership at entry unavailable'),
      d.coInvestors ? (fr ? 'co-investisseurs ' + d.coInvestors : 'co-investors ' + d.coInvestors) : ''
    ].filter(Boolean).join(' · ');

    const sec = (label, body, items) => ({
      label: label,
      hasBody: this.filled(body),
      body: body || '',
      items: items || []
    });
    const dash = fr ? '—' : '—';
    const factItems = d.facts.filter(f => this.filled(f.text)).map(f => ({
      text: f.text,
      dot: f.status === 'verified' ? '#2F5A3E' : '#7A550F',
      meta: [f.source, this.fdate(f.date), f.status === 'verified' ? t.verified : t.declared]
        .filter(x => this.filled(x)).length ? dash + ' ' + [f.source, this.fdate(f.date), f.status === 'verified' ? t.verified : t.declared].filter(x => this.filled(x)).join(' · ') : ''
    }));
    const convLbl = k => k === 'high' ? t.convHigh : (k === 'low' ? t.convLow : t.convMed);
    const beliefItems = []
      .concat(this.filled(d.whyTeam) ? [{ text: d.whyTeam, dot: '#16150F', meta: dash + ' ' + (fr ? 'équipe · conviction ' : 'team · conviction ') + convLbl(d.whyTeamConv) }] : [])
      .concat(this.filled(d.whyNow) ? [{ text: d.whyNow, dot: '#16150F', meta: dash + ' ' + (fr ? 'timing · conviction ' : 'timing · conviction ') + convLbl(d.whyNowConv) }] : [])
      .concat(d.beliefs.filter(b => this.filled(b.text)).map(b => ({
        text: b.text + (this.filled(b.because) ? (fr ? ' parce que ' : ' because ') + b.because : ''),
        dot: '#16150F',
        meta: dash + ' ' + (fr ? 'conviction ' : 'conviction ') + convLbl(b.conv)
      })));
    const unknownItems = d.unknowns.filter(u => this.filled(u.q)).map(u => ({
      text: u.q, dot: '#7A550F',
      meta: this.filled(u.how) ? dash + ' ' + (fr ? 'se lève par ' : 'lifted by ') + u.how : ''
    }));
    const riskItems = d.risks.filter(r => this.filled(r.text)).map(r => ({
      text: r.text, dot: accent,
      meta: this.filled(r.mitigation) ? dash + ' ' + r.mitigation : ''
    }));
    const nextLine = [
      d.nextAction, d.nextOwner, this.fdate(d.nextDue)
    ].filter(x => this.filled(x)).join(' — ') +
      (this.filled(d.nextQuestion) ? (fr ? '. Doit trancher : ' : '. Must settle: ') + d.nextQuestion : '');

    const screen = this.state.mode === 'screen';
    let sections;
    if (screen) {
      sections = [
        sec(fr ? 'Opération' : 'Deal', dealBits, []),
        sec(fr ? 'Thèse' : 'Thesis', thesisSentence + (this.filled(d.falsifiedIf) ? p(' La thèse est fausse si ', ' The thesis is wrong if ') + d.falsifiedIf : ''), []),
        sec(fr ? 'Trois faits' : 'Three facts', '', factItems.slice(0, 3)),
        sec(fr ? 'Question bloquante' : 'Blocking question', d.nextQuestion, [])
      ];
    } else {
      sections = [
        sec(fr ? 'Opération' : 'Deal', dealBits, []),
        sec(fr ? 'Activité' : 'What they do', d.activity, []),
        sec(fr ? 'Thèse' : 'Thesis', thesisSentence + (this.filled(d.falsifiedIf) ? (fr ? ' La thèse est fausse si ' : ' The thesis is wrong if ') + d.falsifiedIf : ''), []),
        sec(fr ? 'Ce que nous savons' : 'What we know', '', factItems),
        sec(fr ? 'Ce que nous croyons' : 'What we believe', '', beliefItems),
        sec(fr ? 'Ce que nous ignorons' : 'What we don’t know', '', unknownItems),
        sec(fr ? 'Risques' : 'Risks', '', riskItems),
        sec(fr ? 'Cas défavorable' : 'Bear case', d.bearCase, []),
        sec(fr ? 'Arithmétique' : 'Arithmetic', arithSentence, []),
        sec(fr ? 'Prochaine étape' : 'Next step', nextLine, [])
      ];
    }
    sections.push(sec(p('Méthode', 'Method'), t.method, []));
    sections = sections.filter(s => s.hasBody || s.items.length);

    const prevId = order[step - 1], nextId = order[step + 1];
    const navBtn = (on) => 'font:500 9.5px/1 \'JetBrains Mono\',monospace; letter-spacing:.14em; text-transform:uppercase; padding:12px 16px; cursor:' +
      (on ? 'pointer' : 'default') + '; border:1px solid ' + (on ? '#16150F' : '#E4DFD3') + '; background:transparent; color:' + (on ? '#16150F' : '#695F50');
    const seg = (on) => 'font:500 9.5px/1 \'JetBrains Mono\',monospace; letter-spacing:.12em; padding:8px 11px; cursor:pointer; border:0; background:' +
      (on ? '#16150F' : 'transparent') + '; color:' + (on ? '#F7F5F0' : '#6B6558');

    return {
      t: t, d: d, dens: dense ? '1' : '0', accent: accent,
      rootRef: this.rootRef, pageRef: this.pageRef, headingRef: this.headingRef, previewRef: this.previewRef,
      storageError: this.state.storageError ? t.storageError : '',
      isForm: this.state.view === 'form', isPreview: this.state.view === 'preview',
      modeFullSelected: !screen, modeScreenSelected: screen,
      viewFormSelected: this.state.view === 'form', viewPreviewSelected: this.state.view === 'preview',
      headerTitle: this.filled(d.company) ? d.company : (fr ? 'Nouvelle note' : 'New memo'),
      langLabel: fr ? 'FR / en' : 'fr / EN',
      langA11y: fr ? 'Passer l’interface en anglais' : 'Switch the interface to French',
      toggleLang: () => this.up({ lang: fr ? 'en' : 'fr' }),
      setModeFull: () => this.up({ mode: 'full', step: 0 }),
      setModeScreen: () => this.up({ mode: 'screen', step: 0 }),
      setViewForm: () => this.setState({ view: 'form' }, () => {
        if (this.headingRef.current) this.headingRef.current.focus();
      }),
      setViewPreview: () => this.setState({ view: 'preview' }, () => {
        if (!this.previewRef.current) return;
        this.previewRef.current.focus();
        this.previewRef.current.scrollIntoView({ block: 'start' });
      }),
      doExport: () => {
        this.setState({ view: 'preview' }, () => setTimeout(() => { try { window.print(); } catch (e) { } }, 420));
      },
      reset: () => {
        if (typeof window !== 'undefined' && !window.confirm(fr ? 'Vider toute la note ?' : 'Clear the whole memo?')) return;
        this.clearSavedMemo();
      },
      st: {
        modeFull: seg(!screen), modeScreen: seg(screen),
        viewForm: seg(this.state.view === 'form'), viewPreview: seg(this.state.view === 'preview'),
        prevBtn: navBtn(!!prevId), nextBtn: navBtn(!!nextId)
      },
      rail: rail,
      leftOpen: this.state.leftOpen,
      rightOpen: this.state.rightOpen,
      gridCols: (this.state.leftOpen ? this.state.leftW : 0) + 'px minmax(0,1fr) ' + (this.state.rightOpen ? this.state.rightW : 0) + 'px',
      toggleLeft: this.togglePane('left'),
      toggleRight: this.togglePane('right'),
      leftCaret: this.state.leftOpen ? '◂' : '▸',
      rightCaret: this.state.rightOpen ? '▸' : '◂',
      at: {
        reco: activeId === 'reco', deal: activeId === 'deal', activity: activeId === 'activity',
        thesis: activeId === 'thesis', facts: activeId === 'facts', beliefs: activeId === 'beliefs',
        unknowns: activeId === 'unknowns', risks: activeId === 'risks', arith: activeId === 'arith',
        next: activeId === 'next'
      },
      stepNum: String(step + 1).padStart(2, '0'), stepTotal: String(order.length).padStart(2, '0'),
      activeName: meta[activeId].name,
      activeHint: meta[activeId].hint,
      activeShare: showShares && meta[activeId].share ? meta[activeId].share + ' ' + (fr ? 'de la page' : 'of the page') : (fr ? 'une phrase suffit' : 'one sentence is enough'),
      goPrev: prevId ? () => this.go(step - 1) : () => {},
      goNext: nextId ? () => this.go(step + 1) : () => {},
      prevDisabled: !prevId,
      nextDisabled: !nextId,
      prevLabel: prevId ? meta[prevId].name : (fr ? 'Début' : 'Start'),
      nextLabel: nextId ? meta[nextId].name : (fr ? 'Terminé' : 'Done'),
      set: {
        recoWhy: this.ev('recoWhy'), company: this.ev('company'), author: this.ev('author'),
        date: this.ev('date'), version: this.ev('version'), round: this.ev('round'),
        coInvestors: this.ev('coInvestors'), amount: this.ev('amount'), preMoney: this.ev('preMoney'),
        ticket: this.ev('ticket'), activity: this.ev('activity'), falsifiedIf: this.ev('falsifiedIf'),
        bearCase: this.ev('bearCase'), dilution: this.ev('dilution'), exitValue: this.ev('exitValue'),
        fundSize: this.ev('fundSize'), nextAction: this.ev('nextAction'), nextOwner: this.ev('nextOwner'),
        nextDue: this.ev('nextDue'), nextQuestion: this.ev('nextQuestion')
      },
      recoOptions: ['invest', 'pass', 'diligence'].map(k => ({
        label: recoMeta[k].label, sub: recoMeta[k].sub, dot: recoMeta[k].color,
        selected: d.reco === k,
        pick: () => this.setD('reco', k),
        cardStyle: 'display:flex; flex-direction:column; gap:9px; align-items:flex-start; padding:' + (dense ? '15px 15px 17px' : '18px 18px 20px') +
          '; cursor:pointer; background:' + (d.reco === k ? '#FBFAF6' : 'transparent') +
          '; border:1px solid ' + (d.reco === k ? '#16150F' : '#DCD6C8') +
          '; box-shadow:' + (d.reco === k ? 'inset 0 0 0 1px #16150F' : 'none')
      })),
      thesisFields: [
        { connector: fr ? 'Si' : 'If', label: fr ? 'condition observable' : 'observable condition', value: d.thesisIf, onChange: this.ev('thesisIf'), ph: fr ? 'ce qui doit se confirmer' : 'what must hold' },
        { connector: fr ? 'alors' : 'then', label: fr ? 'mécanisme de création de valeur' : 'value-creation mechanism', value: d.thesisThen, onChange: this.ev('thesisThen'), ph: fr ? 'par quel mécanisme la valeur se crée' : 'by what mechanism value is created' },
        { connector: fr ? 'donc' : 'so', label: fr ? 'issue' : 'outcome', value: d.thesisOutcome, onChange: this.ev('thesisOutcome'), ph: fr ? 'la position que cela donne à l’entreprise' : 'the position that gives the company' }
      ],
      thesisSentence: thesisSentence,
      facts: facts, addFact: () => this.addRow('facts', { text: '', source: '', date: '', status: 'declared' }),
      pillars: pillars,
      beliefs: beliefs, addBelief: () => this.addRow('beliefs', { text: '', because: '', conv: 'med' }),
      unknowns: unknowns, addUnknown: () => this.addRow('unknowns', { q: '', how: '' }),
      risks: risks, addRisk: () => this.addRow('risks', { text: '', mitigation: '' }),
      riskWarn: d.risks.length > 3 ? t.riskTooMany : t.riskOk,
      riskWarnColor: d.risks.length > 3 ? accent : '#695F50',
      calc: {
        ownership: c.ownEff != null ? this.fmt(c.ownEff) + ' %' : '—',
        ownershipReason: reason(c.ownEff, ownDeps),
        postLine: c.post != null ? 'post-money ' + this.fmt(c.post) + ' ' + cur : p('Renseigner une pre-money et une levée valides.', 'Enter valid pre-money and round size.'),
        proceeds: c.ret == null ? '—' : this.fmt(c.ret) + ' ' + cur,
        proceedsReason: reason(c.ret, returnDeps)
      },
      numericHelp: numericHelp,
      calcRows: calcRows,
      arithSentence: arithSentence,
      score: score,
      scoreColor: score === 100 ? '#2F5A3E' : (score > 55 ? '#16150F' : accent),
      scoreNote: p(done + ' champs requis valides sur ' + total + '. Ce taux ne mesure ni la véracité des faits ni la qualité du raisonnement.', done + ' valid required fields out of ' + total + '. This rate assesses neither factual accuracy nor reasoning quality.'),
      sixQuestions: q,
      commonErrors: errs.map((e, i) => ({ n: String(i + 1), text: e })),
      overflowNote: this.state.overflow ? t.overflowBad : t.overflowOk,
      overflowColor: this.state.overflow ? accent : '#695F50',
      pv: {
        company: this.filled(d.company) ? d.company : (fr ? '[Entreprise]' : '[Company]'),
        metaLine: metaBits,
        docKind: screen ? (fr ? 'Screening' : 'Screening') : (fr ? 'Note d’investissement' : 'Investment memo'),
        recoLabel: rm ? rm.label : (fr ? 'À trancher' : 'To settle'),
        recoColor: rm ? rm.color : '#695F50',
        recoWhy: this.filled(d.recoWhy) ? d.recoWhy : (fr ? '[Une phrase : la raison principale.]' : '[One sentence: the main reason.]'),
        sections: sections,
        footLeft: [d.author, this.fdate(d.date), d.version].filter(x => this.filled(x)).join(' · '),
        footRight: fr ? 'Confidentiel — usage interne' : 'Confidential — internal use'
      }
    };
  }

  rowEv(list, i, k) {
    return (e) => { this.grow(e.target); this.setRow(list, i, k, e.target.value); };
  }
}

