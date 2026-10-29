/**
 * Captured runtime environment for a benchmark run (Requirement 3.4).
 */
export interface IBenchmarkEnvironment {
  /** Operating system name (`os.type()`). */
  readonly osName: string;
  /** CPU model string (`os.cpus()[0].model`). */
  readonly cpuModel: string;
  /** Node.js version (`process.version`). */
  readonly nodeVersion: string;
}

/**
 * One measured benchmark size, serialised into the Benchmark_Report
 * (Requirement 3.4).
 */
export interface IBenchmarkMeasurement {
  /** Human label of the size bucket (e.g. "small (~100 chars)"). */
  readonly label: string;
  /** Input size expressed as a UTF-16 character count. */
  readonly characterCount: number;
  /** Measured throughput or latency value. */
  readonly value: number;
  /** Unit of `value` (e.g. "ops/s" or "ns/iter"). */
  readonly unit: string;
}

/**
 * Full report payload for one Extension version (Requirement 3.5).
 */
export interface IBenchmarkReport {
  /** Extension version string the measurements apply to. */
  readonly extensionVersion: string;
  /** OS name, CPU model, and Node.js version. */
  readonly environment: IBenchmarkEnvironment;
  /** One record per measured size; all three required for a successful write. */
  readonly measurements: readonly IBenchmarkMeasurement[];
}
