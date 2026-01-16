export const loadLocalState = <T>(key: string): T | undefined => {
  try {
    const serializedState = localStorage.getItem(key);

    if (!serializedState) {
      return undefined;
    }

    return JSON.parse(serializedState) as T;
  } catch (err) {
    console.error('解析 loadLocalState 失败: ', err);
    return undefined;
  }
};

export const saveLocalState = <T>(key: string, state: T) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (err) {
    console.error('保存 saveLocalState 失败: ', err);
  }
};
