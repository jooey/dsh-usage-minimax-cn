/* Client-face Typert remote manifest for dsh-usage-minimax-cn (hand-written).
   The schema is a minimal strict codec: the host already zod-validated its
   result, so the client only enforces the strict codec contract shape. */

const windowSnapshotSchema = {
  parse(value) {
    if (value === null || value === undefined) return null;
    if (typeof value !== "object") throw new TypeError("expected a minimax window snapshot object");
    return {
      percent: typeof value.percent === "number" ? value.percent : null,
      remaining_percent: typeof value.remaining_percent === "number" ? value.remaining_percent : null,
      total_count: typeof value.total_count === "number" ? value.total_count : null,
      usage_count: typeof value.usage_count === "number" ? value.usage_count : null,
      status: typeof value.status === "number" ? value.status : null,
      start_time: typeof value.start_time === "number" ? value.start_time : null,
      reset_at: typeof value.reset_at === "string" ? value.reset_at : null,
      remains_ms: typeof value.remains_ms === "number" ? value.remains_ms : null
    };
  }
};

const modelSnapshotSchema = {
  parse(value) {
    if (!value || typeof value !== "object") {
      throw new TypeError("expected a minimax model snapshot object");
    }
    return {
      name: typeof value.name === "string" ? value.name : "unknown",
      rolling: windowSnapshotSchema.parse(value.rolling),
      weekly: windowSnapshotSchema.parse(value.weekly),
      monthly: windowSnapshotSchema.parse(value.monthly)
    };
  }
};

export const TYPERT_REMOTE = {
  package: "dsh-usage-minimax-cn",
  descriptors: [
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
        schema: {
          parse(value) {
            if (!value || typeof value !== "object") {
              throw new TypeError("expected a minimax usage snapshot object");
            }
            const models = Array.isArray(value.models)
              ? value.models.map((entry) => modelSnapshotSchema.parse(entry))
              : [];
            const status = value.status && typeof value.status === "object"
              ? {
                  code: typeof value.status.code === "number" ? value.status.code : null,
                  msg: typeof value.status.msg === "string" ? value.status.msg : null
                }
              : { code: null, msg: null };
            return { models, status };
          }
        }
      },
      sourceLocation: { file: "lib/index.js", line: 1, column: 1 }
    }
  ]
};

export default TYPERT_REMOTE;
