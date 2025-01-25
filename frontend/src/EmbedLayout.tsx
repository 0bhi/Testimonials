import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const EmbedLayout: React.FC<LayoutProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default EmbedLayout;
