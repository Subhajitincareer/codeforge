import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Terminal, 
  Play, 
  Copy, 
  Download, 
  Trash2, 
  Wand2, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { Button } from './components/Button';
import { JsonViewer } from './components/JsonViewer';
import { PRESETS, CATEGORY_ICONS } from './constants';
import { generateJsonData } from './services/gemini';
import { GeneratorStatus } from './types';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [output, setOutput] = useState<string | null>(null);
  const [status, setStatus] = useState<GeneratorStatus>(GeneratorStatus.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [prompt]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;

    setStatus(GeneratorStatus.GENERATING);
    setErrorMessage(null);
    setOutput(null);

    try {
      const result = await generateJsonData(prompt);
      setOutput(result);
      setStatus(GeneratorStatus.SUCCESS);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || 'Failed to generate data. Please try again.');
      setStatus(GeneratorStatus.ERROR);
    }
  }, [prompt]);

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mockforge-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [output]);

  const handlePresetSelect = (presetPrompt: string) => {
    setPrompt(presetPrompt);
    // Focus textarea
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleClear = () => {
    setPrompt('');
    setOutput(null);
    setStatus(GeneratorStatus.IDLE);
  };

  return (
    <div className="min-h-screen bg-background text-slate-200 flex flex-col font-sans selection:bg-primary/30">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Terminal className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                MockForge
              </h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide">AI BACKEND DATA GENERATOR</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
             <div className="hidden md:flex items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
               <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
               <span className="text-xs text-emerald-400 font-medium">System Ready</span>
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-8rem)] min-h-[600px]">
          
          {/* Left Column: Input & Controls */}
          <div className="flex flex-col space-y-6 overflow-y-auto custom-scrollbar pr-2">
            
            {/* Prompt Input */}
            <div className="bg-surface rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden flex flex-col flex-shrink-0">
              <div className="p-4 border-b border-slate-700/50 bg-slate-800/50 flex justify-between items-center">
                <label htmlFor="prompt" className="text-sm font-semibold text-slate-300 flex items-center">
                  <Wand2 className="w-4 h-4 mr-2 text-accent" />
                  Prompt
                </label>
                {prompt && (
                  <button onClick={handleClear} className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center">
                    <Trash2 className="w-3 h-3 mr-1" /> Clear
                  </button>
                )}
              </div>
              <div className="relative group">
                <textarea
                  id="prompt"
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the JSON data you need... (e.g., 'A list of 5 users with nested order history and payment methods')"
                  className="w-full bg-transparent text-slate-200 placeholder-slate-600 p-4 text-sm font-mono focus:outline-none resize-none min-h-[120px]"
                  spellCheck={false}
                />
              </div>
              <div className="p-4 bg-slate-900/30 border-t border-slate-700/50 flex justify-end">
                <Button 
                  onClick={handleGenerate} 
                  isLoading={status === GeneratorStatus.GENERATING}
                  disabled={!prompt.trim()}
                  icon={<Play className="w-4 h-4 fill-current" />}
                >
                  Generate JSON
                </Button>
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Quick Start Presets</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESETS.map((preset) => {
                  const Icon = CATEGORY_ICONS[preset.category];
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetSelect(preset.prompt)}
                      className="text-left p-3 rounded-xl bg-surface border border-slate-700/50 hover:border-accent/50 hover:bg-slate-700/50 transition-all duration-200 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:text-accent transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{preset.name}</p>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1">{preset.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {status === GeneratorStatus.ERROR && errorMessage && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-400">Generation Failed</h4>
                  <p className="text-xs text-red-300/70 mt-1">{errorMessage}</p>
                </div>
              </div>
            )}
            
            <div className="mt-auto pt-6 text-center text-xs text-slate-600">
               Powered by Gemini 2.5 Flash • Secure & Fast
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="flex flex-col h-full bg-surface rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden relative">
            <div className="p-3 border-b border-slate-700/50 bg-slate-800/50 flex justify-between items-center h-14">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1.5 px-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                </div>
                <span className="text-xs font-mono text-slate-400 ml-2">output.json</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="secondary" 
                  onClick={handleCopy} 
                  disabled={!output}
                  className="!px-3 !py-1.5 text-xs h-8"
                  icon={copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                >
                  {copied ? 'Copied' : 'Copy'}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={handleDownload} 
                  disabled={!output}
                  className="!px-3 !py-1.5 text-xs h-8"
                  icon={<Download className="w-3 h-3" />}
                >
                  Save
                </Button>
              </div>
            </div>

            <div className="flex-1 relative overflow-hidden bg-[#0d1117]">
               {status === GeneratorStatus.GENERATING && (
                 <div className="absolute inset-0 z-10 bg-slate-900/50 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-slate-700 border-t-primary rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Wand2 className="w-6 h-6 text-primary animate-pulse" />
                      </div>
                    </div>
                    <p className="mt-4 text-sm font-medium text-slate-300 animate-pulse">Forging data...</p>
                 </div>
               )}
               <JsonViewer data={output} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;