"use client";

import { Loader2 } from "lucide-react";

interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  args: any;
  state: string;
  result?: any;
}

interface ToolInvocationDisplayProps {
  toolInvocation: ToolInvocation;
}

export function ToolInvocationDisplay({ toolInvocation }: ToolInvocationDisplayProps) {
  const { toolName, args, state, result } = toolInvocation;

  const getUserFriendlyMessage = (): string => {
    try {
      const parsedArgs = typeof args === 'string' ? JSON.parse(args) : args;
      const { command, path, new_path } = parsedArgs;
      
      // Extract filename from path
      const getFilename = (filePath: string): string => {
        if (!filePath) return 'file';
        return filePath.split('/').pop() || filePath;
      };

      if (toolName === 'str_replace_editor') {
        const filename = getFilename(path);
        
        switch (command) {
          case 'create':
            return `Creating ${filename}`;
          case 'str_replace':
            return `Editing ${filename}`;
          case 'insert':
            return `Updating ${filename}`;
          case 'view':
            return `Reading ${filename}`;
          default:
            return `Working on ${filename}`;
        }
      }

      if (toolName === 'file_manager') {
        const filename = getFilename(path);
        
        switch (command) {
          case 'rename':
            const newFilename = getFilename(new_path);
            return `Renaming ${filename} to ${newFilename}`;
          case 'delete':
            return `Deleting ${filename}`;
          default:
            return `Managing ${filename}`;
        }
      }

      // Fallback for unknown tools
      return `Using ${toolName}`;
    } catch (error) {
      // If we can't parse args, fall back to tool name
      return `Using ${toolName}`;
    }
  };

  const isCompleted = state === "result" && result;
  const isInProgress = state !== "result" || !result;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isCompleted ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-neutral-700 font-medium">{getUserFriendlyMessage()}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700 font-medium">{getUserFriendlyMessage()}...</span>
        </>
      )}
    </div>
  );
}