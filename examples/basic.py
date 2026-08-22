"""Minimal example for ApiSpy."""

from apispy import apispy


def main():
 runner = apispy({"name": "ApiSpy", "dry_run": False})
 result = runner.execute()
 print(result)


if __name__ == "__main__":
 main()