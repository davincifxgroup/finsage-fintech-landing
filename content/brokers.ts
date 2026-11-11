/**
 * Active ForexLAB partner brokers, exported from Rebate `Broker` records
 * (is_active=True, ordered by display_order, name). Never edit by hand:
 * regenerate content/brokers.json from the Rebate database. This snapshot came
 * from a disposable local Rebate database seeded by its migrations; production
 * may differ (for example IC Markets is created by seed_demo, not migrations).
 * Broker compatibility is confirmed per advisor; this list is not a promise that
 * every advisor supports every broker.
 */
import brokers from "./brokers.json";

export type Broker = { name: string; accountType: string; instruments: string };

export const activeBrokers: Broker[] = brokers;
