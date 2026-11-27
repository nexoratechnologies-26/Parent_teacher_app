export interface ServerStatusSnapshot {
  isDown: boolean;
  message: string;
  isChecking: boolean;
}

type Listener = (snapshot: ServerStatusSnapshot) => void;
type Probe = () => Promise<boolean>;

const listeners = new Set<Listener>();
let probe: Probe | undefined;
let snapshot: ServerStatusSnapshot = {
  isDown: false,
  message: '',
  isChecking: false,
};

function publish(next: ServerStatusSnapshot) {
  snapshot = next;
  listeners.forEach((listener) => listener(snapshot));
}

export function getServerStatus(): ServerStatusSnapshot {
  return snapshot;
}

export function subscribeToServerStatus(listener: Listener): () => void {
  listeners.add(listener);
  listener(snapshot);
  return () => listeners.delete(listener);
}

export function reportServerDown(message = 'We can’t reach the server right now.', retryProbe?: Probe) {
  if (retryProbe) probe = retryProbe;
  publish({ isDown: true, message, isChecking: false });
}

export function reportServerAvailable() {
  probe = undefined;
  if (snapshot.isDown || snapshot.isChecking) {
    publish({ isDown: false, message: '', isChecking: false });
  }
}

export function isConnectivityError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as { name?: string; message?: string; status?: number; statusCode?: number };
  const status = candidate.status ?? candidate.statusCode;
  if (typeof status === 'number' && status > 0) return status >= 500;
  const details = `${candidate.name ?? ''} ${candidate.message ?? ''}`.toLowerCase();
  return (
    candidate.name === 'AuthRetryableFetchError' ||
    error instanceof TypeError ||
    /network|fetch failed|failed to fetch|load failed|offline|timed? ?out|connection refused|socket hang up|econn|dns|unreachable/.test(details)
  );
}

export function reportConnectivityError(error: unknown, retryProbe?: Probe) {
  if (isConnectivityError(error)) {
    reportServerDown('The server is unavailable. Check your connection and try again.', retryProbe);
  }
}

export async function retryServerConnection(): Promise<boolean> {
  if (!probe) return false;
  publish({ ...snapshot, isChecking: true });
  try {
    const available = await probe();
    if (available) reportServerAvailable();
    else publish({ ...snapshot, isDown: true, isChecking: false });
    return available;
  } catch {
    publish({ ...snapshot, isDown: true, isChecking: false });
    return false;
  }
}

export async function fetchWithServerStatus(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const probeUrl = String(input);
  const probeConnection: Probe = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(probeUrl, { method: 'GET', cache: 'no-store', signal: controller.signal });
      return response.status < 500;
    } finally {
      clearTimeout(timeout);
    }
  };

  const controller = new AbortController();
  let timedOut = false;
  const timeout = init?.signal
    ? undefined
    : setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, 15000);
  try {
    const response = await fetch(input, { ...init, signal: init?.signal ?? controller.signal });
    if (response.status >= 500) {
      reportServerDown('The server is having trouble. Please try again shortly.', probeConnection);
    } else {
      reportServerAvailable();
    }
    return response;
  } catch (error) {
    if (timedOut) {
      reportServerDown('The server took too long to respond. Please try again.', probeConnection);
    } else {
      reportConnectivityError(error, probeConnection);
    }
    throw error;
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
