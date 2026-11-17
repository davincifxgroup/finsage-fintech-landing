/**
 * Active ForexLAB partner brokers, exported from Rebate `Broker` records
 * (is_active=True, ordered by display_order, name) with content/export_active_brokers.py.
 * Never edit by hand. The approved roster is IC Markets, Tickmill, RoboForex,
 * IC Trading, Fusion Markets, FP Markets; the exporter refuses anything else.
 * Snapshot source: a disposable Rebate database prepared with migrate + seed_demo
 * (IC Markets is created by seed_demo, not by the migrations).
 * Compatibility is confirmed per advisor; this list does not mean every advisor
 * supports every broker.
 */
import brokers from "./brokers.json";

export type Broker = { name: string; accountType: string; instruments: string };

export const activeBrokers: Broker[] = brokers;
