import { PaletteMode } from '@mui/material';
import { createContext } from 'react';

interface SettingsContextInterface {
  theme: PaletteMode | undefined;
  dispatch: React.Dispatch<any>;
}

export const SettingsContext = createContext<SettingsContextInterface>({
  theme: 'dark',
  dispatch: () => null,
});
