import azure.functions as func
import json
import os
import psycopg2
import psycopg2.extras
import requests

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

CORS_HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
}


def validate_token(req: func.HttpRequest) -> bool:
    auth = req.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return False
    token = auth[7:]
    try:
        resp = requests.get(
            "https://graph.microsoft.com/v1.0/me",
            headers={"Authorization": f"Bearer {token}"},
            timeout=5,
        )
        return resp.status_code == 200
    except Exception:
        return False


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def row_to_dict(row):
    d = dict(row)
    # Normalize: expose created_at as timestamp for frontend compatibility
    if d.get("created_at"):
        d["timestamp"] = d["created_at"].isoformat()
    return d


def json_resp(data, status=200):
    return func.HttpResponse(
        json.dumps(data, default=str),
        status_code=status,
        headers=CORS_HEADERS,
    )


def err_resp(msg, status=400):
    return func.HttpResponse(
        json.dumps({"error": msg}),
        status_code=status,
        headers=CORS_HEADERS,
    )


# ── ENTRIES ────────────────────────────────────────────────────────────────────

@app.route(route="entries", methods=["GET", "OPTIONS"])
def get_entries(req: func.HttpRequest) -> func.HttpResponse:
    if req.method == "OPTIONS":
        return func.HttpResponse(status_code=200, headers=CORS_HEADERS)
    if not validate_token(req):
        return err_resp("Unauthorized", 401)
    year = req.params.get("year")
    month = req.params.get("month")
    if not year:
        return err_resp("year is required")
    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            if month:
                cur.execute(
                    "SELECT * FROM lease_entries WHERE year=%s AND month=%s ORDER BY created_at",
                    (year, month),
                )
            else:
                cur.execute(
                    "SELECT * FROM lease_entries WHERE year=%s ORDER BY created_at",
                    (year,),
                )
            rows = [row_to_dict(r) for r in cur.fetchall()]
        return json_resp(rows)
    finally:
        conn.close()


@app.route(route="entries", methods=["POST"])
def create_entry(req: func.HttpRequest) -> func.HttpResponse:
    if not validate_token(req):
        return err_resp("Unauthorized", 401)
    try:
        body = req.get_json()
    except Exception:
        return err_resp("Invalid JSON")
    name = (body.get("name") or "").strip()
    outcome = body.get("outcome")
    if not name or outcome not in ("A", "B", "C"):
        return err_resp("name and valid outcome required")
    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                """INSERT INTO lease_entries
                   (name, outcome, disposition, broker, our_customer, year, month)
                   VALUES (%s, %s, %s, %s, %s, %s, %s)
                   RETURNING *""",
                (
                    name,
                    outcome,
                    body.get("disposition") or "",
                    (body.get("broker") or "").strip(),
                    bool(body.get("our_customer", True)),
                    int(body["year"]),
                    body["month"],
                ),
            )
            row = row_to_dict(cur.fetchone())
        conn.commit()
        return json_resp(row, 201)
    finally:
        conn.close()


@app.route(route="entries/{id}", methods=["PUT", "OPTIONS"])
def update_entry(req: func.HttpRequest) -> func.HttpResponse:
    if req.method == "OPTIONS":
        return func.HttpResponse(status_code=200, headers=CORS_HEADERS)
    if not validate_token(req):
        return err_resp("Unauthorized", 401)
    entry_id = req.route_params.get("id")
    try:
        body = req.get_json()
    except Exception:
        return err_resp("Invalid JSON")
    name = (body.get("name") or "").strip()
    outcome = body.get("outcome")
    if not name or outcome not in ("A", "B", "C"):
        return err_resp("name and valid outcome required")
    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                """UPDATE lease_entries
                   SET name=%s, outcome=%s, disposition=%s, broker=%s,
                       our_customer=%s, updated_at=NOW()
                   WHERE id=%s AND is_historical=FALSE
                   RETURNING *""",
                (
                    name,
                    outcome,
                    body.get("disposition") or "",
                    (body.get("broker") or "").strip(),
                    bool(body.get("our_customer", True)),
                    entry_id,
                ),
            )
            row = cur.fetchone()
            if not row:
                return err_resp("Entry not found or is historical", 404)
            updated = row_to_dict(row)
        conn.commit()
        return json_resp(updated)
    finally:
        conn.close()


@app.route(route="entries/{id}", methods=["DELETE", "OPTIONS"])
def delete_entry(req: func.HttpRequest) -> func.HttpResponse:
    if req.method == "OPTIONS":
        return func.HttpResponse(status_code=200, headers=CORS_HEADERS)
    if not validate_token(req):
        return err_resp("Unauthorized", 401)
    entry_id = req.route_params.get("id")
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "DELETE FROM lease_entries WHERE id=%s AND is_historical=FALSE RETURNING id",
                (entry_id,),
            )
            if not cur.fetchone():
                return err_resp("Entry not found or is historical", 404)
        conn.commit()
        return func.HttpResponse(status_code=204, headers=CORS_HEADERS)
    finally:
        conn.close()


# ── LOCKED MONTHS ──────────────────────────────────────────────────────────────

@app.route(route="locked", methods=["GET", "OPTIONS"])
def get_locked(req: func.HttpRequest) -> func.HttpResponse:
    if req.method == "OPTIONS":
        return func.HttpResponse(status_code=200, headers=CORS_HEADERS)
    if not validate_token(req):
        return err_resp("Unauthorized", 401)
    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT year, month, is_unlocked FROM locked_months")
            rows = [dict(r) for r in cur.fetchall()]
        return json_resp(rows)
    finally:
        conn.close()


@app.route(route="locked", methods=["POST"])
def set_locked(req: func.HttpRequest) -> func.HttpResponse:
    if not validate_token(req):
        return err_resp("Unauthorized", 401)
    try:
        body = req.get_json()
    except Exception:
        return err_resp("Invalid JSON")
    year = body.get("year")
    month = body.get("month")
    is_unlocked = bool(body.get("is_unlocked", False))
    if not year or not month:
        return err_resp("year and month required")
    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                """INSERT INTO locked_months (year, month, is_unlocked)
                   VALUES (%s, %s, %s)
                   ON CONFLICT (year, month) DO UPDATE SET is_unlocked=EXCLUDED.is_unlocked
                   RETURNING *""",
                (int(year), month, is_unlocked),
            )
            row = dict(cur.fetchone())
        conn.commit()
        return json_resp(row, 201)
    finally:
        conn.close()
