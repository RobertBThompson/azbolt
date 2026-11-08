#!/usr/bin/env python3
"""Create or verify Chief's PocketBase collections.

Rerunnable: skips anything that already exists, so a failed run can be
fixed and repeated without hand-deleting collections.

Usage (on the VPS):
    python3 infra/pocketbase/apply-collections.py
    python3 infra/pocketbase/apply-collections.py http://127.0.0.1:8091

Prompts for the superuser email and password; the password is not echoed.
"""
import getpass
import json
import sys
import urllib.error
import urllib.request

BASE = (sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8091").rstrip("/")


def call(path, data=None, token=None):
    req = urllib.request.Request(BASE + path, method="POST" if data else "GET")
    req.add_header("Content-Type", "application/json")
    if token:
        req.add_header("Authorization", token)
    body = json.dumps(data).encode() if data else None
    try:
        with urllib.request.urlopen(req, body, timeout=15) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        print("HTTP %s on %s" % (e.code, path))
        print(e.read().decode()[:800])
        sys.exit(1)
    except urllib.error.URLError as e:
        print("cannot reach %s: %s" % (BASE, e.reason))
        sys.exit(1)


RULES = {
    "listRule": "owner = @request.auth.id",
    "viewRule": "owner = @request.auth.id",
    "createRule": "@request.auth.id != '' && owner = @request.auth.id",
    "updateRule": "owner = @request.auth.id",
    "deleteRule": "owner = @request.auth.id",
}


def owner_field(users_id):
    return {
        "name": "owner",
        "type": "relation",
        "required": True,
        "maxSelect": 1,
        "cascadeDelete": True,
        "collectionId": users_id,
    }


def main():
    print("PocketBase at %s" % BASE)
    email = input("superuser email: ").strip()
    password = getpass.getpass("password: ")

    token = call(
        "/api/collections/_superusers/auth-with-password",
        {"identity": email, "password": password},
    )["token"]
    print("authenticated")

    existing = {
        c["name"]: c["id"]
        for c in call("/api/collections?perPage=200", token=token)["items"]
    }

    users_id = existing.get("users")
    if not users_id:
        print("no 'users' collection found; aborting")
        sys.exit(1)

    if "workspaces" in existing:
        workspaces_id = existing["workspaces"]
        print("workspaces already exists")
    else:
        created = call(
            "/api/collections",
            dict(
                RULES,
                name="workspaces",
                type="base",
                fields=[
                    {"name": "name", "type": "text", "required": True,
                     "presentable": True, "max": 120},
                    {"name": "kind", "type": "select", "required": True,
                     "maxSelect": 1,
                     "values": ["company", "holding", "nonprofit", "dao", "personal"]},
                    {"name": "blurb", "type": "text", "max": 240},
                    {"name": "swatch", "type": "select", "required": True,
                     "maxSelect": 1, "values": ["solid", "hatched", "split"]},
                    {"name": "hue", "type": "text", "max": 32},
                    owner_field(users_id),
                ],
                indexes=[
                    "CREATE UNIQUE INDEX idx_workspaces_owner_name "
                    "ON workspaces (owner, name)"
                ],
            ),
            token=token,
        )
        workspaces_id = created["id"]
        print("created workspaces %s" % workspaces_id)

    if "people" in existing:
        print("people already exists")
    else:
        call(
            "/api/collections",
            dict(
                RULES,
                name="people",
                type="base",
                fields=[
                    {"name": "first_name", "type": "text", "required": True,
                     "presentable": True, "max": 80},
                    {"name": "last_name", "type": "text", "max": 80},
                    {"name": "role", "type": "text", "max": 120},
                    {"name": "relationship", "type": "text", "max": 80},
                    {"name": "is_me", "type": "bool"},
                    {"name": "workspace", "type": "relation", "required": False,
                     "maxSelect": 1, "cascadeDelete": False,
                     "collectionId": workspaces_id},
                    {"name": "next_interaction", "type": "date"},
                    {"name": "notes", "type": "text", "max": 2000},
                    owner_field(users_id),
                ],
                indexes=["CREATE INDEX idx_people_owner ON people (owner)"],
            ),
            token=token,
        )
        print("created people")

    print("done")


if __name__ == "__main__":
    main()
