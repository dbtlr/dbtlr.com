/// <reference path="../.astro/types.d.ts" />

declare module '*.svg?react' {
  import { FC, SVGProps } from 'react';
  const content: FC<SVGProps<SVGSVGElement>>;
  export default content;
}

type CloudflareRuntime<Env = unknown> = {
  env: Env;
  cf: CfProperties;
  ctx: ExecutionContext;
};

declare namespace App {
  interface Locals {
    runtime?: CloudflareRuntime;
  }
}
