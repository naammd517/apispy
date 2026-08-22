# ApiSpy

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg) ![Build](https://img.shields.io/badge/build-passing-brightgreen.svg) ![PRs](https://img.shields.io/badge/PRs-welcome-orange.svg) ![Maintained](https://img.shields.io/badge/maintained-yes-cyan.svg) ![Platform](https://img.shields.io/badge/platform-cross-platform-purple.svg)

Intercepts and records HTTP requests made by your local app for debugging and replay.

## About

Intercepts and records HTTP requests made by your local app for debugging and replay.

## Features

- Zero-dependency HTTP API built on node:http
- JSON file persistence with zero setup
- Route matching with URL parameters
- Simple, readable code you can extend in minutes

## Install

```bash
git clone https://github.com/naammd517/apispy.git
cd apispy
```

## Usage

```bash
npm install
npm start

curl http://localhost:4000/api/items
curl -X POST http://localhost:4000/api/items -H "Content-Type: application/json" -d '{"name":"demo"}'
```

## License

MIT. See [LICENSE](LICENSE) for details.

## Support

Found a bug or have an idea? Open an issue. Pull requests are always welcome.