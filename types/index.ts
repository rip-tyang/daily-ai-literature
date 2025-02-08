import { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type GeneralError = {
  error: string;
};

export type PostMetadata = {
  Title: string;
  Model: string;
  Prompt: [string];
};

export type Post = PostMetadata & {
  Response: string;
};
