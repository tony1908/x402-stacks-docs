import { DocPage, NavItem } from './types';

export const DOC_NAME = "Nebula UI";

export const MOCK_DOCS: DocPage[] = [
  {
    id: 'intro',
    title: 'Introduction',
    slug: 'introduction',
    content: `# Introduction to Nebula UI

Welcome to **Nebula UI**, a modular and accessible component library for the modern web. 

Nebula UI is designed to be:
- **Fast**: Zero-runtime CSS extraction.
- **Accessible**: WAI-ARIA compliant out of the box.
- **Customizable**: Built on top of a powerful theming engine.

## Getting Started

To install Nebula UI, run the following command in your terminal:

\`\`\`bash
npm install @nebula-ui/core
\`\`\`

## Why Nebula?

We built Nebula because we were tired of wrestling with complex configurations. 

> "Simplicity is the ultimate sophistication." 
> — Leonardo da Vinci

Start building your next big idea with Nebula today.`
  },
  {
    id: 'installation',
    title: 'Installation',
    slug: 'getting-started/installation',
    content: `# Installation

Installing Nebula UI is straightforward. We support all modern package managers.

### NPM
\`\`\`bash
npm install @nebula-ui/core
\`\`\`

### Yarn
\`\`\`bash
yarn add @nebula-ui/core
\`\`\`

### PNPM
\`\`\`bash
pnpm add @nebula-ui/core
\`\`\`

## Peer Dependencies

Ensure you have React 18+ installed.

\`\`\`json
"peerDependencies": {
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0"
}
\`\`\`
`
  },
  {
    id: 'buttons',
    title: 'Button',
    slug: 'components/button',
    content: `# Button Component

The \`Button\` component is used to trigger an action or event, such as submitting a form, opening a dialog, or canceling an action.

## Usage

\`\`\`jsx
import { Button } from '@nebula-ui/core';

function App() {
  return (
    <Button variant="primary" onClick={() => alert('Clicked!')}>
      Click me
    </Button>
  );
}
\`\`\`

## Variants

- **Primary**: Used for the main action.
- **Secondary**: Used for alternative actions.
- **Ghost**: Used for less prominent actions.
- **Destructive**: Used for dangerous actions like deletion.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \| 'secondary' \| 'ghost' | 'primary' | The visual style of the button |
| size | 'sm' \| 'md' \| 'lg' | 'md' | The size of the button |
| disabled | boolean | false | Whether the button is disabled |
`
  },
  {
    id: 'cards',
    title: 'Card',
    slug: 'components/card',
    content: `# Card Component

Cards are flexible containers used to group related content and actions.

## Usage

\`\`\`jsx
import { Card, CardHeader, CardBody, CardFooter } from '@nebula-ui/core';

<Card>
  <CardHeader>Account Info</CardHeader>
  <CardBody>
    <p>View and manage your account details here.</p>
  </CardBody>
  <CardFooter>
    <Button>Save Changes</Button>
  </CardFooter>
</Card>
\`\`\`

### Best Practices

1. Use cards to display content composed of different elements.
2. Don't use too many cards on a single page as it can clutter the UI.
`
  },
  {
    id: 'theming',
    title: 'Theming',
    slug: 'advanced/theming',
    content: `# Theming

Nebula UI has a powerful theming engine powered by CSS variables.

## Customizing Colors

You can override the default color palette by wrapping your application in the \`NebulaProvider\`.

\`\`\`jsx
const theme = {
  colors: {
    primary: '#6366f1',
    secondary: '#a855f7',
  }
};

<NebulaProvider theme={theme}>
  <App />
</NebulaProvider>
\`\`\`

## Dark Mode

Dark mode is supported out of the box. Simply toggle the \`dark\` class on your \`html\` element.
`
  }
];

export const NAV_STRUCTURE: NavItem[] = [
  {
    id: 'group-1',
    title: 'Getting Started',
    children: [
      { id: 'intro', title: 'Introduction', slug: 'introduction' },
      { id: 'installation', title: 'Installation', slug: 'getting-started/installation' },
    ]
  },
  {
    id: 'group-2',
    title: 'Components',
    children: [
      { id: 'buttons', title: 'Button', slug: 'components/button' },
      { id: 'cards', title: 'Card', slug: 'components/card' },
    ]
  },
  {
    id: 'group-3',
    title: 'Advanced',
    children: [
      { id: 'theming', title: 'Theming', slug: 'advanced/theming' },
    ]
  }
];
