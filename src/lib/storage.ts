export const loadLocalState = <T>(key: string): T | undefined => {
  try {
    const serializedState = localStorage.getItem(key);

    if (!serializedState) {
      return undefined;
    }

    return JSON.parse(serializedState) as T;
  } catch (err) {
    console.error('storage -> loadLocalState: ', err);
    return undefined;
  }
};

export const saveLocalState = <T>(key: string, state: T) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (err) {
    console.error('storage -> saveLocalState: ', err);
  }
};
