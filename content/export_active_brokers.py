"""Export active Rebate brokers to content/brokers.json for the Access landing page.

Run inside the ForexLAB Rebate project against a database that reflects the real
broker roster. For a local snapshot, use a DISPOSABLE database prepared with
`migrate` *and* `seed_demo`: IC Markets is created only by seed_demo, not by the
data migrations, so a migrations-only database omits it. Never point this at the
Rebate dev database or production unless that is what you intend to snapshot.

    python manage.py shell -c "exec(open(r'<path>/content/export_active_brokers.py').read())"

The output path can be overridden with ACCESS_BROKERS_JSON.
"""
import json
import os

from apps.brokers.models import Broker

EXPECTED_ORDER = ['IC Markets', 'Tickmill', 'RoboForex', 'IC Trading', 'Fusion Markets', 'FP Markets']

rows = [
    {'name': b.name, 'accountType': b.account_type_label, 'instruments': b.instrument_label}
    for b in Broker.objects.filter(is_active=True).order_by('display_order', 'name')
]
names = [r['name'] for r in rows]
if names != EXPECTED_ORDER:
    raise SystemExit(f'Active broker roster {names} does not match the approved roster {EXPECTED_ORDER}.')

target = os.environ.get('ACCESS_BROKERS_JSON') or os.path.join(
    'C:/EA ForexLab/ForexLAB Access Finsage', 'content', 'brokers.json',
)
with open(target, 'w', encoding='utf-8') as fh:
    json.dump(rows, fh, indent=2)
    fh.write('\n')
print(f'Wrote {len(rows)} brokers to {target}: {names}')
