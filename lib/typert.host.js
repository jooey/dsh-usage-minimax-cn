/* Host-face Typert manifest for dsh-usage-minimax-cn (hand-written). */
import z from "zod";

const windowSnapshotSchema = z.object({
  percent: z.number().nullable(),
  remaining_percent: z.number().nullable(),
  total_count: z.number().nullable(),
  usage_count: z.number().nullable(),
  status: z.number().nullable(),
  start_time: z.number().nullable(),
  reset_at: z.string().nullable(),
  remains_ms: z.number().nullable()
}).nullable();

const modelSnapshotSchema = z.object({
  name: z.string(),
  rolling: windowSnapshotSchema,
  weekly: windowSnapshotSchema,
  monthly: windowSnapshotSchema
});

const minimaxUsageSnapshotResult$schema = z.object({
  models: z.array(modelSnapshotSchema),
  status: z.object({
    code: z.number().nullable(),
    msg: z.string().nullable()
  })
});

export const TYPERT = {
  package: "dsh-usage-minimax-cn",
  face: "host",
  schemas: [],
  invocations: [
    {
      id: "dsh-usage-minimax-cn#minimaxUsage/snapshot",
      service: "minimaxUsage",
      namespace: "minimaxUsage",
      method: "snapshot",
      invocation: { kind: "direct" },
      parameters: [],
      result: {
        mode: "strict",
        typeSymbol: "dsh-usage-minimax-cn/types#MiniMaxUsageSnapshot",
        schema: minimaxUsageSnapshotResult$schema
      },
      sourceLocation: { file: "lib/index.js", line: 1, column: 1 }
    }
  ],
  model: {
    services: [],
    events: [],
    objects: []
  }
};

export default TYPERT;
