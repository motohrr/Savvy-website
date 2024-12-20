function x(a) {
  return typeof a == 'string' || a instanceof String;
}
function W(a) {
  var e;
  return (
    typeof a == 'object' &&
    a != null &&
    (a == null || (e = a.constructor) == null ? void 0 : e.name) === 'Object'
  );
}
function ie(a, e) {
  return Array.isArray(e)
    ? ie(a, (t, s) => e.includes(s))
    : Object.entries(a).reduce((t, s) => {
        let [i, n] = s;
        return e(n, i) && (t[i] = n), t;
      }, {});
}
const d = {
  NONE: 'NONE',
  LEFT: 'LEFT',
  FORCE_LEFT: 'FORCE_LEFT',
  RIGHT: 'RIGHT',
  FORCE_RIGHT: 'FORCE_RIGHT'
};
function de(a) {
  switch (a) {
    case d.LEFT:
      return d.FORCE_LEFT;
    case d.RIGHT:
      return d.FORCE_RIGHT;
    default:
      return a;
  }
}
function H(a) {
  return a.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
}
function R(a, e) {
  if (e === a) return !0;
  const t = Array.isArray(e),
    s = Array.isArray(a);
  let i;
  if (t && s) {
    if (e.length != a.length) return !1;
    for (i = 0; i < e.length; i++) if (!R(e[i], a[i])) return !1;
    return !0;
  }
  if (t != s) return !1;
  if (e && a && typeof e == 'object' && typeof a == 'object') {
    const n = e instanceof Date,
      r = a instanceof Date;
    if (n && r) return e.getTime() == a.getTime();
    if (n != r) return !1;
    const o = e instanceof RegExp,
      u = a instanceof RegExp;
    if (o && u) return e.toString() == a.toString();
    if (o != u) return !1;
    const l = Object.keys(e);
    for (i = 0; i < l.length; i++)
      if (!Object.prototype.hasOwnProperty.call(a, l[i])) return !1;
    for (i = 0; i < l.length; i++) if (!R(a[l[i]], e[l[i]])) return !1;
    return !0;
  } else if (e && a && typeof e == 'function' && typeof a == 'function')
    return e.toString() === a.toString();
  return !1;
}
class ce {
  constructor(e) {
    for (
      Object.assign(this, e);
      this.value.slice(0, this.startChangePos) !==
      this.oldValue.slice(0, this.startChangePos);

    )
      --this.oldSelection.start;
    if (this.insertedCount)
      for (
        ;
        this.value.slice(this.cursorPos) !==
        this.oldValue.slice(this.oldSelection.end);

      )
        this.value.length - this.cursorPos <
        this.oldValue.length - this.oldSelection.end
          ? ++this.oldSelection.end
          : ++this.cursorPos;
  }
  get startChangePos() {
    return Math.min(this.cursorPos, this.oldSelection.start);
  }
  get insertedCount() {
    return this.cursorPos - this.startChangePos;
  }
  get inserted() {
    return this.value.substr(this.startChangePos, this.insertedCount);
  }
  get removedCount() {
    return Math.max(
      this.oldSelection.end - this.startChangePos ||
        this.oldValue.length - this.value.length,
      0
    );
  }
  get removed() {
    return this.oldValue.substr(this.startChangePos, this.removedCount);
  }
  get head() {
    return this.value.substring(0, this.startChangePos);
  }
  get tail() {
    return this.value.substring(this.startChangePos + this.insertedCount);
  }
  get removeDirection() {
    return !this.removedCount || this.insertedCount
      ? d.NONE
      : (this.oldSelection.end === this.cursorPos ||
            this.oldSelection.start === this.cursorPos) &&
          this.oldSelection.end === this.oldSelection.start
        ? d.RIGHT
        : d.LEFT;
  }
}
function p(a, e) {
  return new p.InputMask(a, e);
}
function re(a) {
  if (a == null) throw new Error('mask property should be defined');
  return a instanceof RegExp
    ? p.MaskedRegExp
    : x(a)
      ? p.MaskedPattern
      : a === Date
        ? p.MaskedDate
        : a === Number
          ? p.MaskedNumber
          : Array.isArray(a) || a === Array
            ? p.MaskedDynamic
            : p.Masked && a.prototype instanceof p.Masked
              ? a
              : p.Masked && a instanceof p.Masked
                ? a.constructor
                : a instanceof Function
                  ? p.MaskedFunction
                  : (console.warn('Mask not found for mask', a), p.Masked);
}
function L(a) {
  if (!a) throw new Error('Options in not defined');
  if (p.Masked) {
    if (a.prototype instanceof p.Masked) return { mask: a };
    const { mask: e = void 0, ...t } =
      a instanceof p.Masked
        ? { mask: a }
        : W(a) && a.mask instanceof p.Masked
          ? a
          : {};
    if (e) {
      const s = e.mask;
      return {
        ...ie(e, (i, n) => !n.startsWith('_')),
        mask: e.constructor,
        _mask: s,
        ...t
      };
    }
  }
  return W(a) ? { ...a } : { mask: a };
}
function w(a) {
  if (p.Masked && a instanceof p.Masked) return a;
  const e = L(a),
    t = re(e.mask);
  if (!t)
    throw new Error(
      'Masked class is not found for provided mask ' +
        e.mask +
        ', appropriate module needs to be imported manually before creating mask.'
    );
  return (
    e.mask === t && delete e.mask,
    e._mask && ((e.mask = e._mask), delete e._mask),
    new t(e)
  );
}
p.createMask = w;
class Z {
  get selectionStart() {
    let e;
    try {
      e = this._unsafeSelectionStart;
    } catch {}
    return e ?? this.value.length;
  }
  get selectionEnd() {
    let e;
    try {
      e = this._unsafeSelectionEnd;
    } catch {}
    return e ?? this.value.length;
  }
  select(e, t) {
    if (
      !(
        e == null ||
        t == null ||
        (e === this.selectionStart && t === this.selectionEnd)
      )
    )
      try {
        this._unsafeSelect(e, t);
      } catch {}
  }
  get isActive() {
    return !1;
  }
}
p.MaskElement = Z;
const X = 90,
  pe = 89;
class j extends Z {
  constructor(e) {
    super(),
      (this.input = e),
      (this._onKeydown = this._onKeydown.bind(this)),
      (this._onInput = this._onInput.bind(this)),
      (this._onBeforeinput = this._onBeforeinput.bind(this)),
      (this._onCompositionEnd = this._onCompositionEnd.bind(this));
  }
  get rootElement() {
    var e, t, s;
    return (e =
      (t = (s = this.input).getRootNode) == null ? void 0 : t.call(s)) != null
      ? e
      : document;
  }
  get isActive() {
    return this.input === this.rootElement.activeElement;
  }
  bindEvents(e) {
    this.input.addEventListener('keydown', this._onKeydown),
      this.input.addEventListener('input', this._onInput),
      this.input.addEventListener('beforeinput', this._onBeforeinput),
      this.input.addEventListener('compositionend', this._onCompositionEnd),
      this.input.addEventListener('drop', e.drop),
      this.input.addEventListener('click', e.click),
      this.input.addEventListener('focus', e.focus),
      this.input.addEventListener('blur', e.commit),
      (this._handlers = e);
  }
  _onKeydown(e) {
    if (
      this._handlers.redo &&
      ((e.keyCode === X && e.shiftKey && (e.metaKey || e.ctrlKey)) ||
        (e.keyCode === pe && e.ctrlKey))
    )
      return e.preventDefault(), this._handlers.redo(e);
    if (this._handlers.undo && e.keyCode === X && (e.metaKey || e.ctrlKey))
      return e.preventDefault(), this._handlers.undo(e);
    e.isComposing || this._handlers.selectionChange(e);
  }
  _onBeforeinput(e) {
    if (e.inputType === 'historyUndo' && this._handlers.undo)
      return e.preventDefault(), this._handlers.undo(e);
    if (e.inputType === 'historyRedo' && this._handlers.redo)
      return e.preventDefault(), this._handlers.redo(e);
  }
  _onCompositionEnd(e) {
    this._handlers.input(e);
  }
  _onInput(e) {
    e.isComposing || this._handlers.input(e);
  }
  unbindEvents() {
    this.input.removeEventListener('keydown', this._onKeydown),
      this.input.removeEventListener('input', this._onInput),
      this.input.removeEventListener('beforeinput', this._onBeforeinput),
      this.input.removeEventListener('compositionend', this._onCompositionEnd),
      this.input.removeEventListener('drop', this._handlers.drop),
      this.input.removeEventListener('click', this._handlers.click),
      this.input.removeEventListener('focus', this._handlers.focus),
      this.input.removeEventListener('blur', this._handlers.commit),
      (this._handlers = {});
  }
}
p.HTMLMaskElement = j;
class fe extends j {
  constructor(e) {
    super(e), (this.input = e);
  }
  get _unsafeSelectionStart() {
    return this.input.selectionStart != null
      ? this.input.selectionStart
      : this.value.length;
  }
  get _unsafeSelectionEnd() {
    return this.input.selectionEnd;
  }
  _unsafeSelect(e, t) {
    this.input.setSelectionRange(e, t);
  }
  get value() {
    return this.input.value;
  }
  set value(e) {
    this.input.value = e;
  }
}
p.HTMLMaskElement = j;
class ne extends j {
  get _unsafeSelectionStart() {
    const e = this.rootElement,
      t = e.getSelection && e.getSelection(),
      s = t && t.anchorOffset,
      i = t && t.focusOffset;
    return i == null || s == null || s < i ? s : i;
  }
  get _unsafeSelectionEnd() {
    const e = this.rootElement,
      t = e.getSelection && e.getSelection(),
      s = t && t.anchorOffset,
      i = t && t.focusOffset;
    return i == null || s == null || s > i ? s : i;
  }
  _unsafeSelect(e, t) {
    if (!this.rootElement.createRange) return;
    const s = this.rootElement.createRange();
    s.setStart(this.input.firstChild || this.input, e),
      s.setEnd(this.input.lastChild || this.input, t);
    const i = this.rootElement,
      n = i.getSelection && i.getSelection();
    n && (n.removeAllRanges(), n.addRange(s));
  }
  get value() {
    return this.input.textContent || '';
  }
  set value(e) {
    this.input.textContent = e;
  }
}
p.HTMLContenteditableMaskElement = ne;
class $ {
  constructor() {
    (this.states = []), (this.currentIndex = 0);
  }
  get currentState() {
    return this.states[this.currentIndex];
  }
  get isEmpty() {
    return this.states.length === 0;
  }
  push(e) {
    this.currentIndex < this.states.length - 1 &&
      (this.states.length = this.currentIndex + 1),
      this.states.push(e),
      this.states.length > $.MAX_LENGTH && this.states.shift(),
      (this.currentIndex = this.states.length - 1);
  }
  go(e) {
    return (
      (this.currentIndex = Math.min(
        Math.max(this.currentIndex + e, 0),
        this.states.length - 1
      )),
      this.currentState
    );
  }
  undo() {
    return this.go(-1);
  }
  redo() {
    return this.go(1);
  }
  clear() {
    (this.states.length = 0), (this.currentIndex = 0);
  }
}
$.MAX_LENGTH = 100;
class ge {
  constructor(e, t) {
    (this.el =
      e instanceof Z
        ? e
        : e.isContentEditable &&
            e.tagName !== 'INPUT' &&
            e.tagName !== 'TEXTAREA'
          ? new ne(e)
          : new fe(e)),
      (this.masked = w(t)),
      (this._listeners = {}),
      (this._value = ''),
      (this._unmaskedValue = ''),
      (this._rawInputValue = ''),
      (this.history = new $()),
      (this._saveSelection = this._saveSelection.bind(this)),
      (this._onInput = this._onInput.bind(this)),
      (this._onChange = this._onChange.bind(this)),
      (this._onDrop = this._onDrop.bind(this)),
      (this._onFocus = this._onFocus.bind(this)),
      (this._onClick = this._onClick.bind(this)),
      (this._onUndo = this._onUndo.bind(this)),
      (this._onRedo = this._onRedo.bind(this)),
      (this.alignCursor = this.alignCursor.bind(this)),
      (this.alignCursorFriendly = this.alignCursorFriendly.bind(this)),
      this._bindEvents(),
      this.updateValue(),
      this._onChange();
  }
  maskEquals(e) {
    var t;
    return e == null || ((t = this.masked) == null ? void 0 : t.maskEquals(e));
  }
  get mask() {
    return this.masked.mask;
  }
  set mask(e) {
    if (this.maskEquals(e)) return;
    if (!(e instanceof p.Masked) && this.masked.constructor === re(e)) {
      this.masked.updateOptions({ mask: e });
      return;
    }
    const t = e instanceof p.Masked ? e : w({ mask: e });
    (t.unmaskedValue = this.masked.unmaskedValue), (this.masked = t);
  }
  get value() {
    return this._value;
  }
  set value(e) {
    this.value !== e && ((this.masked.value = e), this.updateControl('auto'));
  }
  get unmaskedValue() {
    return this._unmaskedValue;
  }
  set unmaskedValue(e) {
    this.unmaskedValue !== e &&
      ((this.masked.unmaskedValue = e), this.updateControl('auto'));
  }
  get rawInputValue() {
    return this._rawInputValue;
  }
  set rawInputValue(e) {
    this.rawInputValue !== e &&
      ((this.masked.rawInputValue = e),
      this.updateControl(),
      this.alignCursor());
  }
  get typedValue() {
    return this.masked.typedValue;
  }
  set typedValue(e) {
    this.masked.typedValueEquals(e) ||
      ((this.masked.typedValue = e), this.updateControl('auto'));
  }
  get displayValue() {
    return this.masked.displayValue;
  }
  _bindEvents() {
    this.el.bindEvents({
      selectionChange: this._saveSelection,
      input: this._onInput,
      drop: this._onDrop,
      click: this._onClick,
      focus: this._onFocus,
      commit: this._onChange,
      undo: this._onUndo,
      redo: this._onRedo
    });
  }
  _unbindEvents() {
    this.el && this.el.unbindEvents();
  }
  _fireEvent(e, t) {
    const s = this._listeners[e];
    s && s.forEach((i) => i(t));
  }
  get selectionStart() {
    return this._cursorChanging
      ? this._changingCursorPos
      : this.el.selectionStart;
  }
  get cursorPos() {
    return this._cursorChanging
      ? this._changingCursorPos
      : this.el.selectionEnd;
  }
  set cursorPos(e) {
    !this.el ||
      !this.el.isActive ||
      (this.el.select(e, e), this._saveSelection());
  }
  _saveSelection() {
    this.displayValue !== this.el.value &&
      console.warn(
        'Element value was changed outside of mask. Syncronize mask using `mask.updateValue()` to work properly.'
      ),
      (this._selection = { start: this.selectionStart, end: this.cursorPos });
  }
  updateValue() {
    (this.masked.value = this.el.value),
      (this._value = this.masked.value),
      (this._unmaskedValue = this.masked.unmaskedValue),
      (this._rawInputValue = this.masked.rawInputValue);
  }
  updateControl(e) {
    const t = this.masked.unmaskedValue,
      s = this.masked.value,
      i = this.masked.rawInputValue,
      n = this.displayValue,
      r =
        this.unmaskedValue !== t ||
        this.value !== s ||
        this._rawInputValue !== i;
    (this._unmaskedValue = t),
      (this._value = s),
      (this._rawInputValue = i),
      this.el.value !== n && (this.el.value = n),
      e === 'auto' ? this.alignCursor() : e != null && (this.cursorPos = e),
      r && this._fireChangeEvents(),
      !this._historyChanging &&
        (r || this.history.isEmpty) &&
        this.history.push({
          unmaskedValue: t,
          selection: { start: this.selectionStart, end: this.cursorPos }
        });
  }
  updateOptions(e) {
    const { mask: t, ...s } = e,
      i = !this.maskEquals(t),
      n = this.masked.optionsIsChanged(s);
    i && (this.mask = t),
      n && this.masked.updateOptions(s),
      (i || n) && this.updateControl();
  }
  updateCursor(e) {
    e != null && ((this.cursorPos = e), this._delayUpdateCursor(e));
  }
  _delayUpdateCursor(e) {
    this._abortUpdateCursor(),
      (this._changingCursorPos = e),
      (this._cursorChanging = setTimeout(() => {
        this.el &&
          ((this.cursorPos = this._changingCursorPos),
          this._abortUpdateCursor());
      }, 10));
  }
  _fireChangeEvents() {
    this._fireEvent('accept', this._inputEvent),
      this.masked.isComplete && this._fireEvent('complete', this._inputEvent);
  }
  _abortUpdateCursor() {
    this._cursorChanging &&
      (clearTimeout(this._cursorChanging), delete this._cursorChanging);
  }
  alignCursor() {
    this.cursorPos = this.masked.nearestInputPos(
      this.masked.nearestInputPos(this.cursorPos, d.LEFT)
    );
  }
  alignCursorFriendly() {
    this.selectionStart === this.cursorPos && this.alignCursor();
  }
  on(e, t) {
    return (
      this._listeners[e] || (this._listeners[e] = []),
      this._listeners[e].push(t),
      this
    );
  }
  off(e, t) {
    if (!this._listeners[e]) return this;
    if (!t) return delete this._listeners[e], this;
    const s = this._listeners[e].indexOf(t);
    return s >= 0 && this._listeners[e].splice(s, 1), this;
  }
  _onInput(e) {
    (this._inputEvent = e), this._abortUpdateCursor();
    const t = new ce({
        value: this.el.value,
        cursorPos: this.cursorPos,
        oldValue: this.displayValue,
        oldSelection: this._selection
      }),
      s = this.masked.rawInputValue,
      i = this.masked.splice(
        t.startChangePos,
        t.removed.length,
        t.inserted,
        t.removeDirection,
        { input: !0, raw: !0 }
      ).offset,
      n = s === this.masked.rawInputValue ? t.removeDirection : d.NONE;
    let r = this.masked.nearestInputPos(t.startChangePos + i, n);
    n !== d.NONE && (r = this.masked.nearestInputPos(r, d.NONE)),
      this.updateControl(r),
      delete this._inputEvent;
  }
  _onChange() {
    this.displayValue !== this.el.value && this.updateValue(),
      this.masked.doCommit(),
      this.updateControl(),
      this._saveSelection();
  }
  _onDrop(e) {
    e.preventDefault(), e.stopPropagation();
  }
  _onFocus(e) {
    this.alignCursorFriendly();
  }
  _onClick(e) {
    this.alignCursorFriendly();
  }
  _onUndo() {
    this._applyHistoryState(this.history.undo());
  }
  _onRedo() {
    this._applyHistoryState(this.history.redo());
  }
  _applyHistoryState(e) {
    e &&
      ((this._historyChanging = !0),
      (this.unmaskedValue = e.unmaskedValue),
      this.el.select(e.selection.start, e.selection.end),
      this._saveSelection(),
      (this._historyChanging = !1));
  }
  destroy() {
    this._unbindEvents(), (this._listeners.length = 0), delete this.el;
  }
}
p.InputMask = ge;
class f {
  static normalize(e) {
    return Array.isArray(e) ? e : [e, new f()];
  }
  constructor(e) {
    Object.assign(
      this,
      { inserted: '', rawInserted: '', tailShift: 0, skip: !1 },
      e
    );
  }
  aggregate(e) {
    return (
      (this.inserted += e.inserted),
      (this.rawInserted += e.rawInserted),
      (this.tailShift += e.tailShift),
      (this.skip = this.skip || e.skip),
      this
    );
  }
  get offset() {
    return this.tailShift + this.inserted.length;
  }
  get consumed() {
    return !!this.rawInserted || this.skip;
  }
  equals(e) {
    return (
      this.inserted === e.inserted &&
      this.tailShift === e.tailShift &&
      this.rawInserted === e.rawInserted &&
      this.skip === e.skip
    );
  }
}
p.ChangeDetails = f;
class y {
  constructor(e, t, s) {
    e === void 0 && (e = ''),
      t === void 0 && (t = 0),
      (this.value = e),
      (this.from = t),
      (this.stop = s);
  }
  toString() {
    return this.value;
  }
  extend(e) {
    this.value += String(e);
  }
  appendTo(e) {
    return e
      .append(this.toString(), { tail: !0 })
      .aggregate(e._appendPlaceholder());
  }
  get state() {
    return { value: this.value, from: this.from, stop: this.stop };
  }
  set state(e) {
    Object.assign(this, e);
  }
  unshift(e) {
    if (!this.value.length || (e != null && this.from >= e)) return '';
    const t = this.value[0];
    return (this.value = this.value.slice(1)), t;
  }
  shift() {
    if (!this.value.length) return '';
    const e = this.value[this.value.length - 1];
    return (this.value = this.value.slice(0, -1)), e;
  }
}
class k {
  constructor(e) {
    (this._value = ''),
      this._update({ ...k.DEFAULTS, ...e }),
      (this._initialized = !0);
  }
  updateOptions(e) {
    this.optionsIsChanged(e) &&
      this.withValueRefresh(this._update.bind(this, e));
  }
  _update(e) {
    Object.assign(this, e);
  }
  get state() {
    return { _value: this.value, _rawInputValue: this.rawInputValue };
  }
  set state(e) {
    this._value = e._value;
  }
  reset() {
    this._value = '';
  }
  get value() {
    return this._value;
  }
  set value(e) {
    this.resolve(e, { input: !0 });
  }
  resolve(e, t) {
    t === void 0 && (t = { input: !0 }),
      this.reset(),
      this.append(e, t, ''),
      this.doCommit();
  }
  get unmaskedValue() {
    return this.value;
  }
  set unmaskedValue(e) {
    this.resolve(e, {});
  }
  get typedValue() {
    return this.parse ? this.parse(this.value, this) : this.unmaskedValue;
  }
  set typedValue(e) {
    this.format
      ? (this.value = this.format(e, this))
      : (this.unmaskedValue = String(e));
  }
  get rawInputValue() {
    return this.extractInput(0, this.displayValue.length, { raw: !0 });
  }
  set rawInputValue(e) {
    this.resolve(e, { raw: !0 });
  }
  get displayValue() {
    return this.value;
  }
  get isComplete() {
    return !0;
  }
  get isFilled() {
    return this.isComplete;
  }
  nearestInputPos(e, t) {
    return e;
  }
  totalInputPositions(e, t) {
    return (
      e === void 0 && (e = 0),
      t === void 0 && (t = this.displayValue.length),
      Math.min(this.displayValue.length, t - e)
    );
  }
  extractInput(e, t, s) {
    return (
      e === void 0 && (e = 0),
      t === void 0 && (t = this.displayValue.length),
      this.displayValue.slice(e, t)
    );
  }
  extractTail(e, t) {
    return (
      e === void 0 && (e = 0),
      t === void 0 && (t = this.displayValue.length),
      new y(this.extractInput(e, t), e)
    );
  }
  appendTail(e) {
    return x(e) && (e = new y(String(e))), e.appendTo(this);
  }
  _appendCharRaw(e, t) {
    return e
      ? ((this._value += e), new f({ inserted: e, rawInserted: e }))
      : new f();
  }
  _appendChar(e, t, s) {
    t === void 0 && (t = {});
    const i = this.state;
    let n;
    if (
      (([e, n] = this.doPrepareChar(e, t)),
      e &&
        ((n = n.aggregate(this._appendCharRaw(e, t))),
        !n.rawInserted && this.autofix === 'pad'))
    ) {
      const r = this.state;
      this.state = i;
      let o = this.pad(t);
      const u = this._appendCharRaw(e, t);
      (o = o.aggregate(u)),
        u.rawInserted || o.equals(n) ? (n = o) : (this.state = r);
    }
    if (n.inserted) {
      let r,
        o = this.doValidate(t) !== !1;
      if (o && s != null) {
        const u = this.state;
        if (this.overwrite === !0) {
          r = s.state;
          for (let h = 0; h < n.rawInserted.length; ++h)
            s.unshift(this.displayValue.length - n.tailShift);
        }
        let l = this.appendTail(s);
        if (
          ((o = l.rawInserted.length === s.toString().length),
          !(o && l.inserted) && this.overwrite === 'shift')
        ) {
          (this.state = u), (r = s.state);
          for (let h = 0; h < n.rawInserted.length; ++h) s.shift();
          (l = this.appendTail(s)),
            (o = l.rawInserted.length === s.toString().length);
        }
        o && l.inserted && (this.state = u);
      }
      o || ((n = new f()), (this.state = i), s && r && (s.state = r));
    }
    return n;
  }
  _appendPlaceholder() {
    return new f();
  }
  _appendEager() {
    return new f();
  }
  append(e, t, s) {
    if (!x(e)) throw new Error('value should be string');
    const i = x(s) ? new y(String(s)) : s;
    t != null && t.tail && (t._beforeTailState = this.state);
    let n;
    [e, n] = this.doPrepare(e, t);
    for (let r = 0; r < e.length; ++r) {
      const o = this._appendChar(e[r], t, i);
      if (!o.rawInserted && !this.doSkipInvalid(e[r], t, i)) break;
      n.aggregate(o);
    }
    return (
      (this.eager === !0 || this.eager === 'append') &&
        t != null &&
        t.input &&
        e &&
        n.aggregate(this._appendEager()),
      i != null && (n.tailShift += this.appendTail(i).tailShift),
      n
    );
  }
  remove(e, t) {
    return (
      e === void 0 && (e = 0),
      t === void 0 && (t = this.displayValue.length),
      (this._value =
        this.displayValue.slice(0, e) + this.displayValue.slice(t)),
      new f()
    );
  }
  withValueRefresh(e) {
    if (this._refreshing || !this._initialized) return e();
    this._refreshing = !0;
    const t = this.rawInputValue,
      s = this.value,
      i = e();
    return (
      (this.rawInputValue = t),
      this.value &&
        this.value !== s &&
        s.indexOf(this.value) === 0 &&
        (this.append(s.slice(this.displayValue.length), {}, ''),
        this.doCommit()),
      delete this._refreshing,
      i
    );
  }
  runIsolated(e) {
    if (this._isolated || !this._initialized) return e(this);
    this._isolated = !0;
    const t = this.state,
      s = e(this);
    return (this.state = t), delete this._isolated, s;
  }
  doSkipInvalid(e, t, s) {
    return !!this.skipInvalid;
  }
  doPrepare(e, t) {
    return (
      t === void 0 && (t = {}),
      f.normalize(this.prepare ? this.prepare(e, this, t) : e)
    );
  }
  doPrepareChar(e, t) {
    return (
      t === void 0 && (t = {}),
      f.normalize(this.prepareChar ? this.prepareChar(e, this, t) : e)
    );
  }
  doValidate(e) {
    return (
      (!this.validate || this.validate(this.value, this, e)) &&
      (!this.parent || this.parent.doValidate(e))
    );
  }
  doCommit() {
    this.commit && this.commit(this.value, this);
  }
  splice(e, t, s, i, n) {
    s === void 0 && (s = ''),
      i === void 0 && (i = d.NONE),
      n === void 0 && (n = { input: !0 });
    const r = e + t,
      o = this.extractTail(r),
      u = this.eager === !0 || this.eager === 'remove';
    let l;
    u && ((i = de(i)), (l = this.extractInput(0, r, { raw: !0 })));
    let h = e;
    const c = new f();
    if (
      (i !== d.NONE &&
        ((h = this.nearestInputPos(e, t > 1 && e !== 0 && !u ? d.NONE : i)),
        (c.tailShift = h - e)),
      c.aggregate(this.remove(h)),
      u && i !== d.NONE && l === this.rawInputValue)
    )
      if (i === d.FORCE_LEFT) {
        let m;
        for (; l === this.rawInputValue && (m = this.displayValue.length); )
          c.aggregate(new f({ tailShift: -1 })).aggregate(this.remove(m - 1));
      } else i === d.FORCE_RIGHT && o.unshift();
    return c.aggregate(this.append(s, n, o));
  }
  maskEquals(e) {
    return this.mask === e;
  }
  optionsIsChanged(e) {
    return !R(this, e);
  }
  typedValueEquals(e) {
    const t = this.typedValue;
    return (
      e === t ||
      (k.EMPTY_VALUES.includes(e) && k.EMPTY_VALUES.includes(t)) ||
      (this.format
        ? this.format(e, this) === this.format(this.typedValue, this)
        : !1)
    );
  }
  pad(e) {
    return new f();
  }
}
k.DEFAULTS = { skipInvalid: !0 };
k.EMPTY_VALUES = [void 0, null, ''];
p.Masked = k;
class V {
  constructor(e, t) {
    e === void 0 && (e = []),
      t === void 0 && (t = 0),
      (this.chunks = e),
      (this.from = t);
  }
  toString() {
    return this.chunks.map(String).join('');
  }
  extend(e) {
    if (!String(e)) return;
    e = x(e) ? new y(String(e)) : e;
    const t = this.chunks[this.chunks.length - 1],
      s =
        t &&
        (t.stop === e.stop || e.stop == null) &&
        e.from === t.from + t.toString().length;
    if (e instanceof y) s ? t.extend(e.toString()) : this.chunks.push(e);
    else if (e instanceof V) {
      if (e.stop == null) {
        let i;
        for (; e.chunks.length && e.chunks[0].stop == null; )
          (i = e.chunks.shift()), (i.from += e.from), this.extend(i);
      }
      e.toString() && ((e.stop = e.blockIndex), this.chunks.push(e));
    }
  }
  appendTo(e) {
    if (!(e instanceof p.MaskedPattern))
      return new y(this.toString()).appendTo(e);
    const t = new f();
    for (let s = 0; s < this.chunks.length; ++s) {
      const i = this.chunks[s],
        n = e._mapPosToBlock(e.displayValue.length),
        r = i.stop;
      let o;
      if (
        (r != null &&
          (!n || n.index <= r) &&
          ((i instanceof V || e._stops.indexOf(r) >= 0) &&
            t.aggregate(e._appendPlaceholder(r)),
          (o = i instanceof V && e._blocks[r])),
        o)
      ) {
        const u = o.appendTail(i);
        t.aggregate(u);
        const l = i.toString().slice(u.rawInserted.length);
        l && t.aggregate(e.append(l, { tail: !0 }));
      } else t.aggregate(e.append(i.toString(), { tail: !0 }));
    }
    return t;
  }
  get state() {
    return {
      chunks: this.chunks.map((e) => e.state),
      from: this.from,
      stop: this.stop,
      blockIndex: this.blockIndex
    };
  }
  set state(e) {
    const { chunks: t, ...s } = e;
    Object.assign(this, s),
      (this.chunks = t.map((i) => {
        const n = 'chunks' in i ? new V() : new y();
        return (n.state = i), n;
      }));
  }
  unshift(e) {
    if (!this.chunks.length || (e != null && this.from >= e)) return '';
    const t = e != null ? e - this.from : e;
    let s = 0;
    for (; s < this.chunks.length; ) {
      const i = this.chunks[s],
        n = i.unshift(t);
      if (i.toString()) {
        if (!n) break;
        ++s;
      } else this.chunks.splice(s, 1);
      if (n) return n;
    }
    return '';
  }
  shift() {
    if (!this.chunks.length) return '';
    let e = this.chunks.length - 1;
    for (; 0 <= e; ) {
      const t = this.chunks[e],
        s = t.shift();
      if (t.toString()) {
        if (!s) break;
        --e;
      } else this.chunks.splice(e, 1);
      if (s) return s;
    }
    return '';
  }
}
class me {
  constructor(e, t) {
    (this.masked = e), (this._log = []);
    const { offset: s, index: i } =
      e._mapPosToBlock(t) ||
      (t < 0
        ? { index: 0, offset: 0 }
        : { index: this.masked._blocks.length, offset: 0 });
    (this.offset = s), (this.index = i), (this.ok = !1);
  }
  get block() {
    return this.masked._blocks[this.index];
  }
  get pos() {
    return this.masked._blockStartPos(this.index) + this.offset;
  }
  get state() {
    return { index: this.index, offset: this.offset, ok: this.ok };
  }
  set state(e) {
    Object.assign(this, e);
  }
  pushState() {
    this._log.push(this.state);
  }
  popState() {
    const e = this._log.pop();
    return e && (this.state = e), e;
  }
  bindBlock() {
    this.block ||
      (this.index < 0 && ((this.index = 0), (this.offset = 0)),
      this.index >= this.masked._blocks.length &&
        ((this.index = this.masked._blocks.length - 1),
        (this.offset = this.block.displayValue.length)));
  }
  _pushLeft(e) {
    for (
      this.pushState(), this.bindBlock();
      0 <= this.index;
      --this.index,
        this.offset =
          ((t = this.block) == null ? void 0 : t.displayValue.length) || 0
    ) {
      var t;
      if (e()) return (this.ok = !0);
    }
    return (this.ok = !1);
  }
  _pushRight(e) {
    for (
      this.pushState(), this.bindBlock();
      this.index < this.masked._blocks.length;
      ++this.index, this.offset = 0
    )
      if (e()) return (this.ok = !0);
    return (this.ok = !1);
  }
  pushLeftBeforeFilled() {
    return this._pushLeft(() => {
      if (
        !(this.block.isFixed || !this.block.value) &&
        ((this.offset = this.block.nearestInputPos(this.offset, d.FORCE_LEFT)),
        this.offset !== 0)
      )
        return !0;
    });
  }
  pushLeftBeforeInput() {
    return this._pushLeft(() => {
      if (!this.block.isFixed)
        return (
          (this.offset = this.block.nearestInputPos(this.offset, d.LEFT)), !0
        );
    });
  }
  pushLeftBeforeRequired() {
    return this._pushLeft(() => {
      if (!(this.block.isFixed || (this.block.isOptional && !this.block.value)))
        return (
          (this.offset = this.block.nearestInputPos(this.offset, d.LEFT)), !0
        );
    });
  }
  pushRightBeforeFilled() {
    return this._pushRight(() => {
      if (
        !(this.block.isFixed || !this.block.value) &&
        ((this.offset = this.block.nearestInputPos(this.offset, d.FORCE_RIGHT)),
        this.offset !== this.block.value.length)
      )
        return !0;
    });
  }
  pushRightBeforeInput() {
    return this._pushRight(() => {
      if (!this.block.isFixed)
        return (
          (this.offset = this.block.nearestInputPos(this.offset, d.NONE)), !0
        );
    });
  }
  pushRightBeforeRequired() {
    return this._pushRight(() => {
      if (!(this.block.isFixed || (this.block.isOptional && !this.block.value)))
        return (
          (this.offset = this.block.nearestInputPos(this.offset, d.NONE)), !0
        );
    });
  }
}
class ae {
  constructor(e) {
    Object.assign(this, e), (this._value = ''), (this.isFixed = !0);
  }
  get value() {
    return this._value;
  }
  get unmaskedValue() {
    return this.isUnmasking ? this.value : '';
  }
  get rawInputValue() {
    return this._isRawInput ? this.value : '';
  }
  get displayValue() {
    return this.value;
  }
  reset() {
    (this._isRawInput = !1), (this._value = '');
  }
  remove(e, t) {
    return (
      e === void 0 && (e = 0),
      t === void 0 && (t = this._value.length),
      (this._value = this._value.slice(0, e) + this._value.slice(t)),
      this._value || (this._isRawInput = !1),
      new f()
    );
  }
  nearestInputPos(e, t) {
    t === void 0 && (t = d.NONE);
    const s = 0,
      i = this._value.length;
    switch (t) {
      case d.LEFT:
      case d.FORCE_LEFT:
        return s;
      case d.NONE:
      case d.RIGHT:
      case d.FORCE_RIGHT:
      default:
        return i;
    }
  }
  totalInputPositions(e, t) {
    return (
      e === void 0 && (e = 0),
      t === void 0 && (t = this._value.length),
      this._isRawInput ? t - e : 0
    );
  }
  extractInput(e, t, s) {
    return (
      e === void 0 && (e = 0),
      t === void 0 && (t = this._value.length),
      s === void 0 && (s = {}),
      (s.raw && this._isRawInput && this._value.slice(e, t)) || ''
    );
  }
  get isComplete() {
    return !0;
  }
  get isFilled() {
    return !!this._value;
  }
  _appendChar(e, t) {
    if ((t === void 0 && (t = {}), this.isFilled)) return new f();
    const s = this.eager === !0 || this.eager === 'append',
      n =
        this.char === e &&
        (this.isUnmasking || t.input || t.raw) &&
        (!t.raw || !s) &&
        !t.tail,
      r = new f({ inserted: this.char, rawInserted: n ? this.char : '' });
    return (
      (this._value = this.char), (this._isRawInput = n && (t.raw || t.input)), r
    );
  }
  _appendEager() {
    return this._appendChar(this.char, { tail: !0 });
  }
  _appendPlaceholder() {
    const e = new f();
    return this.isFilled || (this._value = e.inserted = this.char), e;
  }
  extractTail() {
    return new y('');
  }
  appendTail(e) {
    return x(e) && (e = new y(String(e))), e.appendTo(this);
  }
  append(e, t, s) {
    const i = this._appendChar(e[0], t);
    return s != null && (i.tailShift += this.appendTail(s).tailShift), i;
  }
  doCommit() {}
  get state() {
    return { _value: this._value, _rawInputValue: this.rawInputValue };
  }
  set state(e) {
    (this._value = e._value), (this._isRawInput = !!e._rawInputValue);
  }
  pad(e) {
    return this._appendPlaceholder();
  }
}
class P {
  constructor(e) {
    const {
      parent: t,
      isOptional: s,
      placeholderChar: i,
      displayChar: n,
      lazy: r,
      eager: o,
      ...u
    } = e;
    (this.masked = w(u)),
      Object.assign(this, {
        parent: t,
        isOptional: s,
        placeholderChar: i,
        displayChar: n,
        lazy: r,
        eager: o
      });
  }
  reset() {
    (this.isFilled = !1), this.masked.reset();
  }
  remove(e, t) {
    return (
      e === void 0 && (e = 0),
      t === void 0 && (t = this.value.length),
      e === 0 && t >= 1
        ? ((this.isFilled = !1), this.masked.remove(e, t))
        : new f()
    );
  }
  get value() {
    return (
      this.masked.value ||
      (this.isFilled && !this.isOptional ? this.placeholderChar : '')
    );
  }
  get unmaskedValue() {
    return this.masked.unmaskedValue;
  }
  get rawInputValue() {
    return this.masked.rawInputValue;
  }
  get displayValue() {
    return (this.masked.value && this.displayChar) || this.value;
  }
  get isComplete() {
    return !!this.masked.value || this.isOptional;
  }
  _appendChar(e, t) {
    if ((t === void 0 && (t = {}), this.isFilled)) return new f();
    const s = this.masked.state;
    let i = this.masked._appendChar(e, this.currentMaskFlags(t));
    return (
      i.inserted &&
        this.doValidate(t) === !1 &&
        ((i = new f()), (this.masked.state = s)),
      !i.inserted &&
        !this.isOptional &&
        !this.lazy &&
        !t.input &&
        (i.inserted = this.placeholderChar),
      (i.skip = !i.inserted && !this.isOptional),
      (this.isFilled = !!i.inserted),
      i
    );
  }
  append(e, t, s) {
    return this.masked.append(e, this.currentMaskFlags(t), s);
  }
  _appendPlaceholder() {
    return this.isFilled || this.isOptional
      ? new f()
      : ((this.isFilled = !0), new f({ inserted: this.placeholderChar }));
  }
  _appendEager() {
    return new f();
  }
  extractTail(e, t) {
    return this.masked.extractTail(e, t);
  }
  appendTail(e) {
    return this.masked.appendTail(e);
  }
  extractInput(e, t, s) {
    return (
      e === void 0 && (e = 0),
      t === void 0 && (t = this.value.length),
      this.masked.extractInput(e, t, s)
    );
  }
  nearestInputPos(e, t) {
    t === void 0 && (t = d.NONE);
    const s = 0,
      i = this.value.length,
      n = Math.min(Math.max(e, s), i);
    switch (t) {
      case d.LEFT:
      case d.FORCE_LEFT:
        return this.isComplete ? n : s;
      case d.RIGHT:
      case d.FORCE_RIGHT:
        return this.isComplete ? n : i;
      case d.NONE:
      default:
        return n;
    }
  }
  totalInputPositions(e, t) {
    return (
      e === void 0 && (e = 0),
      t === void 0 && (t = this.value.length),
      this.value.slice(e, t).length
    );
  }
  doValidate(e) {
    return (
      this.masked.doValidate(this.currentMaskFlags(e)) &&
      (!this.parent || this.parent.doValidate(this.currentMaskFlags(e)))
    );
  }
  doCommit() {
    this.masked.doCommit();
  }
  get state() {
    return {
      _value: this.value,
      _rawInputValue: this.rawInputValue,
      masked: this.masked.state,
      isFilled: this.isFilled
    };
  }
  set state(e) {
    (this.masked.state = e.masked), (this.isFilled = e.isFilled);
  }
  currentMaskFlags(e) {
    var t;
    return {
      ...e,
      _beforeTailState:
        (e == null || (t = e._beforeTailState) == null ? void 0 : t.masked) ||
        (e == null ? void 0 : e._beforeTailState)
    };
  }
  pad(e) {
    return new f();
  }
}
P.DEFAULT_DEFINITIONS = {
  0: /\d/,
  a: /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
  '*': /./
};
class ve extends k {
  updateOptions(e) {
    super.updateOptions(e);
  }
  _update(e) {
    const t = e.mask;
    t && (e.validate = (s) => s.search(t) >= 0), super._update(e);
  }
}
p.MaskedRegExp = ve;
class b extends k {
  constructor(e) {
    super({
      ...b.DEFAULTS,
      ...e,
      definitions: Object.assign(
        {},
        P.DEFAULT_DEFINITIONS,
        e == null ? void 0 : e.definitions
      )
    });
  }
  updateOptions(e) {
    super.updateOptions(e);
  }
  _update(e) {
    (e.definitions = Object.assign({}, this.definitions, e.definitions)),
      super._update(e),
      this._rebuildMask();
  }
  _rebuildMask() {
    const e = this.definitions;
    (this._blocks = []),
      (this.exposeBlock = void 0),
      (this._stops = []),
      (this._maskedBlocks = {});
    const t = this.mask;
    if (!t || !e) return;
    let s = !1,
      i = !1;
    for (let n = 0; n < t.length; ++n) {
      if (this.blocks) {
        const l = t.slice(n),
          h = Object.keys(this.blocks).filter((m) => l.indexOf(m) === 0);
        h.sort((m, _) => _.length - m.length);
        const c = h[0];
        if (c) {
          const { expose: m, repeat: _, ...I } = L(this.blocks[c]),
            T = {
              lazy: this.lazy,
              eager: this.eager,
              placeholderChar: this.placeholderChar,
              displayChar: this.displayChar,
              overwrite: this.overwrite,
              autofix: this.autofix,
              ...I,
              repeat: _,
              parent: this
            },
            E = _ != null ? new p.RepeatBlock(T) : w(T);
          E &&
            (this._blocks.push(E),
            m && (this.exposeBlock = E),
            this._maskedBlocks[c] || (this._maskedBlocks[c] = []),
            this._maskedBlocks[c].push(this._blocks.length - 1)),
            (n += c.length - 1);
          continue;
        }
      }
      let r = t[n],
        o = r in e;
      if (r === b.STOP_CHAR) {
        this._stops.push(this._blocks.length);
        continue;
      }
      if (r === '{' || r === '}') {
        s = !s;
        continue;
      }
      if (r === '[' || r === ']') {
        i = !i;
        continue;
      }
      if (r === b.ESCAPE_CHAR) {
        if ((++n, (r = t[n]), !r)) break;
        o = !1;
      }
      const u = o
        ? new P({
            isOptional: i,
            lazy: this.lazy,
            eager: this.eager,
            placeholderChar: this.placeholderChar,
            displayChar: this.displayChar,
            ...L(e[r]),
            parent: this
          })
        : new ae({ char: r, eager: this.eager, isUnmasking: s });
      this._blocks.push(u);
    }
  }
  get state() {
    return { ...super.state, _blocks: this._blocks.map((e) => e.state) };
  }
  set state(e) {
    if (!e) {
      this.reset();
      return;
    }
    const { _blocks: t, ...s } = e;
    this._blocks.forEach((i, n) => (i.state = t[n])), (super.state = s);
  }
  reset() {
    super.reset(), this._blocks.forEach((e) => e.reset());
  }
  get isComplete() {
    return this.exposeBlock
      ? this.exposeBlock.isComplete
      : this._blocks.every((e) => e.isComplete);
  }
  get isFilled() {
    return this._blocks.every((e) => e.isFilled);
  }
  get isFixed() {
    return this._blocks.every((e) => e.isFixed);
  }
  get isOptional() {
    return this._blocks.every((e) => e.isOptional);
  }
  doCommit() {
    this._blocks.forEach((e) => e.doCommit()), super.doCommit();
  }
  get unmaskedValue() {
    return this.exposeBlock
      ? this.exposeBlock.unmaskedValue
      : this._blocks.reduce((e, t) => (e += t.unmaskedValue), '');
  }
  set unmaskedValue(e) {
    if (this.exposeBlock) {
      const t = this.extractTail(
        this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) +
          this.exposeBlock.displayValue.length
      );
      (this.exposeBlock.unmaskedValue = e), this.appendTail(t), this.doCommit();
    } else super.unmaskedValue = e;
  }
  get value() {
    return this.exposeBlock
      ? this.exposeBlock.value
      : this._blocks.reduce((e, t) => (e += t.value), '');
  }
  set value(e) {
    if (this.exposeBlock) {
      const t = this.extractTail(
        this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) +
          this.exposeBlock.displayValue.length
      );
      (this.exposeBlock.value = e), this.appendTail(t), this.doCommit();
    } else super.value = e;
  }
  get typedValue() {
    return this.exposeBlock ? this.exposeBlock.typedValue : super.typedValue;
  }
  set typedValue(e) {
    if (this.exposeBlock) {
      const t = this.extractTail(
        this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) +
          this.exposeBlock.displayValue.length
      );
      (this.exposeBlock.typedValue = e), this.appendTail(t), this.doCommit();
    } else super.typedValue = e;
  }
  get displayValue() {
    return this._blocks.reduce((e, t) => (e += t.displayValue), '');
  }
  appendTail(e) {
    return super.appendTail(e).aggregate(this._appendPlaceholder());
  }
  _appendEager() {
    var e;
    const t = new f();
    let s =
      (e = this._mapPosToBlock(this.displayValue.length)) == null
        ? void 0
        : e.index;
    if (s == null) return t;
    this._blocks[s].isFilled && ++s;
    for (let i = s; i < this._blocks.length; ++i) {
      const n = this._blocks[i]._appendEager();
      if (!n.inserted) break;
      t.aggregate(n);
    }
    return t;
  }
  _appendCharRaw(e, t) {
    t === void 0 && (t = {});
    const s = this._mapPosToBlock(this.displayValue.length),
      i = new f();
    if (!s) return i;
    for (let r = s.index, o; (o = this._blocks[r]); ++r) {
      var n;
      const u = o._appendChar(e, {
        ...t,
        _beforeTailState:
          (n = t._beforeTailState) == null || (n = n._blocks) == null
            ? void 0
            : n[r]
      });
      if ((i.aggregate(u), u.consumed)) break;
    }
    return i;
  }
  extractTail(e, t) {
    e === void 0 && (e = 0), t === void 0 && (t = this.displayValue.length);
    const s = new V();
    return (
      e === t ||
        this._forEachBlocksInRange(e, t, (i, n, r, o) => {
          const u = i.extractTail(r, o);
          (u.stop = this._findStopBefore(n)),
            (u.from = this._blockStartPos(n)),
            u instanceof V && (u.blockIndex = n),
            s.extend(u);
        }),
      s
    );
  }
  extractInput(e, t, s) {
    if (
      (e === void 0 && (e = 0),
      t === void 0 && (t = this.displayValue.length),
      s === void 0 && (s = {}),
      e === t)
    )
      return '';
    let i = '';
    return (
      this._forEachBlocksInRange(e, t, (n, r, o, u) => {
        i += n.extractInput(o, u, s);
      }),
      i
    );
  }
  _findStopBefore(e) {
    let t;
    for (let s = 0; s < this._stops.length; ++s) {
      const i = this._stops[s];
      if (i <= e) t = i;
      else break;
    }
    return t;
  }
  _appendPlaceholder(e) {
    const t = new f();
    if (this.lazy && e == null) return t;
    const s = this._mapPosToBlock(this.displayValue.length);
    if (!s) return t;
    const i = s.index,
      n = e ?? this._blocks.length;
    return (
      this._blocks.slice(i, n).forEach((r) => {
        if (!r.lazy || e != null) {
          var o;
          t.aggregate(
            r._appendPlaceholder((o = r._blocks) == null ? void 0 : o.length)
          );
        }
      }),
      t
    );
  }
  _mapPosToBlock(e) {
    let t = '';
    for (let s = 0; s < this._blocks.length; ++s) {
      const i = this._blocks[s],
        n = t.length;
      if (((t += i.displayValue), e <= t.length))
        return { index: s, offset: e - n };
    }
  }
  _blockStartPos(e) {
    return this._blocks
      .slice(0, e)
      .reduce((t, s) => (t += s.displayValue.length), 0);
  }
  _forEachBlocksInRange(e, t, s) {
    t === void 0 && (t = this.displayValue.length);
    const i = this._mapPosToBlock(e);
    if (i) {
      const n = this._mapPosToBlock(t),
        r = n && i.index === n.index,
        o = i.offset,
        u = n && r ? n.offset : this._blocks[i.index].displayValue.length;
      if ((s(this._blocks[i.index], i.index, o, u), n && !r)) {
        for (let l = i.index + 1; l < n.index; ++l)
          s(this._blocks[l], l, 0, this._blocks[l].displayValue.length);
        s(this._blocks[n.index], n.index, 0, n.offset);
      }
    }
  }
  remove(e, t) {
    e === void 0 && (e = 0), t === void 0 && (t = this.displayValue.length);
    const s = super.remove(e, t);
    return (
      this._forEachBlocksInRange(e, t, (i, n, r, o) => {
        s.aggregate(i.remove(r, o));
      }),
      s
    );
  }
  nearestInputPos(e, t) {
    if ((t === void 0 && (t = d.NONE), !this._blocks.length)) return 0;
    const s = new me(this, e);
    if (t === d.NONE)
      return s.pushRightBeforeInput() || (s.popState(), s.pushLeftBeforeInput())
        ? s.pos
        : this.displayValue.length;
    if (t === d.LEFT || t === d.FORCE_LEFT) {
      if (t === d.LEFT) {
        if ((s.pushRightBeforeFilled(), s.ok && s.pos === e)) return e;
        s.popState();
      }
      if (
        (s.pushLeftBeforeInput(),
        s.pushLeftBeforeRequired(),
        s.pushLeftBeforeFilled(),
        t === d.LEFT)
      ) {
        if (
          (s.pushRightBeforeInput(),
          s.pushRightBeforeRequired(),
          (s.ok && s.pos <= e) || (s.popState(), s.ok && s.pos <= e))
        )
          return s.pos;
        s.popState();
      }
      return s.ok
        ? s.pos
        : t === d.FORCE_LEFT
          ? 0
          : (s.popState(), s.ok || (s.popState(), s.ok) ? s.pos : 0);
    }
    return t === d.RIGHT || t === d.FORCE_RIGHT
      ? (s.pushRightBeforeInput(),
        s.pushRightBeforeRequired(),
        s.pushRightBeforeFilled()
          ? s.pos
          : t === d.FORCE_RIGHT
            ? this.displayValue.length
            : (s.popState(),
              s.ok || (s.popState(), s.ok)
                ? s.pos
                : this.nearestInputPos(e, d.LEFT)))
      : e;
  }
  totalInputPositions(e, t) {
    e === void 0 && (e = 0), t === void 0 && (t = this.displayValue.length);
    let s = 0;
    return (
      this._forEachBlocksInRange(e, t, (i, n, r, o) => {
        s += i.totalInputPositions(r, o);
      }),
      s
    );
  }
  maskedBlock(e) {
    return this.maskedBlocks(e)[0];
  }
  maskedBlocks(e) {
    const t = this._maskedBlocks[e];
    return t ? t.map((s) => this._blocks[s]) : [];
  }
  pad(e) {
    const t = new f();
    return (
      this._forEachBlocksInRange(0, this.displayValue.length, (s) =>
        t.aggregate(s.pad(e))
      ),
      t
    );
  }
}
b.DEFAULTS = { ...k.DEFAULTS, lazy: !0, placeholderChar: '_' };
b.STOP_CHAR = '`';
b.ESCAPE_CHAR = '\\';
b.InputDefinition = P;
b.FixedDefinition = ae;
p.MaskedPattern = b;
class O extends b {
  get _matchFrom() {
    return this.maxLength - String(this.from).length;
  }
  constructor(e) {
    super(e);
  }
  updateOptions(e) {
    super.updateOptions(e);
  }
  _update(e) {
    const {
      to: t = this.to || 0,
      from: s = this.from || 0,
      maxLength: i = this.maxLength || 0,
      autofix: n = this.autofix,
      ...r
    } = e;
    (this.to = t),
      (this.from = s),
      (this.maxLength = Math.max(String(t).length, i)),
      (this.autofix = n);
    const o = String(this.from).padStart(this.maxLength, '0'),
      u = String(this.to).padStart(this.maxLength, '0');
    let l = 0;
    for (; l < u.length && u[l] === o[l]; ) ++l;
    (r.mask =
      u.slice(0, l).replace(/0/g, '\\0') + '0'.repeat(this.maxLength - l)),
      super._update(r);
  }
  get isComplete() {
    return super.isComplete && !!this.value;
  }
  boundaries(e) {
    let t = '',
      s = '';
    const [, i, n] = e.match(/^(\D*)(\d*)(\D*)/) || [];
    return (
      n && ((t = '0'.repeat(i.length) + n), (s = '9'.repeat(i.length) + n)),
      (t = t.padEnd(this.maxLength, '0')),
      (s = s.padEnd(this.maxLength, '9')),
      [t, s]
    );
  }
  doPrepareChar(e, t) {
    t === void 0 && (t = {});
    let s;
    return (
      ([e, s] = super.doPrepareChar(e.replace(/\D/g, ''), t)),
      e || (s.skip = !this.isComplete),
      [e, s]
    );
  }
  _appendCharRaw(e, t) {
    if (
      (t === void 0 && (t = {}),
      !this.autofix || this.value.length + 1 > this.maxLength)
    )
      return super._appendCharRaw(e, t);
    const s = String(this.from).padStart(this.maxLength, '0'),
      i = String(this.to).padStart(this.maxLength, '0'),
      [n, r] = this.boundaries(this.value + e);
    return Number(r) < this.from
      ? super._appendCharRaw(s[this.value.length], t)
      : Number(n) > this.to
        ? !t.tail &&
          this.autofix === 'pad' &&
          this.value.length + 1 < this.maxLength
          ? super
              ._appendCharRaw(s[this.value.length], t)
              .aggregate(this._appendCharRaw(e, t))
          : super._appendCharRaw(i[this.value.length], t)
        : super._appendCharRaw(e, t);
  }
  doValidate(e) {
    const t = this.value;
    if (t.search(/[^0]/) === -1 && t.length <= this._matchFrom) return !0;
    const [i, n] = this.boundaries(t);
    return (
      this.from <= Number(n) && Number(i) <= this.to && super.doValidate(e)
    );
  }
  pad(e) {
    const t = new f();
    if (this.value.length === this.maxLength) return t;
    const s = this.value,
      i = this.maxLength - this.value.length;
    if (i) {
      this.reset();
      for (let n = 0; n < i; ++n) t.aggregate(super._appendCharRaw('0', e));
      s.split('').forEach((n) => this._appendCharRaw(n));
    }
    return t;
  }
}
p.MaskedRange = O;
const ke = 'd{.}`m{.}`Y';
class S extends b {
  static extractPatternOptions(e) {
    const { mask: t, pattern: s, ...i } = e;
    return { ...i, mask: x(t) ? t : s };
  }
  constructor(e) {
    super(S.extractPatternOptions({ ...S.DEFAULTS, ...e }));
  }
  updateOptions(e) {
    super.updateOptions(e);
  }
  _update(e) {
    const { mask: t, pattern: s, blocks: i, ...n } = { ...S.DEFAULTS, ...e },
      r = Object.assign({}, S.GET_DEFAULT_BLOCKS());
    e.min && (r.Y.from = e.min.getFullYear()),
      e.max && (r.Y.to = e.max.getFullYear()),
      e.min &&
        e.max &&
        r.Y.from === r.Y.to &&
        ((r.m.from = e.min.getMonth() + 1),
        (r.m.to = e.max.getMonth() + 1),
        r.m.from === r.m.to &&
          ((r.d.from = e.min.getDate()), (r.d.to = e.max.getDate()))),
      Object.assign(r, this.blocks, i),
      super._update({ ...n, mask: x(t) ? t : s, blocks: r });
  }
  doValidate(e) {
    const t = this.date;
    return (
      super.doValidate(e) &&
      (!this.isComplete ||
        (this.isDateExist(this.value) &&
          t != null &&
          (this.min == null || this.min <= t) &&
          (this.max == null || t <= this.max)))
    );
  }
  isDateExist(e) {
    return this.format(this.parse(e, this), this).indexOf(e) >= 0;
  }
  get date() {
    return this.typedValue;
  }
  set date(e) {
    this.typedValue = e;
  }
  get typedValue() {
    return this.isComplete ? super.typedValue : null;
  }
  set typedValue(e) {
    super.typedValue = e;
  }
  maskEquals(e) {
    return e === Date || super.maskEquals(e);
  }
  optionsIsChanged(e) {
    return super.optionsIsChanged(S.extractPatternOptions(e));
  }
}
S.GET_DEFAULT_BLOCKS = () => ({
  d: { mask: O, from: 1, to: 31, maxLength: 2 },
  m: { mask: O, from: 1, to: 12, maxLength: 2 },
  Y: { mask: O, from: 1900, to: 9999 }
});
S.DEFAULTS = {
  ...b.DEFAULTS,
  mask: Date,
  pattern: ke,
  format: (a, e) => {
    if (!a) return '';
    const t = String(a.getDate()).padStart(2, '0'),
      s = String(a.getMonth() + 1).padStart(2, '0'),
      i = a.getFullYear();
    return [t, s, i].join('.');
  },
  parse: (a, e) => {
    const [t, s, i] = a.split('.').map(Number);
    return new Date(i, s - 1, t);
  }
};
p.MaskedDate = S;
class G extends k {
  constructor(e) {
    super({ ...G.DEFAULTS, ...e }), (this.currentMask = void 0);
  }
  updateOptions(e) {
    super.updateOptions(e);
  }
  _update(e) {
    super._update(e),
      'mask' in e &&
        ((this.exposeMask = void 0),
        (this.compiledMasks = Array.isArray(e.mask)
          ? e.mask.map((t) => {
              const { expose: s, ...i } = L(t),
                n = w({
                  overwrite: this._overwrite,
                  eager: this._eager,
                  skipInvalid: this._skipInvalid,
                  ...i
                });
              return s && (this.exposeMask = n), n;
            })
          : []));
  }
  _appendCharRaw(e, t) {
    t === void 0 && (t = {});
    const s = this._applyDispatch(e, t);
    return (
      this.currentMask &&
        s.aggregate(this.currentMask._appendChar(e, this.currentMaskFlags(t))),
      s
    );
  }
  _applyDispatch(e, t, s) {
    e === void 0 && (e = ''),
      t === void 0 && (t = {}),
      s === void 0 && (s = '');
    const i =
        t.tail && t._beforeTailState != null
          ? t._beforeTailState._value
          : this.value,
      n = this.rawInputValue,
      r =
        t.tail && t._beforeTailState != null
          ? t._beforeTailState._rawInputValue
          : n,
      o = n.slice(r.length),
      u = this.currentMask,
      l = new f(),
      h = u == null ? void 0 : u.state;
    return (
      (this.currentMask = this.doDispatch(e, { ...t }, s)),
      this.currentMask &&
        (this.currentMask !== u
          ? (this.currentMask.reset(),
            r &&
              (this.currentMask.append(r, { raw: !0 }),
              (l.tailShift = this.currentMask.value.length - i.length)),
            o &&
              (l.tailShift += this.currentMask.append(o, {
                raw: !0,
                tail: !0
              }).tailShift))
          : h && (this.currentMask.state = h)),
      l
    );
  }
  _appendPlaceholder() {
    const e = this._applyDispatch();
    return (
      this.currentMask && e.aggregate(this.currentMask._appendPlaceholder()), e
    );
  }
  _appendEager() {
    const e = this._applyDispatch();
    return this.currentMask && e.aggregate(this.currentMask._appendEager()), e;
  }
  appendTail(e) {
    const t = new f();
    return (
      e && t.aggregate(this._applyDispatch('', {}, e)),
      t.aggregate(
        this.currentMask ? this.currentMask.appendTail(e) : super.appendTail(e)
      )
    );
  }
  currentMaskFlags(e) {
    var t, s;
    return {
      ...e,
      _beforeTailState:
        (((t = e._beforeTailState) == null ? void 0 : t.currentMaskRef) ===
          this.currentMask &&
          ((s = e._beforeTailState) == null ? void 0 : s.currentMask)) ||
        e._beforeTailState
    };
  }
  doDispatch(e, t, s) {
    return (
      t === void 0 && (t = {}),
      s === void 0 && (s = ''),
      this.dispatch(e, this, t, s)
    );
  }
  doValidate(e) {
    return (
      super.doValidate(e) &&
      (!this.currentMask ||
        this.currentMask.doValidate(this.currentMaskFlags(e)))
    );
  }
  doPrepare(e, t) {
    t === void 0 && (t = {});
    let [s, i] = super.doPrepare(e, t);
    if (this.currentMask) {
      let n;
      ([s, n] = super.doPrepare(s, this.currentMaskFlags(t))),
        (i = i.aggregate(n));
    }
    return [s, i];
  }
  doPrepareChar(e, t) {
    t === void 0 && (t = {});
    let [s, i] = super.doPrepareChar(e, t);
    if (this.currentMask) {
      let n;
      ([s, n] = super.doPrepareChar(s, this.currentMaskFlags(t))),
        (i = i.aggregate(n));
    }
    return [s, i];
  }
  reset() {
    var e;
    (e = this.currentMask) == null || e.reset(),
      this.compiledMasks.forEach((t) => t.reset());
  }
  get value() {
    return this.exposeMask
      ? this.exposeMask.value
      : this.currentMask
        ? this.currentMask.value
        : '';
  }
  set value(e) {
    this.exposeMask
      ? ((this.exposeMask.value = e),
        (this.currentMask = this.exposeMask),
        this._applyDispatch())
      : (super.value = e);
  }
  get unmaskedValue() {
    return this.exposeMask
      ? this.exposeMask.unmaskedValue
      : this.currentMask
        ? this.currentMask.unmaskedValue
        : '';
  }
  set unmaskedValue(e) {
    this.exposeMask
      ? ((this.exposeMask.unmaskedValue = e),
        (this.currentMask = this.exposeMask),
        this._applyDispatch())
      : (super.unmaskedValue = e);
  }
  get typedValue() {
    return this.exposeMask
      ? this.exposeMask.typedValue
      : this.currentMask
        ? this.currentMask.typedValue
        : '';
  }
  set typedValue(e) {
    if (this.exposeMask) {
      (this.exposeMask.typedValue = e),
        (this.currentMask = this.exposeMask),
        this._applyDispatch();
      return;
    }
    let t = String(e);
    this.currentMask &&
      ((this.currentMask.typedValue = e), (t = this.currentMask.unmaskedValue)),
      (this.unmaskedValue = t);
  }
  get displayValue() {
    return this.currentMask ? this.currentMask.displayValue : '';
  }
  get isComplete() {
    var e;
    return !!((e = this.currentMask) != null && e.isComplete);
  }
  get isFilled() {
    var e;
    return !!((e = this.currentMask) != null && e.isFilled);
  }
  remove(e, t) {
    const s = new f();
    return (
      this.currentMask &&
        s
          .aggregate(this.currentMask.remove(e, t))
          .aggregate(this._applyDispatch()),
      s
    );
  }
  get state() {
    var e;
    return {
      ...super.state,
      _rawInputValue: this.rawInputValue,
      compiledMasks: this.compiledMasks.map((t) => t.state),
      currentMaskRef: this.currentMask,
      currentMask: (e = this.currentMask) == null ? void 0 : e.state
    };
  }
  set state(e) {
    const { compiledMasks: t, currentMaskRef: s, currentMask: i, ...n } = e;
    t && this.compiledMasks.forEach((r, o) => (r.state = t[o])),
      s != null && ((this.currentMask = s), (this.currentMask.state = i)),
      (super.state = n);
  }
  extractInput(e, t, s) {
    return this.currentMask ? this.currentMask.extractInput(e, t, s) : '';
  }
  extractTail(e, t) {
    return this.currentMask
      ? this.currentMask.extractTail(e, t)
      : super.extractTail(e, t);
  }
  doCommit() {
    this.currentMask && this.currentMask.doCommit(), super.doCommit();
  }
  nearestInputPos(e, t) {
    return this.currentMask
      ? this.currentMask.nearestInputPos(e, t)
      : super.nearestInputPos(e, t);
  }
  get overwrite() {
    return this.currentMask ? this.currentMask.overwrite : this._overwrite;
  }
  set overwrite(e) {
    this._overwrite = e;
  }
  get eager() {
    return this.currentMask ? this.currentMask.eager : this._eager;
  }
  set eager(e) {
    this._eager = e;
  }
  get skipInvalid() {
    return this.currentMask ? this.currentMask.skipInvalid : this._skipInvalid;
  }
  set skipInvalid(e) {
    this._skipInvalid = e;
  }
  get autofix() {
    return this.currentMask ? this.currentMask.autofix : this._autofix;
  }
  set autofix(e) {
    this._autofix = e;
  }
  maskEquals(e) {
    return Array.isArray(e)
      ? this.compiledMasks.every((t, s) => {
          if (!e[s]) return;
          const { mask: i, ...n } = e[s];
          return R(t, n) && t.maskEquals(i);
        })
      : super.maskEquals(e);
  }
  typedValueEquals(e) {
    var t;
    return !!((t = this.currentMask) != null && t.typedValueEquals(e));
  }
}
G.DEFAULTS = {
  ...k.DEFAULTS,
  dispatch: (a, e, t, s) => {
    if (!e.compiledMasks.length) return;
    const i = e.rawInputValue,
      n = e.compiledMasks.map((r, o) => {
        const u = e.currentMask === r,
          l = u
            ? r.displayValue.length
            : r.nearestInputPos(r.displayValue.length, d.FORCE_LEFT);
        return (
          r.rawInputValue !== i
            ? (r.reset(), r.append(i, { raw: !0 }))
            : u || r.remove(l),
          r.append(a, e.currentMaskFlags(t)),
          r.appendTail(s),
          {
            index: o,
            weight: r.rawInputValue.length,
            totalInputPositions: r.totalInputPositions(
              0,
              Math.max(
                l,
                r.nearestInputPos(r.displayValue.length, d.FORCE_LEFT)
              )
            )
          }
        );
      });
    return (
      n.sort(
        (r, o) =>
          o.weight - r.weight || o.totalInputPositions - r.totalInputPositions
      ),
      e.compiledMasks[n[0].index]
    );
  }
};
p.MaskedDynamic = G;
class q extends b {
  constructor(e) {
    super({ ...q.DEFAULTS, ...e });
  }
  updateOptions(e) {
    super.updateOptions(e);
  }
  _update(e) {
    const { enum: t, ...s } = e;
    if (t) {
      const i = t.map((o) => o.length),
        n = Math.min(...i),
        r = Math.max(...i) - n;
      (s.mask = '*'.repeat(n)),
        r && (s.mask += '[' + '*'.repeat(r) + ']'),
        (this.enum = t);
    }
    super._update(s);
  }
  _appendCharRaw(e, t) {
    t === void 0 && (t = {});
    const s = Math.min(
        this.nearestInputPos(0, d.FORCE_RIGHT),
        this.value.length
      ),
      i = this.enum.filter((n) =>
        this.matchValue(n, this.unmaskedValue + e, s)
      );
    if (i.length) {
      i.length === 1 &&
        this._forEachBlocksInRange(0, this.value.length, (r, o) => {
          const u = i[0][o];
          o >= this.value.length ||
            u === r.value ||
            (r.reset(), r._appendChar(u, t));
        });
      const n = super._appendCharRaw(i[0][this.value.length], t);
      return (
        i.length === 1 &&
          i[0]
            .slice(this.unmaskedValue.length)
            .split('')
            .forEach((r) => n.aggregate(super._appendCharRaw(r))),
        n
      );
    }
    return new f({ skip: !this.isComplete });
  }
  extractTail(e, t) {
    return (
      e === void 0 && (e = 0),
      t === void 0 && (t = this.displayValue.length),
      new y('', e)
    );
  }
  remove(e, t) {
    if (
      (e === void 0 && (e = 0),
      t === void 0 && (t = this.displayValue.length),
      e === t)
    )
      return new f();
    const s = Math.min(
      super.nearestInputPos(0, d.FORCE_RIGHT),
      this.value.length
    );
    let i;
    for (
      i = e;
      i >= 0 &&
      !(
        this.enum.filter((o) => this.matchValue(o, this.value.slice(s, i), s))
          .length > 1
      );
      --i
    );
    const n = super.remove(i, t);
    return (n.tailShift += i - e), n;
  }
  get isComplete() {
    return this.enum.indexOf(this.value) >= 0;
  }
}
q.DEFAULTS = { ...b.DEFAULTS, matchValue: (a, e, t) => a.indexOf(e, t) === t };
p.MaskedEnum = q;
class be extends k {
  updateOptions(e) {
    super.updateOptions(e);
  }
  _update(e) {
    super._update({ ...e, validate: e.mask });
  }
}
p.MaskedFunction = be;
var oe;
class F extends k {
  constructor(e) {
    super({ ...F.DEFAULTS, ...e });
  }
  updateOptions(e) {
    super.updateOptions(e);
  }
  _update(e) {
    super._update(e), this._updateRegExps();
  }
  _updateRegExps() {
    const e = '^' + (this.allowNegative ? '[+|\\-]?' : ''),
      t = '\\d*',
      s =
        (this.scale
          ? '(' + H(this.radix) + '\\d{0,' + this.scale + '})?'
          : '') + '$';
    (this._numberRegExp = new RegExp(e + t + s)),
      (this._mapToRadixRegExp = new RegExp(
        '[' + this.mapToRadix.map(H).join('') + ']',
        'g'
      )),
      (this._thousandsSeparatorRegExp = new RegExp(
        H(this.thousandsSeparator),
        'g'
      ));
  }
  _removeThousandsSeparators(e) {
    return e.replace(this._thousandsSeparatorRegExp, '');
  }
  _insertThousandsSeparators(e) {
    const t = e.split(this.radix);
    return (
      (t[0] = t[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator)),
      t.join(this.radix)
    );
  }
  doPrepareChar(e, t) {
    t === void 0 && (t = {});
    const [s, i] = super.doPrepareChar(
      this._removeThousandsSeparators(
        this.scale &&
          this.mapToRadix.length &&
          ((t.input && t.raw) || (!t.input && !t.raw))
          ? e.replace(this._mapToRadixRegExp, this.radix)
          : e
      ),
      t
    );
    return (
      e && !s && (i.skip = !0),
      s &&
        !this.allowPositive &&
        !this.value &&
        s !== '-' &&
        i.aggregate(this._appendChar('-')),
      [s, i]
    );
  }
  _separatorsCount(e, t) {
    t === void 0 && (t = !1);
    let s = 0;
    for (let i = 0; i < e; ++i)
      this._value.indexOf(this.thousandsSeparator, i) === i &&
        (++s, t && (e += this.thousandsSeparator.length));
    return s;
  }
  _separatorsCountFromSlice(e) {
    return (
      e === void 0 && (e = this._value),
      this._separatorsCount(this._removeThousandsSeparators(e).length, !0)
    );
  }
  extractInput(e, t, s) {
    return (
      e === void 0 && (e = 0),
      t === void 0 && (t = this.displayValue.length),
      ([e, t] = this._adjustRangeWithSeparators(e, t)),
      this._removeThousandsSeparators(super.extractInput(e, t, s))
    );
  }
  _appendCharRaw(e, t) {
    t === void 0 && (t = {});
    const s =
        t.tail && t._beforeTailState ? t._beforeTailState._value : this._value,
      i = this._separatorsCountFromSlice(s);
    this._value = this._removeThousandsSeparators(this.value);
    const n = this._value;
    this._value += e;
    const r = this.number;
    let o = !isNaN(r),
      u = !1;
    if (o) {
      let m;
      this.min != null &&
        this.min < 0 &&
        this.number < this.min &&
        (m = this.min),
        this.max != null &&
          this.max > 0 &&
          this.number > this.max &&
          (m = this.max),
        m != null &&
          (this.autofix
            ? ((this._value = this.format(m, this).replace(
                F.UNMASKED_RADIX,
                this.radix
              )),
              u || (u = n === this._value && !t.tail))
            : (o = !1)),
        o && (o = !!this._value.match(this._numberRegExp));
    }
    let l;
    o
      ? (l = new f({
          inserted: this._value.slice(n.length),
          rawInserted: u ? '' : e,
          skip: u
        }))
      : ((this._value = n), (l = new f())),
      (this._value = this._insertThousandsSeparators(this._value));
    const h =
        t.tail && t._beforeTailState ? t._beforeTailState._value : this._value,
      c = this._separatorsCountFromSlice(h);
    return (l.tailShift += (c - i) * this.thousandsSeparator.length), l;
  }
  _findSeparatorAround(e) {
    if (this.thousandsSeparator) {
      const t = e - this.thousandsSeparator.length + 1,
        s = this.value.indexOf(this.thousandsSeparator, t);
      if (s <= e) return s;
    }
    return -1;
  }
  _adjustRangeWithSeparators(e, t) {
    const s = this._findSeparatorAround(e);
    s >= 0 && (e = s);
    const i = this._findSeparatorAround(t);
    return i >= 0 && (t = i + this.thousandsSeparator.length), [e, t];
  }
  remove(e, t) {
    e === void 0 && (e = 0),
      t === void 0 && (t = this.displayValue.length),
      ([e, t] = this._adjustRangeWithSeparators(e, t));
    const s = this.value.slice(0, e),
      i = this.value.slice(t),
      n = this._separatorsCount(s.length);
    this._value = this._insertThousandsSeparators(
      this._removeThousandsSeparators(s + i)
    );
    const r = this._separatorsCountFromSlice(s);
    return new f({ tailShift: (r - n) * this.thousandsSeparator.length });
  }
  nearestInputPos(e, t) {
    if (!this.thousandsSeparator) return e;
    switch (t) {
      case d.NONE:
      case d.LEFT:
      case d.FORCE_LEFT: {
        const s = this._findSeparatorAround(e - 1);
        if (s >= 0) {
          const i = s + this.thousandsSeparator.length;
          if (e < i || this.value.length <= i || t === d.FORCE_LEFT) return s;
        }
        break;
      }
      case d.RIGHT:
      case d.FORCE_RIGHT: {
        const s = this._findSeparatorAround(e);
        if (s >= 0) return s + this.thousandsSeparator.length;
      }
    }
    return e;
  }
  doCommit() {
    if (this.value) {
      const e = this.number;
      let t = e;
      this.min != null && (t = Math.max(t, this.min)),
        this.max != null && (t = Math.min(t, this.max)),
        t !== e && (this.unmaskedValue = this.format(t, this));
      let s = this.value;
      this.normalizeZeros && (s = this._normalizeZeros(s)),
        this.padFractionalZeros &&
          this.scale > 0 &&
          (s = this._padFractionalZeros(s)),
        (this._value = s);
    }
    super.doCommit();
  }
  _normalizeZeros(e) {
    const t = this._removeThousandsSeparators(e).split(this.radix);
    return (
      (t[0] = t[0].replace(/^(\D*)(0*)(\d*)/, (s, i, n, r) => i + r)),
      e.length && !/\d$/.test(t[0]) && (t[0] = t[0] + '0'),
      t.length > 1 &&
        ((t[1] = t[1].replace(/0*$/, '')), t[1].length || (t.length = 1)),
      this._insertThousandsSeparators(t.join(this.radix))
    );
  }
  _padFractionalZeros(e) {
    if (!e) return e;
    const t = e.split(this.radix);
    return (
      t.length < 2 && t.push(''),
      (t[1] = t[1].padEnd(this.scale, '0')),
      t.join(this.radix)
    );
  }
  doSkipInvalid(e, t, s) {
    t === void 0 && (t = {});
    const i =
      this.scale === 0 &&
      e !== this.thousandsSeparator &&
      (e === this.radix ||
        e === F.UNMASKED_RADIX ||
        this.mapToRadix.includes(e));
    return super.doSkipInvalid(e, t, s) && !i;
  }
  get unmaskedValue() {
    return this._removeThousandsSeparators(
      this._normalizeZeros(this.value)
    ).replace(this.radix, F.UNMASKED_RADIX);
  }
  set unmaskedValue(e) {
    super.unmaskedValue = e;
  }
  get typedValue() {
    return this.parse(this.unmaskedValue, this);
  }
  set typedValue(e) {
    this.rawInputValue = this.format(e, this).replace(
      F.UNMASKED_RADIX,
      this.radix
    );
  }
  get number() {
    return this.typedValue;
  }
  set number(e) {
    this.typedValue = e;
  }
  get allowNegative() {
    return (
      (this.min != null && this.min < 0) || (this.max != null && this.max < 0)
    );
  }
  get allowPositive() {
    return (
      (this.min != null && this.min > 0) || (this.max != null && this.max > 0)
    );
  }
  typedValueEquals(e) {
    return (
      (super.typedValueEquals(e) ||
        (F.EMPTY_VALUES.includes(e) &&
          F.EMPTY_VALUES.includes(this.typedValue))) &&
      !(e === 0 && this.value === '')
    );
  }
}
oe = F;
F.UNMASKED_RADIX = '.';
F.EMPTY_VALUES = [...k.EMPTY_VALUES, 0];
F.DEFAULTS = {
  ...k.DEFAULTS,
  mask: Number,
  radix: ',',
  thousandsSeparator: '',
  mapToRadix: [oe.UNMASKED_RADIX],
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  scale: 2,
  normalizeZeros: !0,
  padFractionalZeros: !1,
  parse: Number,
  format: (a) =>
    a.toLocaleString('en-US', { useGrouping: !1, maximumFractionDigits: 20 })
};
p.MaskedNumber = F;
const K = { MASKED: 'value', UNMASKED: 'unmaskedValue', TYPED: 'typedValue' };
function le(a, e, t) {
  e === void 0 && (e = K.MASKED), t === void 0 && (t = K.MASKED);
  const s = w(a);
  return (i) => s.runIsolated((n) => ((n[e] = i), n[t]));
}
function _e(a, e, t, s) {
  return le(e, t, s)(a);
}
p.PIPE_TYPE = K;
p.createPipe = le;
p.pipe = _e;
class Fe extends b {
  get repeatFrom() {
    var e;
    return (e = Array.isArray(this.repeat)
      ? this.repeat[0]
      : this.repeat === 1 / 0
        ? 0
        : this.repeat) != null
      ? e
      : 0;
  }
  get repeatTo() {
    var e;
    return (e = Array.isArray(this.repeat) ? this.repeat[1] : this.repeat) !=
      null
      ? e
      : 1 / 0;
  }
  constructor(e) {
    super(e);
  }
  updateOptions(e) {
    super.updateOptions(e);
  }
  _update(e) {
    var t, s, i;
    const { repeat: n, ...r } = L(e);
    this._blockOpts = Object.assign({}, this._blockOpts, r);
    const o = w(this._blockOpts);
    (this.repeat =
      (t = (s = n ?? o.repeat) != null ? s : this.repeat) != null ? t : 1 / 0),
      super._update({
        mask: 'm'.repeat(
          Math.max(
            (this.repeatTo === 1 / 0 &&
              ((i = this._blocks) == null ? void 0 : i.length)) ||
              0,
            this.repeatFrom
          )
        ),
        blocks: { m: o },
        eager: o.eager,
        overwrite: o.overwrite,
        skipInvalid: o.skipInvalid,
        lazy: o.lazy,
        placeholderChar: o.placeholderChar,
        displayChar: o.displayChar
      });
  }
  _allocateBlock(e) {
    if (e < this._blocks.length) return this._blocks[e];
    if (this.repeatTo === 1 / 0 || this._blocks.length < this.repeatTo)
      return (
        this._blocks.push(w(this._blockOpts)),
        (this.mask += 'm'),
        this._blocks[this._blocks.length - 1]
      );
  }
  _appendCharRaw(e, t) {
    t === void 0 && (t = {});
    const s = new f();
    for (
      let u =
          (i =
            (n = this._mapPosToBlock(this.displayValue.length)) == null
              ? void 0
              : n.index) != null
            ? i
            : Math.max(this._blocks.length - 1, 0),
        l,
        h;
      (l =
        (r = this._blocks[u]) != null ? r : (h = !h && this._allocateBlock(u)));
      ++u
    ) {
      var i, n, r, o;
      const c = l._appendChar(e, {
        ...t,
        _beforeTailState:
          (o = t._beforeTailState) == null || (o = o._blocks) == null
            ? void 0
            : o[u]
      });
      if (c.skip && h) {
        this._blocks.pop(), (this.mask = this.mask.slice(1));
        break;
      }
      if ((s.aggregate(c), c.consumed)) break;
    }
    return s;
  }
  _trimEmptyTail(e, t) {
    var s, i;
    e === void 0 && (e = 0);
    const n = Math.max(
      ((s = this._mapPosToBlock(e)) == null ? void 0 : s.index) || 0,
      this.repeatFrom,
      0
    );
    let r;
    t != null && (r = (i = this._mapPosToBlock(t)) == null ? void 0 : i.index),
      r == null && (r = this._blocks.length - 1);
    let o = 0;
    for (let u = r; n <= u && !this._blocks[u].unmaskedValue; --u, ++o);
    o && (this._blocks.splice(r - o + 1, o), (this.mask = this.mask.slice(o)));
  }
  reset() {
    super.reset(), this._trimEmptyTail();
  }
  remove(e, t) {
    e === void 0 && (e = 0), t === void 0 && (t = this.displayValue.length);
    const s = super.remove(e, t);
    return this._trimEmptyTail(e, t), s;
  }
  totalInputPositions(e, t) {
    return (
      e === void 0 && (e = 0),
      t == null && this.repeatTo === 1 / 0
        ? 1 / 0
        : super.totalInputPositions(e, t)
    );
  }
  get state() {
    return super.state;
  }
  set state(e) {
    (this._blocks.length = e._blocks.length),
      (this.mask = this.mask.slice(0, this._blocks.length)),
      (super.state = e);
  }
}
p.RepeatBlock = Fe;
try {
  globalThis.IMask = p;
} catch {}
var Ee = Object.defineProperty,
  Ce = (a, e, t) =>
    e in a
      ? Ee(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t })
      : (a[e] = t),
  v = (a, e, t) => (Ce(a, typeof e != 'symbol' ? e + '' : e, t), t);
const ye =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  Ae = /^-?[0-9]\d*$/,
  Se = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
  we = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  xe = (a) => {
    let e = a;
    return typeof a == 'string' && (e = a.trim()), !e;
  },
  Ie = (a) => ye.test(a),
  Ve = (a, e) => a.length > e,
  Te = (a, e) => a.length < e,
  Me = (a) => (typeof a != 'string' ? !1 : !isNaN(+a) && !isNaN(parseFloat(a))),
  Be = (a) => Ae.test(a),
  Le = (a) => Se.test(a),
  De = (a) => we.test(a),
  Oe = (a, e) => a > e,
  Ne = (a, e) => a < e,
  A = (a) => typeof a != 'string' || a === '';
var g = ((a) => (
    (a.Required = 'required'),
    (a.Email = 'email'),
    (a.MinLength = 'minLength'),
    (a.MaxLength = 'maxLength'),
    (a.Password = 'password'),
    (a.Number = 'number'),
    (a.Integer = 'integer'),
    (a.MaxNumber = 'maxNumber'),
    (a.MinNumber = 'minNumber'),
    (a.StrongPassword = 'strongPassword'),
    (a.CustomRegexp = 'customRegexp'),
    (a.MinFilesCount = 'minFilesCount'),
    (a.MaxFilesCount = 'maxFilesCount'),
    (a.Files = 'files'),
    a
  ))(g || {}),
  Y = ((a) => ((a.Required = 'required'), a))(Y || {}),
  ue = ((a) => ((a.Label = 'label'), (a.LabelArrow = 'labelArrow'), a))(
    ue || {}
  );
const J = [
    { key: g.Required, dict: { en: 'The field is required' } },
    { key: g.Email, dict: { en: 'Email has invalid format' } },
    {
      key: g.MaxLength,
      dict: { en: 'The field must contain a maximum of :value characters' }
    },
    {
      key: g.MinLength,
      dict: { en: 'The field must contain a minimum of :value characters' }
    },
    {
      key: g.Password,
      dict: {
        en: 'Password must contain minimum eight characters, at least one letter and one number'
      }
    },
    {
      key: g.StrongPassword,
      dict: {
        en: 'Password should contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
      }
    },
    { key: g.Number, dict: { en: 'Value should be a number' } },
    {
      key: g.MaxNumber,
      dict: { en: 'Number should be less or equal than :value' }
    },
    {
      key: g.MinNumber,
      dict: { en: 'Number should be more or equal than :value' }
    },
    {
      key: g.MinFilesCount,
      dict: { en: 'Files count should be more or equal than :value' }
    },
    {
      key: g.MaxFilesCount,
      dict: { en: 'Files count should be less or equal than :value' }
    },
    {
      key: g.Files,
      dict: {
        en: 'Uploaded files have one or several invalid properties (extension/size/type etc).'
      }
    }
  ],
  Re = 'Value is incorrect',
  M = (a) =>
    typeof a == 'object' &&
    a !== null &&
    'then' in a &&
    typeof a.then == 'function',
  Pe = (a) => {
    let e = a;
    const t = [];
    for (; e; ) t.unshift(e), (e = e.parentNode);
    return t;
  },
  je = (a, e) => {
    const t = [...e].reverse();
    for (let s = 0, i = t.length; s < i; ++s) {
      const n = t[s];
      for (const r in a) {
        const o = a[r];
        if (o.groupElem === n) return [r, o];
      }
    }
    return null;
  },
  C = (a) =>
    Array.isArray(a)
      ? a.filter((e) => e.length > 0)
      : typeof a == 'string' && a.trim()
        ? [...a.split(' ').filter((e) => e.length > 0)]
        : [],
  B = (a) => a instanceof Element || a instanceof HTMLDocument,
  $e =
    ".just-validate-error-label[data-tooltip=true]{position:fixed;padding:4px 8px;background:#423f3f;color:#fff;white-space:nowrap;z-index:10;border-radius:4px;transform:translateY(-5px)}.just-validate-error-label[data-tooltip=true]:before{content:'';width:0;height:0;border-left:solid 5px transparent;border-right:solid 5px transparent;border-bottom:solid 5px #423f3f;position:absolute;z-index:3;display:block;bottom:-5px;transform:rotate(180deg);left:calc(50% - 5px)}.just-validate-error-label[data-tooltip=true][data-direction=left]{transform:translateX(-5px)}.just-validate-error-label[data-tooltip=true][data-direction=left]:before{right:-7px;bottom:auto;left:auto;top:calc(50% - 2px);transform:rotate(90deg)}.just-validate-error-label[data-tooltip=true][data-direction=right]{transform:translateX(5px)}.just-validate-error-label[data-tooltip=true][data-direction=right]:before{right:auto;bottom:auto;left:-7px;top:calc(50% - 2px);transform:rotate(-90deg)}.just-validate-error-label[data-tooltip=true][data-direction=bottom]{transform:translateY(5px)}.just-validate-error-label[data-tooltip=true][data-direction=bottom]:before{right:auto;bottom:auto;left:calc(50% - 5px);top:-5px;transform:rotate(0)}",
  D = 5,
  z = {
    errorFieldStyle: { color: '#b81111', border: '1px solid #B81111' },
    errorFieldCssClass: 'just-validate-error-field',
    successFieldCssClass: 'just-validate-success-field',
    errorLabelStyle: { color: '#b81111' },
    errorLabelCssClass: 'just-validate-error-label',
    successLabelCssClass: 'just-validate-success-label',
    focusInvalidField: !0,
    lockForm: !0,
    testingMode: !1,
    validateBeforeSubmitting: !1,
    submitFormAutomatically: !1
  };
class he {
  constructor(e, t, s) {
    v(this, 'form', null),
      v(this, 'fields', {}),
      v(this, 'groupFields', {}),
      v(this, 'errors', {}),
      v(this, 'isValid', !1),
      v(this, 'isSubmitted', !1),
      v(this, 'globalConfig', z),
      v(this, 'errorLabels', {}),
      v(this, 'successLabels', {}),
      v(this, 'eventListeners', []),
      v(this, 'dictLocale', J),
      v(this, 'currentLocale', 'en'),
      v(this, 'customStyleTags', {}),
      v(this, 'onSuccessCallback'),
      v(this, 'onFailCallback'),
      v(this, 'onValidateCallback'),
      v(this, 'tooltips', []),
      v(this, 'lastScrollPosition'),
      v(this, 'isScrollTick'),
      v(this, 'fieldIds', new Map()),
      v(this, 'getKeyByFieldSelector', (i) => this.fieldIds.get(i)),
      v(this, 'getFieldSelectorByKey', (i) => {
        for (const [n, r] of this.fieldIds) if (i === r) return n;
      }),
      v(this, 'getCompatibleFields', () => {
        const i = {};
        return (
          Object.keys(this.fields).forEach((n) => {
            let r = n;
            const o = this.getFieldSelectorByKey(n);
            typeof o == 'string' && (r = o), (i[r] = { ...this.fields[n] });
          }),
          i
        );
      }),
      v(this, 'setKeyByFieldSelector', (i) => {
        if (this.fieldIds.has(i)) return this.fieldIds.get(i);
        const n = String(this.fieldIds.size + 1);
        return this.fieldIds.set(i, n), n;
      }),
      v(this, 'refreshAllTooltips', () => {
        this.tooltips.forEach((i) => {
          i.refresh();
        });
      }),
      v(this, 'handleDocumentScroll', () => {
        (this.lastScrollPosition = window.scrollY),
          this.isScrollTick ||
            (window.requestAnimationFrame(() => {
              this.refreshAllTooltips(), (this.isScrollTick = !1);
            }),
            (this.isScrollTick = !0));
      }),
      v(this, 'formSubmitHandler', (i) => {
        i.preventDefault(), (this.isSubmitted = !0), this.validateHandler(i);
      }),
      v(this, 'handleFieldChange', (i) => {
        let n;
        for (const r in this.fields)
          if (this.fields[r].elem === i) {
            n = r;
            break;
          }
        n && ((this.fields[n].touched = !0), this.validateField(n, !0));
      }),
      v(this, 'handleGroupChange', (i) => {
        let n;
        for (const r in this.groupFields)
          if (this.groupFields[r].elems.find((u) => u === i)) {
            n = r;
            break;
          }
        n && ((this.groupFields[n].touched = !0), this.validateGroup(n, !0));
      }),
      v(this, 'handlerChange', (i) => {
        i.target &&
          (this.handleFieldChange(i.target),
          this.handleGroupChange(i.target),
          this.renderErrors());
      }),
      this.initialize(e, t, s);
  }
  initialize(e, t, s) {
    if (
      ((this.form = null),
      (this.errors = {}),
      (this.isValid = !1),
      (this.isSubmitted = !1),
      (this.globalConfig = z),
      (this.errorLabels = {}),
      (this.successLabels = {}),
      (this.eventListeners = []),
      (this.customStyleTags = {}),
      (this.tooltips = []),
      (this.currentLocale = 'en'),
      typeof e == 'string')
    ) {
      const i = document.querySelector(e);
      if (!i)
        throw Error(
          `Form with ${e} selector not found! Please check the form selector`
        );
      this.setForm(i);
    } else if (e instanceof HTMLFormElement) this.setForm(e);
    else
      throw Error(
        'Form selector is not valid. Please specify a string selector or a DOM element.'
      );
    if (
      ((this.globalConfig = { ...z, ...t }),
      s && (this.dictLocale = [...s, ...J]),
      this.isTooltip())
    ) {
      const i = document.createElement('style');
      (i.textContent = $e),
        (this.customStyleTags[ue.Label] = document.head.appendChild(i)),
        this.addListener('scroll', document, this.handleDocumentScroll);
    }
  }
  getLocalisedString(e, t, s) {
    var i;
    const n = s ?? e;
    let r =
      (i = this.dictLocale.find((o) => o.key === n)) == null
        ? void 0
        : i.dict[this.currentLocale];
    if ((r || (s && (r = s)), r && t !== void 0))
      switch (e) {
        case g.MaxLength:
        case g.MinLength:
        case g.MaxNumber:
        case g.MinNumber:
        case g.MinFilesCount:
        case g.MaxFilesCount:
          r = r.replace(':value', String(t));
      }
    return r || s || Re;
  }
  getFieldErrorMessage(e, t) {
    const s =
      typeof e.errorMessage == 'function'
        ? e.errorMessage(this.getElemValue(t), this.fields)
        : e.errorMessage;
    return this.getLocalisedString(e.rule, e.value, s);
  }
  getFieldSuccessMessage(e, t) {
    const s = typeof e == 'function' ? e(this.getElemValue(t), this.fields) : e;
    return this.getLocalisedString(void 0, void 0, s);
  }
  getGroupErrorMessage(e) {
    return this.getLocalisedString(e.rule, void 0, e.errorMessage);
  }
  getGroupSuccessMessage(e) {
    if (e.successMessage)
      return this.getLocalisedString(void 0, void 0, e.successMessage);
  }
  setFieldInvalid(e, t) {
    (this.fields[e].isValid = !1),
      (this.fields[e].errorMessage = this.getFieldErrorMessage(
        t,
        this.fields[e].elem
      ));
  }
  setFieldValid(e, t) {
    (this.fields[e].isValid = !0),
      t !== void 0 &&
        (this.fields[e].successMessage = this.getFieldSuccessMessage(
          t,
          this.fields[e].elem
        ));
  }
  setGroupInvalid(e, t) {
    (this.groupFields[e].isValid = !1),
      (this.groupFields[e].errorMessage = this.getGroupErrorMessage(t));
  }
  setGroupValid(e, t) {
    (this.groupFields[e].isValid = !0),
      (this.groupFields[e].successMessage = this.getGroupSuccessMessage(t));
  }
  getElemValue(e) {
    switch (e.type) {
      case 'checkbox':
        return e.checked;
      case 'file':
        return e.files;
      default:
        return e.value;
    }
  }
  validateGroupRule(e, t, s) {
    switch (s.rule) {
      case Y.Required:
        t.every((i) => !i.checked)
          ? this.setGroupInvalid(e, s)
          : this.setGroupValid(e, s);
    }
  }
  validateFieldRule(e, t, s, i = !1) {
    const n = s.value,
      r = this.getElemValue(t);
    if (s.plugin) {
      s.plugin(r, this.getCompatibleFields()) || this.setFieldInvalid(e, s);
      return;
    }
    switch (s.rule) {
      case g.Required: {
        xe(r) && this.setFieldInvalid(e, s);
        break;
      }
      case g.Email: {
        if (A(r)) break;
        Ie(r) || this.setFieldInvalid(e, s);
        break;
      }
      case g.MaxLength: {
        if (n === void 0) {
          console.error(
            `Value for ${s.rule} rule for [${e}] field is not defined. The field will be always invalid.`
          ),
            this.setFieldInvalid(e, s);
          break;
        }
        if (typeof n != 'number') {
          console.error(
            `Value for ${s.rule} rule for [${e}] should be a number. The field will be always invalid.`
          ),
            this.setFieldInvalid(e, s);
          break;
        }
        if (A(r)) break;
        Ve(r, n) && this.setFieldInvalid(e, s);
        break;
      }
      case g.MinLength: {
        if (n === void 0) {
          console.error(
            `Value for ${s.rule} rule for [${e}] field is not defined. The field will be always invalid.`
          ),
            this.setFieldInvalid(e, s);
          break;
        }
        if (typeof n != 'number') {
          console.error(
            `Value for ${s.rule} rule for [${e}] should be a number. The field will be always invalid.`
          ),
            this.setFieldInvalid(e, s);
          break;
        }
        if (A(r)) break;
        Te(r, n) && this.setFieldInvalid(e, s);
        break;
      }
      case g.Password: {
        if (A(r)) break;
        Le(r) || this.setFieldInvalid(e, s);
        break;
      }
      case g.StrongPassword: {
        if (A(r)) break;
        De(r) || this.setFieldInvalid(e, s);
        break;
      }
      case g.Number: {
        if (A(r)) break;
        Me(r) || this.setFieldInvalid(e, s);
        break;
      }
      case g.Integer: {
        if (A(r)) break;
        Be(r) || this.setFieldInvalid(e, s);
        break;
      }
      case g.MaxNumber: {
        if (n === void 0) {
          console.error(
            `Value for ${s.rule} rule for [${e}] field is not defined. The field will be always invalid.`
          ),
            this.setFieldInvalid(e, s);
          break;
        }
        if (typeof n != 'number') {
          console.error(
            `Value for ${s.rule} rule for [${e}] field should be a number. The field will be always invalid.`
          ),
            this.setFieldInvalid(e, s);
          break;
        }
        if (A(r)) break;
        const o = +r;
        (Number.isNaN(o) || Oe(o, n)) && this.setFieldInvalid(e, s);
        break;
      }
      case g.MinNumber: {
        if (n === void 0) {
          console.error(
            `Value for ${s.rule} rule for [${e}] field is not defined. The field will be always invalid.`
          ),
            this.setFieldInvalid(e, s);
          break;
        }
        if (typeof n != 'number') {
          console.error(
            `Value for ${s.rule} rule for [${e}] field should be a number. The field will be always invalid.`
          ),
            this.setFieldInvalid(e, s);
          break;
        }
        if (A(r)) break;
        const o = +r;
        (Number.isNaN(o) || Ne(o, n)) && this.setFieldInvalid(e, s);
        break;
      }
      case g.CustomRegexp: {
        if (n === void 0) {
          console.error(
            `Value for ${s.rule} rule for [${e}] field is not defined. This field will be always invalid.`
          ),
            this.setFieldInvalid(e, s);
          return;
        }
        let o;
        try {
          o = new RegExp(n);
        } catch {
          console.error(
            `Value for ${s.rule} rule for [${e}] should be a valid regexp. This field will be always invalid.`
          ),
            this.setFieldInvalid(e, s);
          break;
        }
        const u = String(r);
        u !== '' && !o.test(u) && this.setFieldInvalid(e, s);
        break;
      }
      case g.MinFilesCount: {
        if (n === void 0) {
          console.error(
            `Value for ${s.rule} rule for [${e}] field is not defined. This field will be always invalid.`
          ),
            this.setFieldInvalid(e, s);
          break;
        }
        if (typeof n != 'number') {
          console.error(
            `Value for ${s.rule} rule for [${e}] field should be a number. The field will be always invalid.`
          ),
            this.setFieldInvalid(e, s);
          break;
        }
        if (Number.isFinite(r == null ? void 0 : r.length) && r.length < n) {
          this.setFieldInvalid(e, s);
          break;
        }
        break;
      }
      case g.MaxFilesCount: {
        if (n === void 0) {
          console.error(
            `Value for ${s.rule} rule for [${e}] field is not defined. This field will be always invalid.`
          ),
            this.setFieldInvalid(e, s);
          break;
        }
        if (typeof n != 'number') {
          console.error(
            `Value for ${s.rule} rule for [${e}] field should be a number. The field will be always invalid.`
          ),
            this.setFieldInvalid(e, s);
          break;
        }
        if (Number.isFinite(r == null ? void 0 : r.length) && r.length > n) {
          this.setFieldInvalid(e, s);
          break;
        }
        break;
      }
      case g.Files: {
        if (n === void 0) {
          console.error(
            `Value for ${s.rule} rule for [${e}] field is not defined. This field will be always invalid.`
          ),
            this.setFieldInvalid(e, s);
          return;
        }
        if (typeof n != 'object') {
          console.error(
            `Value for ${s.rule} rule for [${e}] field should be an object. This field will be always invalid.`
          ),
            this.setFieldInvalid(e, s);
          return;
        }
        const o = n.files;
        if (typeof o != 'object') {
          console.error(
            `Value for ${s.rule} rule for [${e}] field should be an object with files array. This field will be always invalid.`
          ),
            this.setFieldInvalid(e, s);
          return;
        }
        const u = (l, h) => {
          const c = Number.isFinite(h.minSize) && l.size < h.minSize,
            m = Number.isFinite(h.maxSize) && l.size > h.maxSize,
            _ = Array.isArray(h.names) && !h.names.includes(l.name),
            I =
              Array.isArray(h.extensions) &&
              !h.extensions.includes(
                l.name.split('.')[l.name.split('.').length - 1]
              ),
            T = Array.isArray(h.types) && !h.types.includes(l.type);
          return c || m || _ || I || T;
        };
        if (typeof r == 'object' && r !== null)
          for (let l = 0, h = r.length; l < h; ++l) {
            const c = r.item(l);
            if (!c) {
              this.setFieldInvalid(e, s);
              break;
            }
            if (u(c, o)) {
              this.setFieldInvalid(e, s);
              break;
            }
          }
        break;
      }
      default: {
        if (typeof s.validator != 'function') {
          console.error(
            `Validator for custom rule for [${e}] field should be a function. This field will be always invalid.`
          ),
            this.setFieldInvalid(e, s);
          return;
        }
        const o = s.validator(r, this.getCompatibleFields());
        if (
          (typeof o != 'boolean' &&
            typeof o != 'function' &&
            console.error(
              `Validator return value for [${e}] field should be boolean or function. It will be cast to boolean.`
            ),
          typeof o == 'function')
        )
          if (i) this.fields[e].asyncCheckPending = !0;
          else {
            this.fields[e].asyncCheckPending = !1;
            const u = o();
            if (!M(u)) {
              console.error(
                `Validator function for custom rule for [${e}] field should return a Promise. This field will be always invalid.`
              ),
                this.setFieldInvalid(e, s);
              return;
            }
            return u
              .then((l) => {
                l || this.setFieldInvalid(e, s);
              })
              .catch(() => {
                this.setFieldInvalid(e, s);
              });
          }
        o || this.setFieldInvalid(e, s);
      }
    }
  }
  isFormValid() {
    let e = !0;
    for (let t = 0, s = Object.values(this.fields).length; t < s; ++t) {
      const i = Object.values(this.fields)[t];
      if (i.isValid === void 0) {
        e = void 0;
        break;
      }
      if (i.isValid === !1) {
        e = !1;
        break;
      }
    }
    for (let t = 0, s = Object.values(this.groupFields).length; t < s; ++t) {
      const i = Object.values(this.groupFields)[t];
      if (i.isValid === void 0) {
        e = void 0;
        break;
      }
      if (i.isValid === !1) {
        e = !1;
        break;
      }
    }
    return e;
  }
  validateField(e, t = !1) {
    var s;
    const i = this.fields[e];
    i.isValid = !0;
    const n = [];
    return (
      [...i.rules].reverse().forEach((r) => {
        const o = this.validateFieldRule(e, i.elem, r, t);
        M(o) && n.push(o);
      }),
      i.isValid &&
        this.setFieldValid(
          e,
          (s = i.config) == null ? void 0 : s.successMessage
        ),
      Promise.allSettled(n).finally(() => {
        var r;
        t &&
          ((r = this.onValidateCallback) == null ||
            r.call(this, {
              isValid: this.isFormValid(),
              isSubmitted: this.isSubmitted,
              fields: this.getCompatibleFields(),
              groups: { ...this.groupFields }
            }));
      })
    );
  }
  revalidateField(e) {
    if (typeof e != 'string' && !B(e))
      throw Error(
        'Field selector is not valid. Please specify a string selector or a valid DOM element.'
      );
    const t = this.getKeyByFieldSelector(e);
    return !t || !this.fields[t]
      ? (console.error('Field not found. Check the field selector.'),
        Promise.reject())
      : new Promise((s) => {
          this.validateField(t, !0).finally(() => {
            this.clearFieldStyle(t),
              this.clearFieldLabel(t),
              this.renderFieldError(t, !0),
              s(!!this.fields[t].isValid);
          });
        });
  }
  revalidateGroup(e) {
    if (typeof e != 'string' && !B(e))
      throw Error(
        'Group selector is not valid. Please specify a string selector or a valid DOM element.'
      );
    const t = this.getKeyByFieldSelector(e);
    return !t || !this.groupFields[t]
      ? (console.error('Group not found. Check the group selector.'),
        Promise.reject())
      : new Promise((s) => {
          this.validateGroup(t).finally(() => {
            this.clearFieldLabel(t),
              this.renderGroupError(t, !0),
              s(!!this.groupFields[t].isValid);
          });
        });
  }
  validateGroup(e, t = !1) {
    const s = this.groupFields[e],
      i = [];
    return (
      [...s.rules].reverse().forEach((n) => {
        const r = this.validateGroupRule(e, s.elems, n);
        M(r) && i.push(r);
      }),
      Promise.allSettled(i).finally(() => {
        var n;
        t &&
          ((n = this.onValidateCallback) == null ||
            n.call(this, {
              isValid: this.isFormValid(),
              isSubmitted: this.isSubmitted,
              fields: this.getCompatibleFields(),
              groups: { ...this.groupFields }
            }));
      })
    );
  }
  focusInvalidField() {
    for (const e in this.fields) {
      const t = this.fields[e];
      if (!t.isValid) {
        setTimeout(() => t.elem.focus(), 0);
        break;
      }
    }
  }
  afterSubmitValidation(e = !1) {
    this.renderErrors(e),
      this.globalConfig.focusInvalidField && this.focusInvalidField();
  }
  validate(e = !1) {
    return new Promise((t) => {
      const s = [];
      Object.keys(this.fields).forEach((i) => {
        const n = this.validateField(i);
        M(n) && s.push(n);
      }),
        Object.keys(this.groupFields).forEach((i) => {
          const n = this.validateGroup(i);
          M(n) && s.push(n);
        }),
        Promise.allSettled(s).then(() => {
          var i;
          this.afterSubmitValidation(e),
            (i = this.onValidateCallback) == null ||
              i.call(this, {
                isValid: this.isFormValid(),
                isSubmitted: this.isSubmitted,
                fields: this.getCompatibleFields(),
                groups: { ...this.groupFields }
              }),
            t(!!s.length);
        });
    });
  }
  revalidate() {
    return new Promise((e) => {
      this.validateHandler(void 0, !0).finally(() => {
        this.globalConfig.focusInvalidField && this.focusInvalidField(),
          e(this.isValid);
      });
    });
  }
  validateHandler(e, t = !1) {
    return (
      this.globalConfig.lockForm && this.lockForm(),
      this.validate(t).finally(() => {
        var s, i, n;
        this.globalConfig.lockForm && this.unlockForm(),
          this.isValid
            ? ((s = this.onSuccessCallback) == null || s.call(this, e),
              this.globalConfig.submitFormAutomatically &&
                ((i = e == null ? void 0 : e.currentTarget) == null ||
                  i.submit()))
            : (n = this.onFailCallback) == null ||
              n.call(this, this.getCompatibleFields(), this.groupFields);
      })
    );
  }
  setForm(e) {
    (this.form = e),
      this.form.setAttribute('novalidate', 'novalidate'),
      this.removeListener('submit', this.form, this.formSubmitHandler),
      this.addListener('submit', this.form, this.formSubmitHandler);
  }
  addListener(e, t, s) {
    t.addEventListener(e, s),
      this.eventListeners.push({ type: e, elem: t, func: s });
  }
  removeListener(e, t, s) {
    t.removeEventListener(e, s),
      (this.eventListeners = this.eventListeners.filter(
        (i) => i.type !== e || i.elem !== t
      ));
  }
  addField(e, t, s) {
    if (typeof e != 'string' && !B(e))
      throw Error(
        'Field selector is not valid. Please specify a string selector or a valid DOM element.'
      );
    let i;
    if ((typeof e == 'string' ? (i = this.form.querySelector(e)) : (i = e), !i))
      throw Error(
        "Field doesn't exist in the DOM! Please check the field selector."
      );
    if (!Array.isArray(t) || !t.length)
      throw Error(
        'Rules argument should be an array and should contain at least 1 element.'
      );
    t.forEach((r) => {
      if (!('rule' in r || 'validator' in r || 'plugin' in r))
        throw Error(
          'Rules argument must contain at least one rule or validator property.'
        );
      if (
        !r.validator &&
        !r.plugin &&
        (!r.rule || !Object.values(g).includes(r.rule))
      )
        throw Error(
          `Rule should be one of these types: ${Object.values(g).join(', ')}. Provided value: ${r.rule}`
        );
    });
    const n = this.setKeyByFieldSelector(e);
    return (
      (this.fields[n] = {
        elem: i,
        rules: t,
        isValid: void 0,
        touched: !1,
        config: s
      }),
      this.setListeners(i),
      (this.isSubmitted || this.globalConfig.validateBeforeSubmitting) &&
        this.validateField(n),
      this
    );
  }
  removeField(e) {
    if (typeof e != 'string' && !B(e))
      throw Error(
        'Field selector is not valid. Please specify a string selector or a valid DOM element.'
      );
    const t = this.getKeyByFieldSelector(e);
    if (!t || !this.fields[t])
      return console.error('Field not found. Check the field selector.'), this;
    const s = this.getListenerType(this.fields[t].elem.type);
    return (
      this.removeListener(s, this.fields[t].elem, this.handlerChange),
      this.clearErrors(),
      delete this.fields[t],
      this
    );
  }
  removeGroup(e) {
    if (typeof e != 'string')
      throw Error(
        'Group selector is not valid. Please specify a string selector.'
      );
    const t = this.getKeyByFieldSelector(e);
    return !t || !this.groupFields[t]
      ? (console.error('Group not found. Check the group selector.'), this)
      : (this.groupFields[t].elems.forEach((s) => {
          const i = this.getListenerType(s.type);
          this.removeListener(i, s, this.handlerChange);
        }),
        this.clearErrors(),
        delete this.groupFields[t],
        this);
  }
  addRequiredGroup(e, t, s, i) {
    if (typeof e != 'string' && !B(e))
      throw Error(
        'Group selector is not valid. Please specify a string selector or a valid DOM element.'
      );
    let n;
    if ((typeof e == 'string' ? (n = this.form.querySelector(e)) : (n = e), !n))
      throw Error('Group selector not found! Please check the group selector.');
    const r = n.querySelectorAll('input'),
      o = Array.from(r).filter((l) => {
        const h = je(this.groupFields, Pe(l));
        return h ? h[1].elems.find((c) => c !== l) : !0;
      }),
      u = this.setKeyByFieldSelector(e);
    return (
      (this.groupFields[u] = {
        rules: [{ rule: Y.Required, errorMessage: t, successMessage: i }],
        groupElem: n,
        elems: o,
        touched: !1,
        isValid: void 0,
        config: s
      }),
      r.forEach((l) => {
        this.setListeners(l);
      }),
      this
    );
  }
  getListenerType(e) {
    switch (e) {
      case 'checkbox':
      case 'select-one':
      case 'file':
      case 'radio':
        return 'change';
      default:
        return 'input';
    }
  }
  setListeners(e) {
    const t = this.getListenerType(e.type);
    this.removeListener(t, e, this.handlerChange),
      this.addListener(t, e, this.handlerChange);
  }
  clearFieldLabel(e) {
    var t, s;
    (t = this.errorLabels[e]) == null || t.remove(),
      (s = this.successLabels[e]) == null || s.remove();
  }
  clearFieldStyle(e) {
    var t, s, i, n;
    const r = this.fields[e],
      o =
        ((t = r.config) == null ? void 0 : t.errorFieldStyle) ||
        this.globalConfig.errorFieldStyle;
    Object.keys(o).forEach((l) => {
      r.elem.style[l] = '';
    });
    const u =
      ((s = r.config) == null ? void 0 : s.successFieldStyle) ||
      this.globalConfig.successFieldStyle ||
      {};
    Object.keys(u).forEach((l) => {
      r.elem.style[l] = '';
    }),
      r.elem.classList.remove(
        ...C(
          ((i = r.config) == null ? void 0 : i.errorFieldCssClass) ||
            this.globalConfig.errorFieldCssClass
        ),
        ...C(
          ((n = r.config) == null ? void 0 : n.successFieldCssClass) ||
            this.globalConfig.successFieldCssClass
        )
      );
  }
  clearErrors() {
    var e, t;
    Object.keys(this.errorLabels).forEach((s) => this.errorLabels[s].remove()),
      Object.keys(this.successLabels).forEach((s) =>
        this.successLabels[s].remove()
      );
    for (const s in this.fields) this.clearFieldStyle(s);
    for (const s in this.groupFields) {
      const i = this.groupFields[s],
        n =
          ((e = i.config) == null ? void 0 : e.errorFieldStyle) ||
          this.globalConfig.errorFieldStyle;
      Object.keys(n).forEach((o) => {
        i.elems.forEach((u) => {
          var l;
          (u.style[o] = ''),
            u.classList.remove(
              ...C(
                ((l = i.config) == null ? void 0 : l.errorFieldCssClass) ||
                  this.globalConfig.errorFieldCssClass
              )
            );
        });
      });
      const r =
        ((t = i.config) == null ? void 0 : t.successFieldStyle) ||
        this.globalConfig.successFieldStyle ||
        {};
      Object.keys(r).forEach((o) => {
        i.elems.forEach((u) => {
          var l;
          (u.style[o] = ''),
            u.classList.remove(
              ...C(
                ((l = i.config) == null ? void 0 : l.successFieldCssClass) ||
                  this.globalConfig.successFieldCssClass
              )
            );
        });
      });
    }
    this.tooltips = [];
  }
  isTooltip() {
    return !!this.globalConfig.tooltip;
  }
  lockForm() {
    const e = this.form.querySelectorAll('input, textarea, button, select');
    for (let t = 0, s = e.length; t < s; ++t)
      e[t].setAttribute(
        'data-just-validate-fallback-disabled',
        e[t].disabled ? 'true' : 'false'
      ),
        e[t].setAttribute('disabled', 'disabled'),
        (e[t].style.pointerEvents = 'none'),
        (e[t].style.webkitFilter = 'grayscale(100%)'),
        (e[t].style.filter = 'grayscale(100%)');
  }
  unlockForm() {
    const e = this.form.querySelectorAll('input, textarea, button, select');
    for (let t = 0, s = e.length; t < s; ++t)
      e[t].getAttribute('data-just-validate-fallback-disabled') !== 'true' &&
        e[t].removeAttribute('disabled'),
        (e[t].style.pointerEvents = ''),
        (e[t].style.webkitFilter = ''),
        (e[t].style.filter = '');
  }
  renderTooltip(e, t, s) {
    var i;
    const { top: n, left: r, width: o, height: u } = e.getBoundingClientRect(),
      l = t.getBoundingClientRect(),
      h = s || ((i = this.globalConfig.tooltip) == null ? void 0 : i.position);
    switch (h) {
      case 'left': {
        (t.style.top = `${n + u / 2 - l.height / 2}px`),
          (t.style.left = `${r - l.width - D}px`);
        break;
      }
      case 'top': {
        (t.style.top = `${n - l.height - D}px`),
          (t.style.left = `${r + o / 2 - l.width / 2}px`);
        break;
      }
      case 'right': {
        (t.style.top = `${n + u / 2 - l.height / 2}px`),
          (t.style.left = `${r + o + D}px`);
        break;
      }
      case 'bottom': {
        (t.style.top = `${n + u + D}px`),
          (t.style.left = `${r + o / 2 - l.width / 2}px`);
        break;
      }
    }
    return (
      (t.dataset.direction = h),
      {
        refresh: () => {
          this.renderTooltip(e, t, s);
        }
      }
    );
  }
  createErrorLabelElem(e, t, s) {
    const i = document.createElement('div');
    i.innerHTML = t;
    const n = this.isTooltip()
      ? s == null
        ? void 0
        : s.errorLabelStyle
      : (s == null ? void 0 : s.errorLabelStyle) ||
        this.globalConfig.errorLabelStyle;
    return (
      Object.assign(i.style, n),
      i.classList.add(
        ...C(
          (s == null ? void 0 : s.errorLabelCssClass) ||
            this.globalConfig.errorLabelCssClass
        ),
        'just-validate-error-label'
      ),
      this.isTooltip() && (i.dataset.tooltip = 'true'),
      this.globalConfig.testingMode && (i.dataset.testId = `error-label-${e}`),
      (this.errorLabels[e] = i),
      i
    );
  }
  createSuccessLabelElem(e, t, s) {
    if (t === void 0) return null;
    const i = document.createElement('div');
    i.innerHTML = t;
    const n =
      (s == null ? void 0 : s.successLabelStyle) ||
      this.globalConfig.successLabelStyle;
    return (
      Object.assign(i.style, n),
      i.classList.add(
        ...C(
          (s == null ? void 0 : s.successLabelCssClass) ||
            this.globalConfig.successLabelCssClass
        ),
        'just-validate-success-label'
      ),
      this.globalConfig.testingMode &&
        (i.dataset.testId = `success-label-${e}`),
      (this.successLabels[e] = i),
      i
    );
  }
  renderErrorsContainer(e, t) {
    const s = t || this.globalConfig.errorsContainer;
    if (typeof s == 'string') {
      const i = this.form.querySelector(s);
      if (i) return i.appendChild(e), !0;
      console.error(
        `Error container with ${s} selector not found. Errors will be rendered as usual`
      );
    }
    return s instanceof Element
      ? (s.appendChild(e), !0)
      : (s !== void 0 &&
          console.error(
            'Error container not found. It should be a string or existing Element. Errors will be rendered as usual'
          ),
        !1);
  }
  renderGroupLabel(e, t, s, i) {
    (!i && this.renderErrorsContainer(t, s)) || e.appendChild(t);
  }
  renderFieldLabel(e, t, s, i) {
    var n, r, o, u, l, h, c;
    if (!(!i && this.renderErrorsContainer(t, s)))
      if (e.type === 'checkbox' || e.type === 'radio') {
        const m = document.querySelector(
          `label[for="${e.getAttribute('id')}"]`
        );
        ((r = (n = e.parentElement) == null ? void 0 : n.tagName) == null
          ? void 0
          : r.toLowerCase()) === 'label'
          ? (u = (o = e.parentElement) == null ? void 0 : o.parentElement) ==
              null || u.appendChild(t)
          : m
            ? (l = m.parentElement) == null || l.appendChild(t)
            : (h = e.parentElement) == null || h.appendChild(t);
      } else (c = e.parentElement) == null || c.appendChild(t);
  }
  showLabels(e, t) {
    Object.keys(e).forEach((s, i) => {
      const n = e[s],
        r = this.getKeyByFieldSelector(s);
      if (!r || !this.fields[r]) {
        console.error('Field not found. Check the field selector.');
        return;
      }
      const o = this.fields[r];
      (o.isValid = !t),
        this.clearFieldStyle(r),
        this.clearFieldLabel(r),
        this.renderFieldError(r, !1, n),
        i === 0 &&
          this.globalConfig.focusInvalidField &&
          setTimeout(() => o.elem.focus(), 0);
    });
  }
  showErrors(e) {
    if (typeof e != 'object')
      throw Error(
        '[showErrors]: Errors should be an object with key: value format'
      );
    this.showLabels(e, !0);
  }
  showSuccessLabels(e) {
    if (typeof e != 'object')
      throw Error(
        '[showSuccessLabels]: Labels should be an object with key: value format'
      );
    this.showLabels(e, !1);
  }
  renderFieldError(e, t = !1, s) {
    var i, n, r, o, u, l;
    const h = this.fields[e];
    if (
      (h.isValid === !1 && (this.isValid = !1),
      h.isValid === void 0 ||
        (!t && !this.isSubmitted && !h.touched && s === void 0))
    )
      return;
    if (h.isValid) {
      if (!h.asyncCheckPending) {
        const m = this.createSuccessLabelElem(
          e,
          s !== void 0 ? s : h.successMessage,
          h.config
        );
        m &&
          this.renderFieldLabel(
            h.elem,
            m,
            (i = h.config) == null ? void 0 : i.errorsContainer,
            !0
          ),
          h.elem.classList.add(
            ...C(
              ((n = h.config) == null ? void 0 : n.successFieldCssClass) ||
                this.globalConfig.successFieldCssClass
            )
          );
      }
      return;
    }
    h.elem.classList.add(
      ...C(
        ((r = h.config) == null ? void 0 : r.errorFieldCssClass) ||
          this.globalConfig.errorFieldCssClass
      )
    );
    const c = this.createErrorLabelElem(
      e,
      s !== void 0 ? s : h.errorMessage,
      h.config
    );
    this.renderFieldLabel(
      h.elem,
      c,
      (o = h.config) == null ? void 0 : o.errorsContainer
    ),
      this.isTooltip() &&
        this.tooltips.push(
          this.renderTooltip(
            h.elem,
            c,
            (l = (u = h.config) == null ? void 0 : u.tooltip) == null
              ? void 0
              : l.position
          )
        );
  }
  renderGroupError(e, t = !0) {
    var s, i, n, r;
    const o = this.groupFields[e];
    if (
      (o.isValid === !1 && (this.isValid = !1),
      o.isValid === void 0 || (!t && !this.isSubmitted && !o.touched))
    )
      return;
    if (o.isValid) {
      o.elems.forEach((h) => {
        var c, m;
        Object.assign(
          h.style,
          ((c = o.config) == null ? void 0 : c.successFieldStyle) ||
            this.globalConfig.successFieldStyle
        ),
          h.classList.add(
            ...C(
              ((m = o.config) == null ? void 0 : m.successFieldCssClass) ||
                this.globalConfig.successFieldCssClass
            )
          );
      });
      const l = this.createSuccessLabelElem(e, o.successMessage, o.config);
      l &&
        this.renderGroupLabel(
          o.groupElem,
          l,
          (s = o.config) == null ? void 0 : s.errorsContainer,
          !0
        );
      return;
    }
    (this.isValid = !1),
      o.elems.forEach((l) => {
        var h, c;
        Object.assign(
          l.style,
          ((h = o.config) == null ? void 0 : h.errorFieldStyle) ||
            this.globalConfig.errorFieldStyle
        ),
          l.classList.add(
            ...C(
              ((c = o.config) == null ? void 0 : c.errorFieldCssClass) ||
                this.globalConfig.errorFieldCssClass
            )
          );
      });
    const u = this.createErrorLabelElem(e, o.errorMessage, o.config);
    this.renderGroupLabel(
      o.groupElem,
      u,
      (i = o.config) == null ? void 0 : i.errorsContainer
    ),
      this.isTooltip() &&
        this.tooltips.push(
          this.renderTooltip(
            o.groupElem,
            u,
            (r = (n = o.config) == null ? void 0 : n.tooltip) == null
              ? void 0
              : r.position
          )
        );
  }
  renderErrors(e = !1) {
    if (
      !(!this.isSubmitted && !e && !this.globalConfig.validateBeforeSubmitting)
    ) {
      this.clearErrors(), (this.isValid = !0);
      for (const t in this.groupFields) this.renderGroupError(t);
      for (const t in this.fields) this.renderFieldError(t);
    }
  }
  destroy() {
    this.eventListeners.forEach((e) => {
      this.removeListener(e.type, e.elem, e.func);
    }),
      Object.keys(this.customStyleTags).forEach((e) => {
        this.customStyleTags[e].remove();
      }),
      this.clearErrors(),
      this.globalConfig.lockForm && this.unlockForm();
  }
  refresh() {
    this.destroy(),
      this.form
        ? (this.initialize(this.form, this.globalConfig),
          Object.keys(this.fields).forEach((e) => {
            const t = this.getFieldSelectorByKey(e);
            t &&
              this.addField(
                t,
                [...this.fields[e].rules],
                this.fields[e].config
              );
          }))
        : console.error('Cannot initialize the library! Form is not defined');
  }
  setCurrentLocale(e) {
    if (typeof e != 'string' && e !== void 0) {
      console.error('Current locale should be a string');
      return;
    }
    (this.currentLocale = e), this.isSubmitted && this.validate();
  }
  onSuccess(e) {
    return (this.onSuccessCallback = e), this;
  }
  onFail(e) {
    return (this.onFailCallback = e), this;
  }
  onValidate(e) {
    return (this.onValidateCallback = e), this;
  }
}
function Ge(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, 'default')
    ? a.default
    : a;
}
var N = { exports: {} };
/*!
 * Toastify js 1.12.0
 * https://github.com/apvarun/toastify-js
 * @license MIT licensed
 *
 * Copyright (C) 2018 Varun A P
 */ var qe = N.exports,
  Q;
function Ue() {
  return (
    Q ||
      ((Q = 1),
      (function (a) {
        (function (e, t) {
          a.exports ? (a.exports = t()) : (e.Toastify = t());
        })(qe, function (e) {
          var t = function (r) {
              return new t.lib.init(r);
            },
            s = '1.12.0';
          (t.defaults = {
            oldestFirst: !0,
            text: 'Toastify is awesome!',
            node: void 0,
            duration: 3e3,
            selector: void 0,
            callback: function () {},
            destination: void 0,
            newWindow: !1,
            close: !1,
            gravity: 'toastify-top',
            positionLeft: !1,
            position: '',
            backgroundColor: '',
            avatar: '',
            className: '',
            stopOnFocus: !0,
            onClick: function () {},
            offset: { x: 0, y: 0 },
            escapeMarkup: !0,
            ariaLive: 'polite',
            style: { background: '' }
          }),
            (t.lib = t.prototype =
              {
                toastify: s,
                constructor: t,
                init: function (r) {
                  return (
                    r || (r = {}),
                    (this.options = {}),
                    (this.toastElement = null),
                    (this.options.text = r.text || t.defaults.text),
                    (this.options.node = r.node || t.defaults.node),
                    (this.options.duration =
                      r.duration === 0 ? 0 : r.duration || t.defaults.duration),
                    (this.options.selector = r.selector || t.defaults.selector),
                    (this.options.callback = r.callback || t.defaults.callback),
                    (this.options.destination =
                      r.destination || t.defaults.destination),
                    (this.options.newWindow =
                      r.newWindow || t.defaults.newWindow),
                    (this.options.close = r.close || t.defaults.close),
                    (this.options.gravity =
                      r.gravity === 'bottom'
                        ? 'toastify-bottom'
                        : t.defaults.gravity),
                    (this.options.positionLeft =
                      r.positionLeft || t.defaults.positionLeft),
                    (this.options.position = r.position || t.defaults.position),
                    (this.options.backgroundColor =
                      r.backgroundColor || t.defaults.backgroundColor),
                    (this.options.avatar = r.avatar || t.defaults.avatar),
                    (this.options.className =
                      r.className || t.defaults.className),
                    (this.options.stopOnFocus =
                      r.stopOnFocus === void 0
                        ? t.defaults.stopOnFocus
                        : r.stopOnFocus),
                    (this.options.onClick = r.onClick || t.defaults.onClick),
                    (this.options.offset = r.offset || t.defaults.offset),
                    (this.options.escapeMarkup =
                      r.escapeMarkup !== void 0
                        ? r.escapeMarkup
                        : t.defaults.escapeMarkup),
                    (this.options.ariaLive = r.ariaLive || t.defaults.ariaLive),
                    (this.options.style = r.style || t.defaults.style),
                    r.backgroundColor &&
                      (this.options.style.background = r.backgroundColor),
                    this
                  );
                },
                buildToast: function () {
                  if (!this.options) throw 'Toastify is not initialized';
                  var r = document.createElement('div');
                  (r.className = 'toastify on ' + this.options.className),
                    this.options.position
                      ? (r.className += ' toastify-' + this.options.position)
                      : this.options.positionLeft === !0
                        ? ((r.className += ' toastify-left'),
                          console.warn(
                            'Property `positionLeft` will be depreciated in further versions. Please use `position` instead.'
                          ))
                        : (r.className += ' toastify-right'),
                    (r.className += ' ' + this.options.gravity),
                    this.options.backgroundColor &&
                      console.warn(
                        'DEPRECATION NOTICE: "backgroundColor" is being deprecated. Please use the "style.background" property.'
                      );
                  for (var o in this.options.style)
                    r.style[o] = this.options.style[o];
                  if (
                    (this.options.ariaLive &&
                      r.setAttribute('aria-live', this.options.ariaLive),
                    this.options.node &&
                      this.options.node.nodeType === Node.ELEMENT_NODE)
                  )
                    r.appendChild(this.options.node);
                  else if (
                    (this.options.escapeMarkup
                      ? (r.innerText = this.options.text)
                      : (r.innerHTML = this.options.text),
                    this.options.avatar !== '')
                  ) {
                    var u = document.createElement('img');
                    (u.src = this.options.avatar),
                      (u.className = 'toastify-avatar'),
                      this.options.position == 'left' ||
                      this.options.positionLeft === !0
                        ? r.appendChild(u)
                        : r.insertAdjacentElement('afterbegin', u);
                  }
                  if (this.options.close === !0) {
                    var l = document.createElement('button');
                    (l.type = 'button'),
                      l.setAttribute('aria-label', 'Close'),
                      (l.className = 'toast-close'),
                      (l.innerHTML = '&#10006;'),
                      l.addEventListener(
                        'click',
                        function (E) {
                          E.stopPropagation(),
                            this.removeElement(this.toastElement),
                            window.clearTimeout(this.toastElement.timeOutValue);
                        }.bind(this)
                      );
                    var h =
                      window.innerWidth > 0 ? window.innerWidth : screen.width;
                    (this.options.position == 'left' ||
                      this.options.positionLeft === !0) &&
                    h > 360
                      ? r.insertAdjacentElement('afterbegin', l)
                      : r.appendChild(l);
                  }
                  if (this.options.stopOnFocus && this.options.duration > 0) {
                    var c = this;
                    r.addEventListener('mouseover', function (E) {
                      window.clearTimeout(r.timeOutValue);
                    }),
                      r.addEventListener('mouseleave', function () {
                        r.timeOutValue = window.setTimeout(function () {
                          c.removeElement(r);
                        }, c.options.duration);
                      });
                  }
                  if (
                    (typeof this.options.destination < 'u' &&
                      r.addEventListener(
                        'click',
                        function (E) {
                          E.stopPropagation(),
                            this.options.newWindow === !0
                              ? window.open(this.options.destination, '_blank')
                              : (window.location = this.options.destination);
                        }.bind(this)
                      ),
                    typeof this.options.onClick == 'function' &&
                      typeof this.options.destination > 'u' &&
                      r.addEventListener(
                        'click',
                        function (E) {
                          E.stopPropagation(), this.options.onClick();
                        }.bind(this)
                      ),
                    typeof this.options.offset == 'object')
                  ) {
                    var m = i('x', this.options),
                      _ = i('y', this.options),
                      I = this.options.position == 'left' ? m : '-' + m,
                      T = this.options.gravity == 'toastify-top' ? _ : '-' + _;
                    r.style.transform = 'translate(' + I + ',' + T + ')';
                  }
                  return r;
                },
                showToast: function () {
                  this.toastElement = this.buildToast();
                  var r;
                  if (
                    (typeof this.options.selector == 'string'
                      ? (r = document.getElementById(this.options.selector))
                      : this.options.selector instanceof HTMLElement ||
                          (typeof ShadowRoot < 'u' &&
                            this.options.selector instanceof ShadowRoot)
                        ? (r = this.options.selector)
                        : (r = document.body),
                    !r)
                  )
                    throw 'Root element is not defined';
                  var o = t.defaults.oldestFirst ? r.firstChild : r.lastChild;
                  return (
                    r.insertBefore(this.toastElement, o),
                    t.reposition(),
                    this.options.duration > 0 &&
                      (this.toastElement.timeOutValue = window.setTimeout(
                        function () {
                          this.removeElement(this.toastElement);
                        }.bind(this),
                        this.options.duration
                      )),
                    this
                  );
                },
                hideToast: function () {
                  this.toastElement.timeOutValue &&
                    clearTimeout(this.toastElement.timeOutValue),
                    this.removeElement(this.toastElement);
                },
                removeElement: function (r) {
                  (r.className = r.className.replace(' on', '')),
                    window.setTimeout(
                      function () {
                        this.options.node &&
                          this.options.node.parentNode &&
                          this.options.node.parentNode.removeChild(
                            this.options.node
                          ),
                          r.parentNode && r.parentNode.removeChild(r),
                          this.options.callback.call(r),
                          t.reposition();
                      }.bind(this),
                      400
                    );
                }
              }),
            (t.reposition = function () {
              for (
                var r = { top: 15, bottom: 15 },
                  o = { top: 15, bottom: 15 },
                  u = { top: 15, bottom: 15 },
                  l = document.getElementsByClassName('toastify'),
                  h,
                  c = 0;
                c < l.length;
                c++
              ) {
                n(l[c], 'toastify-top') === !0
                  ? (h = 'toastify-top')
                  : (h = 'toastify-bottom');
                var m = l[c].offsetHeight;
                h = h.substr(9, h.length - 1);
                var _ = 15,
                  I = window.innerWidth > 0 ? window.innerWidth : screen.width;
                I <= 360
                  ? ((l[c].style[h] = u[h] + 'px'), (u[h] += m + _))
                  : n(l[c], 'toastify-left') === !0
                    ? ((l[c].style[h] = r[h] + 'px'), (r[h] += m + _))
                    : ((l[c].style[h] = o[h] + 'px'), (o[h] += m + _));
              }
              return this;
            });
          function i(r, o) {
            return o.offset[r]
              ? isNaN(o.offset[r])
                ? o.offset[r]
                : o.offset[r] + 'px'
              : '0px';
          }
          function n(r, o) {
            return !r || typeof o != 'string'
              ? !1
              : !!(
                  r.className &&
                  r.className.trim().split(/\s+/gi).indexOf(o) > -1
                );
          }
          return (t.lib.init.prototype = t.lib), t;
        });
      })(N)),
    N.exports
  );
}
var He = Ue();
const ze = Ge(He),
  U = (a, e = 'success') => {
    ze({
      text: a,
      duration: 3e3,
      gravity: 'top',
      position: 'right',
      backgroundColor: e === 'success' ? 'green' : 'red'
    }).showToast();
  },
  Ke = new he('#contact-form');
Ke.addField('#name', [
  { rule: 'required', errorMessage: 'El nombre es obligatorio' },
  {
    rule: 'minLength',
    value: 3,
    errorMessage: 'El nombre debe tener al menos 3 caracteres'
  }
])
  .addField('#email', [
    { rule: 'required', errorMessage: 'El correo es obligatorio' },
    { rule: 'email', errorMessage: 'Debe ser un correo válido' }
  ])
  .addField('#phone', [
    { rule: 'required', errorMessage: 'El teléfono es obligatorio' },
    {
      rule: 'minLength',
      value: 14,
      errorMessage: 'El teléfono debe tener al menos 14 caracteres'
    }
  ])
  .addField('#message', [
    { rule: 'required', errorMessage: 'El mensaje es obligatorio' },
    {
      rule: 'minLength',
      value: 5,
      errorMessage: 'El mensaje debe tener al menos 5 caracteres'
    }
  ])
  .onSuccess((a) => {
    a.preventDefault();
    const e = a.target;
    setTimeout(() => {
      U('Formulario enviado correctamente!'), e.reset();
    }, 500);
  });
const Ye = new he('#appt-form');
Ye.addField('#appt-name', [
  { rule: 'required', errorMessage: 'El nombre es obligatorio' },
  {
    rule: 'minLength',
    value: 3,
    errorMessage: 'El nombre debe tener al menos 3 caracteres'
  }
])
  .addField('#appt-email', [
    { rule: 'required', errorMessage: 'El correo es obligatorio' },
    { rule: 'email', errorMessage: 'Debe ser un correo válido' }
  ])
  .addField('#appt-phone', [
    { rule: 'required', errorMessage: 'El teléfono es obligatorio' },
    {
      rule: 'minLength',
      value: 14,
      errorMessage: 'El teléfono debe tener al menos 14 caracteres'
    }
  ])
  .addField('#appt-message', [
    { rule: 'required', errorMessage: 'El mensaje es obligatorio' },
    {
      rule: 'minLength',
      value: 5,
      errorMessage: 'El mensaje debe tener al menos 5 caracteres'
    }
  ])
  .onSuccess((a) => {
    a.preventDefault();
    const e = a.target;
    setTimeout(() => {
      U('Solicitud enviada correctamente!'), e.reset();
    }, 500);
  });
const ee = document.querySelector('.phone');
ee && p(ee, { mask: '(000) 0000-0000' });
const Ze = new IntersectionObserver(
    (a) => {
      a.forEach((e) => {
        e.isIntersecting
          ? e.target.classList.add('visible')
          : e.target.classList.remove('visible');
      });
    },
    { threshold: 0.1 }
  ),
  We = document.querySelectorAll('.hidden-until-visible');
We.forEach((a) => Ze.observe(a));
const te = document.querySelector('.request-button');
te &&
  te.addEventListener('click', () => {
    U('Solicitud enviada');
  });
const se = document.getElementById('projects-request');
se &&
  se.addEventListener('click', () => {
    U('Ver más proyectos');
  });
