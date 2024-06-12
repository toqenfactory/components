import { ReactNode } from 'react';

const BaseComponent = ({
  dark,
  children,
}: {
  dark?: boolean | undefined;
  children: ReactNode;
}) => {
  return <div className={`${dark ? 'dark' : ''}`}>{children}</div>;
};

export default BaseComponent;
