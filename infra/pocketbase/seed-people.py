#!/usr/bin/env python3
"""Write Chief's test people into PocketBase.

Eight contacts spread across the spheres, including one in a sphere the
Chief does not otherwise deal in, so the Directory has something real to
look at before any of it is typed by hand.

Rerunnable: a person already present by name is skipped rather than
duplicated.

Usage (on the VPS):
    python3 infra/pocketbase/seed-people.py
    python3 infra/pocketbase/seed-people.py http://127.0.0.1:8091
"""
import getpass
import json
import sys
import urllib.error
import urllib.parse
import urllib.request

BASE = (sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8091").rstrip("/")

PEOPLE = [
    ("Carmen", "Ruiz", "Operations lead", ["business", "career"],
     "steady", "carmen@azbolt.example", "+1 555 0148", "Weekly",
     "Prefers a call to a message. Reads nothing after 8 PM."),
    ("Maia", "Thompson", "Daughter", ["children", "family"],
     "strong", "maia@example.com", "+1 555 0102", "Every few days",
     "Finals in three weeks. Ask about the recital, not the grades."),
    ("June", "Okafor", "Spouse", ["spouse", "family"],
     "strong", "june@example.com", "+1 555 0111", "Daily",
     "Anniversary 14 June. Hates surprises, loves plans."),
    ("Elias", "Moreau", "Bishop", ["church"],
     "steady", "elias@example.org", "+1 555 0163", "Weekly",
     "Asked twice about the welfare visit. Follow through."),
    ("Dev", "Patel", "Co-founder", ["business"],
     "fading", "dev@example.com", "+1 555 0177", "Monthly",
     "Went quiet after the valuation conversation."),
    ("Nan", "Whitfield", "Grandmother", ["family"],
     "fading", "", "+1 555 0190", "Fortnightly",
     "Landline only. Mornings are better."),
    ("Koa", "Fifita", "Club captain", ["australian rugby"],
     "new", "koa@example.au", "+61 400 555 012", "Occasional",
     "Met at the tournament. Said to call if ever in Brisbane."),
    ("Sofia", "Lindqvist", "Mentor", ["career", "hobby"],
     "steady", "sofia@example.se", "+46 70 555 0133", "Monthly",
     "Always asks what you stopped doing, not what you started."),
]


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


def main():
    print("PocketBase at %s" % BASE)
    email = input("superuser email: ").strip()
    password = getpass.getpass("password: ")

    token = call(
        "/api/collections/_superusers/auth-with-password",
        {"identity": email, "password": password},
    )["token"]
    print("authenticated")

    # Records are owned by a user, not by the superuser, so the app's
    # owner-scoped rules will return them. One account here, so take the
    # first; with several, ask which.
    users = call("/api/collections/users/records?perPage=50", token=token)["items"]
    if not users:
        print("no user accounts yet — create one in the app first")
        sys.exit(1)
    if len(users) == 1:
        owner = users[0]
    else:
        for i, u in enumerate(users):
            print("  [%d] %s" % (i, u.get("email") or u["id"]))
        owner = users[int(input("own these records as which? ").strip())]
    print("owner: %s" % (owner.get("email") or owner["id"]))

    existing = call(
        "/api/collections/people/records?perPage=200", token=token
    )["items"]
    have = {(p.get("first_name"), p.get("last_name")) for p in existing}

    added = 0
    for first, last, role, spheres, strength, mail, phone, cadence, notes in PEOPLE:
        if (first, last) in have:
            print("skip %s %s (already there)" % (first, last))
            continue
        call("/api/collections/people/records", {
            "first_name": first,
            "last_name": last,
            "role": role,
            "spheres": spheres,
            "relationship": strength,
            "email": mail,
            "phone": phone,
            "cadence": cadence,
            "notes": notes,
            "owner": owner["id"],
        }, token=token)
        print("added %s %s" % (first, last))
        added += 1

    print("done — %d added, %d already present" % (added, len(PEOPLE) - added))


if __name__ == "__main__":
    main()
