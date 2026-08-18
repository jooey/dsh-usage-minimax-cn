/**
 * dsh-usage-minimax-cn host face type declaration.
 *
 * The loader consumes the Cordis plugin contract ({ name, inject, apply }).
 * Core logic re-exports are safe to import in tooling; the dependency-free
 * sources also live in ./logic (see lib/logic.js for exact behavior).
 */

import type { Context } from "@deepseek-ai/cordis";
import type { CredentialRef } from "@deepseek-ai/dsh-credentials";

export const name: string;
export const inject: string[];
export const API_KEY_REF: string;
export const PLATFORM_URL: string;
export const INVITATION_URL: string;
export const USAGE_URL: string;
export const USAGE_HELP: string;

export interface FetchUsageResult {
  ok: boolean;
  usage?: {
    base_resp?: { status_code?: number; status_msg?: string };
    model_remains?: Array<Record<string, unknown>>;
  };
  error?: string;
}

export interface MiniMaxWindowSnapshot {
  percent: number | null;            // 100 - remaining_percent (used%)
  remaining_percent: number | null;
  total_count: number | null;
  usage_count: number | null;
  status: number | null;
  start_time: number | null;          // Unix ms epoch
  reset_at: string | null;            // ISO 8601 (parsed from end_time)
  remains_ms: number | null;          // milliseconds until window reset
}

export interface MiniMaxModelSnapshot {
  name: string;
  rolling: MiniMaxWindowSnapshot | null;
  weekly: MiniMaxWindowSnapshot | null;
  monthly: MiniMaxWindowSnapshot | null;
}

export interface MiniMaxUsageSnapshot {
  models: MiniMaxModelSnapshot[];
  status: { code: number | null; msg: string | null };
}

export type UsageWindowFilter = "rolling" | "weekly" | "monthly";

export interface ParsedUsageArgs {
  window: UsageWindowFilter | null;
  asJson: boolean;
  wantHelp: boolean;
  tokens: string[];
}

export declare function apply(ctx: Context): Promise<void>;
export declare function fetchUsage(ctx: Context): Promise<FetchUsageResult>;
export declare function formatPercent(value: unknown): string;
export declare function formatUsages(usage: unknown, window?: UsageWindowFilter | null): string;
export declare function formatUsageAsJson(usage: unknown, window?: UsageWindowFilter | null): string;
export declare function fetchUsageSnapshot(credentials: {
  resolve(ref: CredentialRef): Promise<{ value: string; source?: string } | undefined>;
}): Promise<MiniMaxUsageSnapshot>;
export declare function parseUsageArgs(rawArgs: unknown): ParsedUsageArgs;

export declare class MiniMaxUsageGateway {
  static inject: string[];
  constructor(ctx: Context);
  snapshot(): Promise<MiniMaxUsageSnapshot>;
}
