# ThreatAtlas AI

ThreatAtlas AI is a threat-intelligence dashboard concept for monitoring emerging
cyber threats, reviewing indicators, and exploring correlated activity.

## Dashboard MVP

The current application is an interactive React and TypeScript dashboard. Its
threat records and summary metrics are illustrative sample data; it does not yet
connect to live intelligence feeds, an API, or persistent storage.

### Run locally

```sh
cd web
npm install
npm run dev
```

### Validate

```sh
cd web
npm run lint
npm run build
```

Use the global search to filter the recent threat activity by title, indicator,
category, actor, or source. The severity selector narrows the feed further. The
sample indicators use reserved `.example` domains and documentation-only IP
address ranges.
