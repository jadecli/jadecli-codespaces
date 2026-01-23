// ---
// entity_id: module-python-bridge
// entity_name: Python Bridge
// entity_type_id: module
// entity_path: entity_cli/bridge/python_bridge.ts
// entity_language: typescript
// entity_state: active
// entity_created: 2026-01-22T16:00:00Z
// entity_exports: [callPython, PythonBridge]
// entity_dependencies: []
// ---

/**
 * Bridge for calling Python entity store from TypeScript.
 *
 * Provides:
 * - JSON-RPC communication with Python backend
 * - Type-safe method calls
 * - Error handling
 * - Connection management
 */

import { spawn, ChildProcess } from 'child_process';

interface PythonRequest {
  method: string;
  params: Record<string, unknown>;
  id: number;
}

interface PythonResponse<T> {
  result?: T;
  error?: {
    code: number;
    message: string;
  };
  id: number;
}

let pythonProcess: ChildProcess | null = null;
let requestId = 0;
const pendingRequests = new Map<
  number,
  { resolve: (value: unknown) => void; reject: (reason: unknown) => void }
>();

/**
 * Initialize Python bridge.
 */
export async function initPythonBridge(): Promise<void> {
  if (pythonProcess) {
    return;
  }

  pythonProcess = spawn('python', ['-m', 'entity_store.bridge'], {
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  pythonProcess.stdout?.on('data', (data: Buffer) => {
    const lines = data.toString().split('\n').filter(Boolean);
    for (const line of lines) {
      try {
        const response = JSON.parse(line) as PythonResponse<unknown>;
        const pending = pendingRequests.get(response.id);
        if (pending) {
          if (response.error) {
            pending.reject(new Error(response.error.message));
          } else {
            pending.resolve(response.result);
          }
          pendingRequests.delete(response.id);
        }
      } catch {
        // Ignore non-JSON output
      }
    }
  });

  pythonProcess.stderr?.on('data', (data: Buffer) => {
    console.error('Python error:', data.toString());
  });

  pythonProcess.on('exit', (code) => {
    pythonProcess = null;
    // Reject all pending requests
    for (const [id, pending] of pendingRequests) {
      pending.reject(new Error(`Python process exited with code ${code}`));
      pendingRequests.delete(id);
    }
  });
}

/**
 * Call a Python method.
 *
 * @param method - Method name to call
 * @param params - Parameters to pass
 * @returns Promise resolving to the result
 */
export async function callPython<T>(
  method: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  if (!pythonProcess) {
    await initPythonBridge();
  }

  if (!pythonProcess?.stdin) {
    throw new Error('Python bridge not initialized');
  }

  const id = ++requestId;
  const request: PythonRequest = { method, params, id };

  return new Promise((resolve, reject) => {
    pendingRequests.set(id, {
      resolve: resolve as (value: unknown) => void,
      reject,
    });

    pythonProcess!.stdin!.write(JSON.stringify(request) + '\n');

    // Timeout after 30 seconds
    setTimeout(() => {
      if (pendingRequests.has(id)) {
        pendingRequests.delete(id);
        reject(new Error('Request timeout'));
      }
    }, 30000);
  });
}

/**
 * Close Python bridge.
 */
export function closePythonBridge(): void {
  if (pythonProcess) {
    pythonProcess.kill();
    pythonProcess = null;
  }
}

/**
 * Python Bridge class for object-oriented usage.
 */
export class PythonBridge {
  private initialized = false;

  async init(): Promise<void> {
    if (!this.initialized) {
      await initPythonBridge();
      this.initialized = true;
    }
  }

  async call<T>(method: string, params: Record<string, unknown> = {}): Promise<T> {
    await this.init();
    return callPython<T>(method, params);
  }

  close(): void {
    closePythonBridge();
    this.initialized = false;
  }
}
