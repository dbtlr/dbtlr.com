/// <reference path="../.astro/types.d.ts" />

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
