// sessions/sessionManager.ts
export interface Session<T> {
    step: number;
    data: T;
  }
  
  const sessions = new Map<number, Session<any>>();
  
  export function startSession<T>(chatId: number, initialData: T = {} as T) {
    sessions.set(chatId, { step: 1, data: initialData });
  }
  
  export function getSession<T>(chatId: number): Session<T> | undefined {
    return sessions.get(chatId);
  }
  
  export function updateSession<T>(chatId: number, newData: Partial<T>) {
    const session = sessions.get(chatId);
    if (session) {
      session.data = { ...session.data, ...newData };
      sessions.set(chatId, session);
    }
  }
  
  export function nextStep(chatId: number) {
    const session = sessions.get(chatId);
    if (session) {
      session.step += 1;
      sessions.set(chatId, session);
    }
  }
  
  export function endSession(chatId: number) {
    sessions.delete(chatId);
  }
  