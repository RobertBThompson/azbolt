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


def call(path, data=None, token=None, method=None):
    req = urllib.request.Request(
        BASE + path, method=method or ("POST" if data else "GET")
    )
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

    collections = call("/api/collections?perPage=200", token=token)["items"]
    existing = {c["name"]: c["id"] for c in collections}

    users_id = existing.get("users")
    if not users_id:
        print("no 'users' collection found; aborting")
        sys.exit(1)

    # Chief's sign-up screen creates a users record directly. That only
    # works if the collection's createRule is open; PocketBase ships it
    # open but an edited instance may not be, and the failure would look
    # like a bug in the app rather than a rule.
    users = next(c for c in collections if c["id"] == users_id)
    create_rule = users.get("createRule")
    if create_rule is None:
        print("note: users.createRule is superuser-only, so in-app sign-up "
              "will fail. Create the account under Collections > users in "
              "the admin UI, or open the rule.")
    else:
        print("users sign-up rule: %s" % (create_rule or "open to anyone"))

    # An instance set up before the rename has this collection under its
    # old name. Renaming keeps the records and the relation from people;
    # creating a second collection would silently orphan them.
    if "workspaces" in existing and "spheres" not in existing:
        renamed = call("/api/collections/%s" % existing["workspaces"],
                       {"name": "spheres"}, token=token, method="PATCH")
        existing["spheres"] = renamed["id"]
        print("renamed workspaces -> spheres")

    if "spheres" in existing:
        spheres_id = existing["spheres"]
        print("spheres already exists")
    else:
        created = call(
            "/api/collections",
            dict(
                RULES,
                name="spheres",
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
                    "CREATE UNIQUE INDEX idx_spheres_owner_name "
                    "ON spheres (owner, name)"
                ],
            ),
            token=token,
        )
        spheres_id = created["id"]
        print("created spheres %s" % spheres_id)

    if "people" in existing:
        print("people already exists")
        # The relation field carries the old name on an instance built
        # before the rename. Patch just that field, by id, leaving every
        # other field untouched.
        people = next(c for c in collections if c["id"] == existing["people"])
        fields = people.get("fields", [])
        stale = next((f for f in fields if f.get("name") == "workspace"), None)
        if stale:
            stale["name"] = "sphere"
            call("/api/collections/%s" % existing["people"],
                 {"fields": fields}, token=token, method="PATCH")
            print("renamed people.workspace -> people.sphere")
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
                    {"name": "sphere", "type": "relation", "required": False,
                     "maxSelect": 1, "cascadeDelete": False,
                     "collectionId": spheres_id},
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
