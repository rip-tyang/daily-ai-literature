import { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type GeneralError = {
  error: string;
};

export type Post = {
  Title: string;
  Model: string;
  Prompt: string;
  Response: string;
};
