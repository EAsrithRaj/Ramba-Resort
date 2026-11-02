import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const script = await readFile(new URL('../script.js', import.meta.url), 'utf8');

// Minimal event/DOM fixture: executes the real browser script without a browser
// or network. It verifies logic only, not native form validation or rendering.
function fixture(systemReduced = false) {
  let focused;
  const downloads = [];
  const blobs = [];
  let observers = 0;
  class Element {
    constructor() {
      this.listeners = {}; this.attributes = {}; this.value = ''; this.textContent = '';
      this.hidden = false; this.dataset = {}; this.validity = {typeMismatch:false};
      this.classes = new Set();
      this.classList = {
        add: value => this.classes.add(value),
        contains: value => this.classes.has(value),
        toggle: (value,on) => on ? this.classes.add(value) : this.classes.delete(value)
      };
    }
    addEventListener(name, listener) { (this.listeners[name] ||= []).push(listener); }
    emit(name, event = {}) { for (const listener of this.listeners[name] || []) listener({preventDefault(){}, ...event}); }
    setAttribute(key,value) { this.attributes[key] = value; }
    getAttribute(key) { return this.attributes[key]; }
    focus() { focused = this; }
  }
  const elements = new Map();
  const element = selector => {
    if (!elements.has(selector)) elements.set(selector,new Element());
    return elements.get(selector);
  };
  const fields = ['name','email','message'].map(name => {
    const field = element(`#${name}`); field.name = name; field.id = name; return field;
  });
  const form = element('[data-enquiry]');
  form.querySelectorAll = () => fields;
  const preview = element('[data-draft]'); preview.hidden = true;
  const root = new Element();
  const document = {
    documentElement:root,
    querySelector(selector) {
      if (['.site-header','.nav','.menu-toggle','[data-portal]','.hero'].includes(selector)) return null;
      return element(selector);
    },
    querySelectorAll() { return []; },
    addEventListener() {},
    createElement() { return {click(){ downloads.push({href:this.href,filename:this.download}); }}; }
  };
  const mediaQuery = { matches:systemReduced,addEventListener(){} };
  const window = { matchMedia:query => query.includes('reduced-motion') ? mediaQuery : {matches:false,addEventListener(){}}, addEventListener(){},scrollY:0,IntersectionObserver:true };
  const context = {
    document,window,
    IntersectionObserver:class { constructor(){observers++;} observe(){} },
    FormData:class { get(key){ return fields.find(field=>field.name===key)?.value || 'The retreat'; } },
    Blob,
    URL:{createObjectURL(blob){blobs.push(blob);return 'blob:local-draft';},revokeObjectURL(){}},
    setTimeout(callback){callback();},requestAnimationFrame(callback){callback();}
  };
  runInNewContext(script,context,{timeout:1000});
  const fill = (name,value) => {element(`#${name}`).value=value;};
  const valid = () => {fill('name','RAMBA QA');fill('email','qa@example.com');fill('message','A future stay.');};
  return {form,element,fill,valid,preview,root,downloads,blobs,get focused(){return focused;},get observers(){return observers;}};
}

test('enquiry logic rejects blank/whitespace fields and focuses first error', () => {
  const f = fixture();
  f.fill('name','  '); f.form.emit('submit');
  assert.equal(f.focused.id,'name');
  assert.equal(f.element('#name').getAttribute('aria-invalid'),'true');
  assert.equal(f.element('#message-error').textContent,'Please add a note.');
  assert.equal(f.preview.hidden,true);
});

test('enquiry logic handles native email typeMismatch result', () => {
  const f = fixture(); f.valid();
  f.element('#email').validity.typeMismatch = true;
  f.form.emit('submit');
  assert.equal(f.focused.id,'email');
  assert.match(f.element('#email-error').textContent,/valid email/);
  assert.equal(f.preview.hidden,true);
});

test('draft safely preserves literal user text and encodes the unchanged mail link', () => {
  const f = fixture(); f.valid();
  const text = '<script>alert("test")</script> & ?subject=other\nSecond line';
  f.fill('message',text); f.form.emit('submit');
  assert.equal(f.preview.hidden,false);
  assert.ok(f.element('#draft-text').value.includes(text));
  const mail = f.element('[data-mail-link]').href;
  assert.ok(mail.startsWith('mailto:stay@ramba.example?'));
  assert.ok(new URL(mail).searchParams.get('body').includes(text));
  assert.match(f.element('#form-status').textContent,/Nothing has been sent/);
});

test('editing invalidates a prepared draft and requires preparing it again', () => {
  const f = fixture(); f.valid(); f.form.emit('submit');
  f.fill('message','Updated note'); f.form.emit('input');
  assert.equal(f.preview.hidden,true);
  f.element('[data-save-draft]').emit('click');
  assert.equal(f.downloads.length,0);
  f.form.emit('submit');
  assert.ok(f.element('#draft-text').value.includes('Updated note'));
});

test('saving a draft creates the expected text Blob and download filename', async () => {
  const f = fixture(); f.valid(); f.form.emit('submit');
  f.element('[data-save-draft]').emit('click');
  assert.equal(f.downloads[0].filename,'RAMBA-enquiry-draft.txt');
  assert.equal(await f.blobs[0].text(),f.element('#draft-text').value);
  assert.match(f.blobs[0].type,/text\/plain/);
});

test('system reduced motion disables observer motion and cannot be overridden', () => {
  const f = fixture(true);
  assert.equal(f.root.dataset.motion,'reduce');
  assert.equal(f.observers,0);
  assert.equal(f.element('[data-motion-toggle]').disabled,true);
});
