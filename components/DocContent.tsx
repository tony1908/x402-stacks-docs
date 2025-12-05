import React from 'react';
import ReactMarkdown from 'react-markdown';
import { CopyBlock, dracula } from 'react-code-blocks';
import { DocPage } from '../types';

interface DocContentProps {
  page: DocPage;
}

export const DocContent: React.FC<DocContentProps> = ({ page }) => {
  return (
    <main className="flex-1 min-w-0 py-8 px-4 sm:px-8 lg:px-12 xl:px-16">
       <div className="max-w-4xl mx-auto">
         <div className="mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">Docs</p>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">{page.title}</h1>
         </div>

         <div className="markdown-body">
           <ReactMarkdown
             components={{
               code({ className, children, ...props }) {
                 const match = /language-(\w+)/.exec(className || '');
                 const codeString = String(children).replace(/\n$/, '');

                 if (match) {
                   return (
                     <CopyBlock
                       text={codeString}
                       language={match[1]}
                       showLineNumbers={true}
                       theme={dracula}
                       codeBlock
                     />
                   );
                 }

                 return (
                   <code className={className} {...props}>
                     {children}
                   </code>
                 );
               }
             }}
           >
             {page.content}
           </ReactMarkdown>
         </div>

         <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>Last updated: October 24, 2023</span>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Edit this page on GitHub</a>
         </div>
       </div>
    </main>
  );
};