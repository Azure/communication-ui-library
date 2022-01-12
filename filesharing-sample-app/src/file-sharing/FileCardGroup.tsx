import { mergeStyles, Stack } from '@fluentui/react';

export interface FileCardGroupProps {
  children: React.ReactNode;
}

export const FileCardGroup = (props: FileCardGroupProps) => {
  const { children } = props;
  return (
    <Stack
      horizontal
      className={mergeStyles({
        flexFlow: 'row wrap',
        '& > *': {
          marginRight: '0.5rem',
          marginTop: '0.5rem'
        }
      })}
    >
      {children}
    </Stack>
  );
};
