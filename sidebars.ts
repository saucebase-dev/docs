import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Main documentation sidebar
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      customProps: {
        icon: 'lucide:rocket',
      },
      items: [
        {
          type: 'doc',
          id: 'index',
          label: 'What is Saucebase',
          customProps: {
            icon: 'lucide:home',
          },
        },
        {
          type: 'doc',
          id: 'getting-started/installation',
          label: 'Installation',
          customProps: {
            icon: 'lucide:download',
          },
        },
        {
          type: 'doc',
          id: 'getting-started/configuration',
          label: 'Configuration',
          customProps: {
            icon: 'lucide:settings',
          },
        },
        {
          type: 'doc',
          id: 'getting-started/directory-structure',
          label: 'Directory Structure',
          customProps: {
            icon: 'lucide:folder-tree',
          },
        },
        {
          type: 'category',
          label: 'Modules',
          collapsed: false,
          customProps: { icon: 'lucide:package' },
          items: [
            { type: 'doc', id: 'modules/index', label: 'Overview', customProps: { icon: 'lucide:layout-grid' } },
            { type: 'doc', id: 'modules/auth', label: 'Auth', customProps: { icon: 'lucide:lock' } },
            { type: 'doc', id: 'modules/settings', label: 'Settings', customProps: { icon: 'lucide:settings-2' } },
            { type: 'doc', id: 'modules/billing', label: 'Billing', customProps: { icon: 'lucide:credit-card' } },
            { type: 'doc', id: 'modules/announcements', label: 'Announcements', customProps: { icon: 'lucide:megaphone' } },
            { type: 'doc', id: 'modules/roadmap', label: 'Roadmap', customProps: { icon: 'lucide:map' } },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Features',
      collapsed: true,
      customProps: {
        icon: 'lucide:puzzle',
      },
      items: [
        {
          type: 'doc',
          id: 'fundamentals/modules',
          label: 'Module Management',
          customProps: {
            icon: 'lucide:package',
          },
        },
        {
          type: 'doc',
          id: 'fundamentals/dialogs',
          label: 'Dialogs',
          customProps: {
            icon: 'lucide:alert-circle',
          },
        },
        {
          type: 'doc',
          id: 'fundamentals/ssr',
          label: 'SSR',
          customProps: {
            icon: 'lucide:server',
          },
        },
        {
          type: 'doc',
          id: 'fundamentals/routing',
          label: 'Routing',
          customProps: {
            icon: 'lucide:route',
          },
        },
        {
          type: 'doc',
          id: 'fundamentals/navigation',
          label: 'Navigation',
          customProps: {
            icon: 'lucide:compass',
          },
        },
        {
          type: 'doc',
          id: 'fundamentals/breadcrumbs',
          label: 'Breadcrumbs',
          customProps: {
            icon: 'lucide:chevrons-right',
          },
        },
        {
          type: 'doc',
          id: 'fundamentals/theme-mode',
          label: 'Theme Mode',
          customProps: {
            icon: 'lucide:sun-moon',
          },
        },
        {
          type: 'doc',
          id: 'fundamentals/translations',
          label: 'Translations',
          customProps: {
            icon: 'lucide:languages',
          },
        },
        {
          type: 'doc',
          id: 'fundamentals/impersonation',
          label: 'Impersonation',
          customProps: {
            icon: 'lucide:user-cog',
          },
        },
        // 'fundamentals/authentication',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      collapsed: true,
      customProps: {
        icon: 'lucide:layers',
      },
      items: [
        {
          type: 'doc',
          id: 'architecture/philosophy',
          label: 'Philosophy',
          customProps: {
            icon: 'lucide:lightbulb',
          },
        },
        {
          type: 'doc',
          id: 'architecture/module-system',
          label: 'Module System',
          customProps: {
            icon: 'lucide:boxes',
          },
        },
        {
          type: 'doc',
          id: 'architecture/overview',
          label: 'Overview',
          customProps: {
            icon: 'lucide:eye',
          },
        },
        {
          type: 'doc',
          id: 'architecture/frontend',
          label: 'Frontend',
          customProps: {
            icon: 'lucide:monitor',
          },
        },
        {
          type: 'doc',
          id: 'architecture/backend',
          label: 'Backend',
          customProps: {
            icon: 'lucide:server-cog',
          },
        },
        // 'architecture/asset-pipeline',
        // 'architecture/testing',
      ],
    },
    {
      type: 'category',
      label: 'Development',
      collapsed: true,
      customProps: {
        icon: 'lucide:code-2',
      },
      items: [
        {
          type: 'doc',
          id: 'development/commands',
          label: 'Commands',
          customProps: {
            icon: 'lucide:terminal',
          },
        },
        {
          type: 'doc',
          id: 'development/taskfile',
          label: 'Taskfile',
          customProps: {
            icon: 'lucide:zap',
          },
        },
        {
          type: 'doc',
          id: 'development/git-workflow',
          label: 'Git Workflow',
          customProps: {
            icon: 'lucide:git-branch',
          },
        },
        {
          type: 'doc',
          id: 'development/testing-guide',
          label: 'Testing Guide',
          customProps: {
            icon: 'lucide:flask-conical',
          },
        },
        // 'development/debugging',
      ],
    },
    // {
    //   type: 'category',
    //   label: 'Advanced',
    //   collapsed: true,
    //   items: [
    //     'advanced/creating-modules',
    //     'advanced/multi-tenancy',
    //     'advanced/performance',
    //     'advanced/security',
    //     'advanced/deployment',
    //   ],
    // },
    {
      type: 'category',
      label: 'Guidelines',
      collapsed: true,
      customProps: { icon: 'lucide:book-check' },
      items: [
        { type: 'doc', id: 'guidelines/index', label: 'Overview', customProps: { icon: 'lucide:layout-grid' } },
        { type: 'doc', id: 'guidelines/laravel', label: 'Laravel', customProps: { icon: 'lucide:server' } },
        { type: 'doc', id: 'guidelines/javascript', label: 'JavaScript', customProps: { icon: 'lucide:code-2' } },
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: true,
      customProps: {
        icon: 'lucide:book-open',
      },
      items: [
        {
          type: 'doc',
          id: 'reference/troubleshooting',
          label: 'Troubleshooting',
          customProps: {
            icon: 'lucide:wrench',
          },
        },
        {
          type: 'doc',
          id: 'reference/glossary',
          label: 'Glossary',
          customProps: {
            icon: 'lucide:book-text',
          },
        },
        // 'reference/environment-variables',
        // 'reference/artisan-commands',
        // 'reference/npm-scripts',
        // 'reference/docker-services',
      ],
    },
  ],
};

export default sidebars;
