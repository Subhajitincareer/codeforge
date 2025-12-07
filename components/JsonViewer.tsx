import React, { useMemo } from 'react';

interface JsonViewerProps {
  data: string | null;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  
  const formattedHtml = useMemo(() => {
    if (!data) return null;
    try {
      const jsonObj = JSON.parse(data);
      const jsonStr = JSON.stringify(jsonObj, null, 2);
      
      // Basic syntax highlighting via regex replacement
      // This is a lightweight alternative to importing heavy syntax highlighter libs
      const html = jsonStr.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        (match) => {
          let cls = 'text-amber-600'; // number
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'text-sky-400'; // key
            } else {
              cls = 'text-emerald-400'; // string
            }
          } else if (/true|false/.test(match)) {
            cls = 'text-purple-400'; // boolean
          } else if (/null/.test(match)) {
            cls = 'text-slate-500'; // null
          }
          return `<span class="${cls}">${match}</span>`;
        }
      );
      return html;
    } catch (e) {
      return data; // Return raw string if parse fails
    }
  }, [data]);

  if (!data) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-slate-500 space-y-4 select-none">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center border border-slate-700/50">
           <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
           </svg>
        </div>
        <p className="text-sm font-medium">Generated output will appear here</p>
      </div>
    );
  }

  return (
    <pre 
      className="font-mono text-sm leading-6 overflow-auto custom-scrollbar w-full h-full p-6 text-slate-300"
      dangerouslySetInnerHTML={{ __html: formattedHtml || '' }} 
    />
  );
};