import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Shiki theme mapped to the design tokens (see artifacts/README.md):
// keywords cool, strings/values warm, function names text, comments text-3 italic.
const dbtlrTheme = {
  name: 'dbtlr',
  type: 'dark',
  colors: {
    'editor.background': '#15181e',
    'editor.foreground': '#9aa3b2',
  },
  tokenColors: [
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: '#68707f', fontStyle: 'italic' },
    },
    {
      scope: [
        'keyword',
        'keyword.control',
        'keyword.operator.new',
        'keyword.operator.expression',
        'storage.type',
        'storage.modifier',
      ],
      settings: { foreground: '#3fa7e8' },
    },
    {
      scope: [
        'string',
        'constant.numeric',
        'constant.language',
        'constant.character',
        'support.constant',
      ],
      settings: { foreground: '#e8743f' },
    },
    {
      scope: [
        'entity.name.function',
        'support.function',
        'entity.name.tag.yaml',
        'entity.name.command.shell',
      ],
      settings: { foreground: '#e7eaf0' },
    },
  ],
};

const LANG_LABELS = {
  ts: 'TypeScript',
  js: 'JavaScript',
  yaml: 'YAML',
  sh: 'shell',
  bash: 'shell',
  shell: 'shell',
};

// Wraps every fenced code block in the design's chrome:
// <figure class="code"><div class="code-bar">file · lang · copy</div><pre>…</pre></figure>
// The filename comes from the fence meta: ```ts title="retry.ts"
function codeChrome() {
  return {
    name: 'dbtlr-code-chrome',
    root(root) {
      const meta = this.options.meta?.__raw ?? '';
      const title = meta.match(/title="([^"]*)"/)?.[1];
      const lang = this.options.lang ?? '';
      const label = LANG_LABELS[lang] ?? lang;

      const text = (value) => ({ type: 'text', value });
      const el = (tagName, properties, children) => ({ type: 'element', tagName, properties, children });

      const bar = el('div', { className: ['code-bar'] }, [
        ...(title ? [el('span', { className: ['code-file'] }, [text(title)])] : []),
        el('span', { className: ['code-lang'] }, [text(label)]),
        el('button', { className: ['code-copy'], type: 'button' }, [text('Copy')]),
      ]);

      root.children = [el('figure', { className: ['code'] }, [bar, ...root.children])];
    },
  };
}

export default defineConfig({
  site: 'https://dbtlr.com',
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: dbtlrTheme,
      transformers: [codeChrome()],
    },
  },
});
