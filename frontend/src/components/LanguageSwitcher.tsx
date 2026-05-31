import { ToggleButton, ToggleButtonGroup, alpha } from '@mui/material';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleChange = (_: React.MouseEvent, value: string | null) => {
    if (!value) return;
    i18n.changeLanguage(value);
    localStorage.setItem('lang', value);
  };

  return (
    <ToggleButtonGroup
      value={i18n.language}
      exclusive
      onChange={handleChange}
      size="small"
      sx={{
        height: 30,
        '& .MuiToggleButton-root': {
          px: 1.25,
          py: 0,
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
          color: 'text.secondary',
          border: `1px solid ${alpha('#7c3aed', 0.25)}`,
          '&.Mui-selected': {
            color: '#a78bfa',
            background: alpha('#7c3aed', 0.15),
            borderColor: alpha('#7c3aed', 0.4),
          },
          '&:hover': {
            background: alpha('#7c3aed', 0.08),
          },
        },
      }}
    >
      <ToggleButton value="en" disableRipple>EN</ToggleButton>
      <ToggleButton value="ru" disableRipple>RU</ToggleButton>
    </ToggleButtonGroup>
  );
}
