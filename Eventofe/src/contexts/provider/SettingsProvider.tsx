import { ReactNode, useMemo, useReducer } from 'react';
import { SettingsContext } from '../context/SettingsContext';

interface SetThemeAction {
  type: 'SET_THEME';
  payload: string;
}

const settingReducer = (state: any, action: SetThemeAction) => {
  switch (action.type) {
    case 'SET_THEME':
      return action.payload;
    default:
      return state;
  }
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({
  children,
}: SettingsProviderProps): JSX.Element => {
  const [theme, dispatch] = useReducer(settingReducer, 'dark');
  const value = useMemo(() => ({ theme, dispatch }), [theme]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
