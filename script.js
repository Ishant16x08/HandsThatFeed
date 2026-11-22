const KEY = "shareMeal_v7",
  CATS = {
    "Cooked meals": "🍛",
    Bakery: "🍞",
    "Fruits & veg": "🥦",
    Dairy: "🥛",
    Packaged: "📦",
  };
const day = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
const today = () => day(0);
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const uid = () => Math.random().toString(36).slice(2, 9);
const $ = (id) => document.getElementById(id);
const seed = () => ({
  me: "admin",
  orgs: [
    {
      id: "o1",
      name: "Spice Garden Restaurant",
      role: "donor",
      phone: "9876500001",
      email: "spicegarden@gmail.com",
      area: "Phagwara",
      user: "DonorCodeVerse",
      pw: "Mealify2",
      verified: true,
    },
    {
      id: "o2",
      name: "Sunrise Bakery",
      role: "donor",
      phone: "9876500003",
      email: "sunrisebakery@gmail.com",
      area: "Jalandhar",
      user: "DonorCodeVerse2",
      pw: "Mealify4",
      verified: true,
    },
    {
      id: "o3",
      name: "Seva Community Kitchen",
      role: "donor",
      phone: "9876500002",
      email: "sevakitchen@gmail.com",
      area: "Phagwara",
      user: "DonorCodeVerse3",
      pw: "Mealify5",
      verified: true,
    },
    {
      id: "o4",
      name: "Hope Shelter",
      role: "recipient",
      type: "Shelter",
      phone: "9876500004",
      email: "hopeshelter@gmail.com",
      area: "Kapurthala",
      user: "RecipientCodeVerse3",
      pw: "Mealify6",
      verified: false,
    },
    {
      id: "o5",
      name: "Bal Ashram Orphanage",
      role: "recipient",
      type: "Orphanage",
      phone: "9876500005",
      email: "balashram@gmail.com",
      area: "Phagwara",
      user: "RecipientCodeVerse",
      pw: "Mealify3",
      verified: true,
    },
    {
      id: "o6",
      name: "Shanti Old Age Home",
      role: "recipient",
      type: "Old age home",
      phone: "9876500006",
      email: "shantihome@gmail.com",
      area: "Jalandhar",
      user: "RecipientCodeVerse4",
      pw: "Mealify7",
      verified: true,
    },
  ],
  items: [
    {
      id: "i1",
      donor: "o1",
      cat: "Cooked meals",
      item: "Dal, rice & sabzi",
      qty: 40,
      unit: "meals",
      expiry: day(1),
      addr: "Main Market Rd",
      status: "Available",
      rec: null,
    },
    {
      id: "i2",
      donor: "o2",
      cat: "Bakery",
      item: "Fresh bread loaves",
      qty: 25,
      unit: "packets",
      expiry: day(3),
      addr: "GT Road",
      status: "Available",
      rec: null,
    },
    {
      id: "i3",
      donor: "o1",
      cat: "Cooked meals",
      item: "Rajma chawal",
      qty: 60,
      unit: "meals",
      expiry: day(-6),
      addr: "Main Market Rd",
      status: "Completed",
      rec: "o5",
      done: day(-6),
    },
    {
      id: "i4",
      donor: "o2",
      cat: "Bakery",
      item: "Bread & buns",
      qty: 30,
      unit: "packets",
      expiry: day(-4),
      addr: "GT Road",
      status: "Completed",
      rec: "o6",
      done: day(-4),
    },
    {
      id: "i5",
      donor: "o1",
      cat: "Cooked meals",
      item: "Veg pulao",
      qty: 50,
      unit: "meals",
      expiry: day(-2),
      addr: "Main Market Rd",
      status: "Completed",
      rec: "o6",
      done: day(-2),
    },
    {
      id: "i6",
      donor: "o2",
      cat: "Dairy",
      item: "Packaged milk",
      qty: 20,
      unit: "litres",
      expiry: day(-9),
      addr: "GT Road",
      status: "Completed",
      rec: "o5",
      done: day(-9),
    },
  ],
  notes: [
    {
      id: uid(),
      to: null,
      text: "Welcome to ShareMeal! Use the “Signed in as” menu to try each role.",
      time: new Date().toLocaleString(),
      read: false,
    },
  ],
});
let S;
try {
  S = JSON.parse(localStorage.getItem(KEY));
} catch (e) {}
if (!S) S = seed();
const SESS = "htf_session";
let sid = null;
try {
  sid = localStorage.getItem(SESS);
} catch (e) {}
if (!sid || (sid !== "admin" && !S.orgs.some((o) => o.id === sid))) {
  location.replace("login.html");
  throw new Error("Not signed in");
}
S.me = sid;
const TYPES = {
  Orphanage: "🧒",
  "Old age home": "👵",
  Shelter: "🏠",
  "Community kitchen": "🍲",
};
const save = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
  } catch (e) {}
};
const org = (id) => S.orgs.find((o) => o.id === id);
const me = () =>
  S.me === "admin"
    ? { id: "admin", role: "admin", verified: true, name: "Admin" }
    : org(S.me) || {
        id: "admin",
        role: "admin",
        verified: true,
        name: "Admin",
      };
const notify = (text, to) =>
  S.notes.unshift({
    id: uid(),
    to: to || null,
    text,
    time: new Date().toLocaleString(),
    read: false,
  });
const toast = (t) => {
  $("toast").textContent = t;
  $("toast").className = "show";
  setTimeout(() => ($("toast").className = ""), 2200);
};
const myNotes = () =>
  S.notes.filter((n) => me().role === "admin" || !n.to || n.to === S.me);
let cur = "home";
const go = (t) => {
  cur = t;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

function expire() {
  S.items.forEach((i) => {
    if (
      i.expiry < today() &&
      (i.status === "Available" || i.status === "Requested")
    ) {
      i.status = "Expired";
      notify(`“${i.item}” expired.`, i.donor);
    }
  });
}
function left(d) {
  const n = Math.round((new Date(d) - new Date(today())) / 864e5);
  return n < 0
    ? "expired"
    : n === 0
      ? "expires today"
      : n === 1
        ? "1 day left"
        : n + " days left";
}

function renderTabs() {
  const u = myNotes().filter((n) => !n.read).length,
    v = me();
  const t = [
    ["home", "Home"],
    ["list", "Listings"],
    ["impact", "Where we donated"],
  ];
  if (v.role !== "recipient") t.push(["post", "Donate"]);
  t.push(["orgs", "Profiles"], ["notes", "Notifications"]);
  if (!t.some((x) => x[0] === cur)) cur = "home";
  $("tabs").innerHTML = t
    .map(
      ([id, l]) =>
        `<button class="${id === cur ? "on" : ""}" data-t="${id}">${l}${id === "notes" && u ? `<span class="dot">${u}</span>` : ""}${id === "orgs" && v.role === "admin" && getR().some((r) => r.status === "pending") ? `<span class="dot">${getR().filter((r) => r.status === "pending").length}</span>` : ""}</button>`,
    )
    .join("");
  document
    .querySelectorAll("section")
    .forEach((s) => s.classList.toggle("on", s.id === cur));
  $("meName").textContent = v.name + " (" + v.role + ")";
}
function renderHome() {
  const c = (s) => S.items.filter((i) => i.status === s).length;
  const units = S.items
    .filter((i) => i.status === "Completed")
    .reduce((a, i) => a + Number(i.qty), 0);
  $("stats").innerHTML = [
    [S.items.length, "Total donations"],
    [c("Available"), "Available now"],
    [c("Completed"), "Pickups completed"],
    [units, "Units delivered"],
    [S.orgs.filter((o) => o.verified).length, "Verified members"],
  ]
    .map(
      ([n, l]) => `<div class="card stat"><b>${n}</b><span>${l}</span></div>`,
    )
    .join("");
  const col = {
      Available: "#16a34a",
      Requested: "#f59e0b",
      Matched: "#2563eb",
      Completed: "#7c3aed",
      Expired: "#dc2626",
    },
    mx = Math.max(1, S.items.length);
  $("chart").innerHTML = Object.keys(col)
    .map(
      (s) =>
        `<div class="l"><span>${s}</span><b>${c(s)}</b></div><div class="tr"><i style="width:${(c(s) / mx) * 100}%;background:${col[s]}"></i></div>`,
    )
    .join("");
}
function renderItems() {
  const fs = $("fStatus").value,
    fc = $("fCat").value,
    q = $("fSearch").value.toLowerCase(),
    v = me();
  const list = S.items.filter(
    (i) =>
      (!fs || i.status === fs) &&
      (!fc || i.cat === fc) &&
      (!q ||
        (i.item + " " + (org(i.donor) || { name: "" }).name)
          .toLowerCase()
          .includes(q)),
  );
  const recOK = v.role === "recipient" && v.verified,
    admin = v.role === "admin";
  $("items").innerHTML = list.length
    ? list
        .map((i) => {
          const d = org(i.donor) || { name: "Unknown" },
            r = i.rec && org(i.rec),
            owner = admin || i.donor === v.id,
            mine = admin || i.rec === v.id;
          let a = "";
          if (i.status === "Available") {
            if (recOK)
              a += `<button class="btn s" data-a="req" data-id="${i.id}">Request pickup</button>`;
            if (admin)
              a += `<button class="btn w s" data-a="auto" data-id="${i.id}">Auto-match</button>`;
            if (owner)
              a += `<button class="btn d s" data-a="del" data-id="${i.id}">Delete</button>`;
            if (v.role === "recipient" && !v.verified)
              a = `<span class="no">Get verified to request</span>`;
          }
          if (i.status === "Requested" && owner)
            a = `<button class="btn s" data-a="ok" data-id="${i.id}">Approve</button><button class="btn o s" data-a="no" data-id="${i.id}">Decline</button>`;
          if (i.status === "Matched" && (owner || mine))
            a = `<button class="btn s" data-a="done" data-id="${i.id}">Mark picked up</button>`;
          return `<div class="card item"><div class="row"><span class="em">${CATS[i.cat] || "🍽️"}</span><span class="tag ${i.status}">${i.status}</span></div>
    <h3>${esc(i.item)}</h3><p>${esc(i.qty)} ${esc(i.unit)} · ${esc(d.name)}</p><p>📍 ${esc(i.addr)}</p>
    <p class="${left(i.expiry) === "expires today" || left(i.expiry) === "1 day left" ? "urgent" : ""}">⏳ ${esc(left(i.expiry))} (${esc(i.expiry)})</p>
    ${r ? `<p>🤝 ${esc(r.name)}</p>` : ""}<div class="acts">${a}</div></div>`;
        })
        .join("")
    : `<div class="empty card">No donations match your filters.</div>`;
}
function renderPost() {
  const v = me(),
    donors = S.orgs.filter((o) => o.role === "donor" && o.verified);
  if (v.role === "recipient") {
    $("postBox").innerHTML =
      `<p class="empty">Recipients can’t post donations. Switch to a donor profile.</p>`;
    return;
  }
  if (v.role === "donor" && !v.verified) {
    $("postBox").innerHTML =
      `<p class="empty">Your profile is awaiting verification by an admin.</p>`;
    return;
  }
  $("postBox").innerHTML = `<form id="donForm">
   <label>Donor ${v.role === "admin" ? `<select id="dDonor">${donors.map((o) => `<option value="${o.id}">${esc(o.name)}</option>`).join("")}</select>` : `<input id="dDonor" value="${v.id}" type="hidden"><input value="${esc(v.name)}" disabled>`}</label>
   <label>Category <select id="dCat">${Object.keys(CATS)
     .map((c) => `<option>${c}</option>`)
     .join("")}</select></label>
   <label>Food item <input id="dItem" required placeholder="e.g. Veg biryani"></label>
   <label>Quantity <input id="dQty" type="number" min="1" required></label>
   <label>Unit <select id="dUnit"><option>meals</option><option>kg</option><option>packets</option><option>litres</option></select></label>
   <label>Expiry date <input id="dExp" type="date" min="${today()}" required></label>
   <label>Pickup address <input id="dAddr" required></label>
   <button class="btn" type="submit">Post donation</button></form>`;
}
function renderOrgs() {
  const admin = me().role === "admin";
  $("regCard").style.display = admin ? "" : "none";
  $("orgList").innerHTML = S.orgs
    .map(
      (
        o,
      ) => `<div class="card item"><div class="row"><h3>${esc(o.name)}</h3><span class="${o.verified ? "ok" : "no"}">${o.verified ? "✔ Verified" : "Unverified"}</span></div>
  <p>${o.role === "donor" ? "🍞 Donor" : "🏠 " + esc(o.type || "Recipient")} · ${esc(o.area)}</p><p>${esc(o.phone || "")} · ${esc(o.email || "")}</p>
  ${admin ? `<div class="acts"><button class="btn ${o.verified ? "o" : ""} s" data-v="${o.id}">${o.verified ? "Revoke" : "Verify"}</button></div>` : ""}</div>`,
    )
    .join("");
}
function renderNotes() {
  const n = myNotes();
  $("noteList").innerHTML = n.length
    ? n
        .map(
          (x) =>
            `<div class="card note" style="${x.read ? "opacity:.55" : ""}">${esc(x.text)}<br><small>${esc(x.time)}</small></div>`,
        )
        .join("")
    : `<div class="empty card">No notifications.</div>`;
}
function renderImpact() {
  const f = $("iType").value,
    by = {};
  S.items
    .filter((i) => i.status === "Completed" && i.rec)
    .forEach((i) => (by[i.rec] = by[i.rec] || []).push(i));
  const recs = S.orgs.filter((o) => by[o.id] && (!f || o.type === f));
  const sum = (a) => a.reduce((s, i) => s + Number(i.qty), 0);
  const all = recs.flatMap((o) => by[o.id]);
  $("impStats").innerHTML = [
    [recs.length, "Places supported"],
    [all.length, "Donations delivered"],
    [sum(all), "Units given"],
  ]
    .map(
      ([n, l]) => `<div class="card stat"><b>${n}</b><span>${l}</span></div>`,
    )
    .join("");
  $("impList").innerHTML = recs.length
    ? recs
        .map((o) => {
          const L = by[o.id].sort((a, b) =>
            (b.done || "").localeCompare(a.done || ""),
          );
          return `<div class="card item"><div class="row"><span class="em">${TYPES[o.type] || "🍽️"}</span><span class="ok">${esc(o.type || "Recipient")}</span></div>
        <h3>${esc(o.name)}</h3><p>📍 ${esc(o.area)} · ${L.length} donation${L.length > 1 ? "s" : ""}, ${sum(L)} units</p>
        <ul class="hist">${L.map((i) => `<li><span>${esc(i.item)} – ${esc(i.qty)} ${esc(i.unit)}</span><small>${esc(i.done || "")}</small></li>`).join("")}</ul></div>`;
        })
        .join("")
    : `<div class="empty card">No completed donations for this filter yet.</div>`;
}
function exportCreds() {
  const rows = [
    [
      "Profile",
      "Role",
      "Type",
      "Area",
      "Login ID",
      "Gmail",
      "Phone",
      "Password",
      "Verified",
    ],
    ["Admin", "Admin", "", "", "CodeVerse", "", "", "Mealify", "Yes"],
  ].concat(
    S.orgs.map((o) => [
      o.name,
      o.role,
      o.type || "",
      o.area,
      o.user || "",
      o.email || "",
      o.phone || "",
      o.pw || "",
      o.verified ? "Yes" : "No",
    ]),
  );
  if (window.XLSX) {
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = [28, 12, 18, 14, 24, 30, 14, 14, 10].map((w) => ({ wch: w }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Logins");
    XLSX.writeFile(wb, "HandsThatFeed_logins.xlsx");
  } else {
    const q = (s) => `"${String(s).replace(/"/g, '""')}"`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([rows.map((r) => r.map(q).join(",")).join("\n")], {
        type: "text/csv",
      }),
    );
    a.download = "HandsThatFeed_logins.csv";
    a.click();
  }
}
const REQK = "htf_requests";
const getR = () => {
  try {
    return JSON.parse(localStorage.getItem(REQK)) || [];
  } catch (e) {
    return [];
  }
};
const setR = (r) => {
  try {
    localStorage.setItem(REQK, JSON.stringify(r));
  } catch (e) {}
};
function renderReqs() {
  const box = $("reqCard"),
    admin = me().role === "admin";
  box.style.display = admin ? "" : "none";
  if (!admin) return;
  const R = getR(),
    P = R.filter((r) => r.status === "pending"),
    A = R.filter((r) => r.status === "approved")
      .slice(-5)
      .reverse();
  const taken = new Set(S.orgs.map((o) => (o.user || "").toLowerCase()));
  const sugg = (role) => {
    const base = role === "donor" ? "DonorCodeVerse" : "RecipientCodeVerse";
    let n = 1,
      c = base;
    while (taken.has(c.toLowerCase())) c = base + ++n;
    taken.add(c.toLowerCase());
    return c;
  };
  box.innerHTML =
    `<h3 style="margin-bottom:6px">Signup requests (${P.length} pending)</h3>` +
    (P.length
      ? P.map(
          (
            r,
          ) => `<div class="req"><div><b>${esc(r.name)}</b> <span class="ok">${esc(r.role === "donor" ? "Donor" : r.type)}</span>
      <p>📍 ${esc(r.area)} · 📞 ${esc(r.phone)} · ✉ ${esc(r.email)}</p><p>Requested ${esc(r.time)}</p></div>
      <div class="acts"><input class="rid" data-r="${r.id}" value="${esc(sugg(r.role))}" aria-label="Login ID for ${esc(r.name)}">
      <button class="btn s" data-ra="ok" data-r="${r.id}">Approve</button><button class="btn d s" data-ra="no" data-r="${r.id}">Reject</button></div></div>`,
        ).join("")
      : `<p class="empty" style="padding:14px">No pending requests.</p>`) +
    (A.length
      ? `<h3 style="margin:14px 0 4px;font-size:.95rem">Recently approved</h3>` +
        A.map((r) => {
          const body = encodeURIComponent(
            `Hi ${r.name},\n\nYour HandsThatFeed profile was approved by the admin. You can now log in with your Login ID (${r.user}), Gmail or phone number, and the password you chose at signup.`,
          );
          return `<div class="req"><span>${esc(r.name)} · ${esc(r.user)}</span><a class="link" href="mailto:${esc(r.email)}?subject=${encodeURIComponent("Your HandsThatFeed profile is approved")}&body=${body}">Email them</a></div>`;
        }).join("")
      : "");
}
function render() {
  expire();
  save();
  const cs = $("fCat");
  if (cs.options.length === 1)
    Object.keys(CATS).forEach((c) => cs.add(new Option(c, c)));
  renderTabs();
  renderHome();
  renderItems();
  renderPost();
  renderOrgs();
  renderReqs();
  renderImpact();
  renderNotes();
}

$("tabs").onclick = (e) => {
  const b = e.target.closest("button");
  if (b) go(b.dataset.t);
};
$("logout").onclick = () => {
  try {
    localStorage.removeItem(SESS);
  } catch (e) {}
  location.href = "login.html";
};
["fStatus", "fCat"].forEach((i) => ($(i).onchange = renderItems));
$("fSearch").oninput = renderItems;
$("iType").onchange = renderImpact;
$("read").onclick = () => {
  myNotes().forEach((n) => (n.read = true));
  render();
};
$("postBox").onsubmit = (e) => {
  e.preventDefault();
  const v = (id) => $(id).value.trim();
  if (v("dExp") < today()) return toast("Expiry must be today or later");
  S.items.unshift({
    id: uid(),
    donor: v("dDonor"),
    cat: v("dCat"),
    item: v("dItem"),
    qty: v("dQty"),
    unit: v("dUnit"),
    expiry: v("dExp"),
    addr: v("dAddr"),
    status: "Available",
    rec: null,
  });
  notify(`New donation: ${v("dItem")} (${v("dQty")} ${v("dUnit")}).`);
  toast("Donation posted!");
  go("list");
};
$("orgForm").onsubmit = (e) => {
  e.preventDefault();
  const v = (id) => $(id).value.trim(),
    o = {
      id: uid(),
      name: v("oName"),
      role: v("oRole"),
      phone: v("oPhone"),
      email: v("oEmail").toLowerCase(),
      area: v("oArea"),
      user: v("oUser"),
      pw: $("oPw").value,
      type: v("oRole") === "recipient" ? v("oType") : "",
      verified: true,
    };
  const dup =
    o.user.toLowerCase() === "codeverse" ||
    S.orgs.some(
      (x) =>
        (x.user || "").toLowerCase() === o.user.toLowerCase() ||
        x.email === o.email ||
        x.phone === o.phone,
    );
  if (dup) return toast("Login ID, email or phone is already used");
  S.orgs.push(o);
  notify(`${o.name} registered as ${o.role} and was added by admin.`);
  e.target.reset();
  toast("Profile created. Excel file downloaded.");
  exportCreds();
  render();
};
$("items").onclick = (e) => {
  const b = e.target.closest("button[data-a]");
  if (!b) return;
  const it = S.items.find((i) => i.id === b.dataset.id),
    a = b.dataset.a;
  if (!it) return;
  if (a === "req") {
    it.rec = S.me;
    it.status = "Requested";
    notify(`${org(S.me).name} requested “${it.item}”.`, it.donor);
  }
  if (a === "auto") {
    const dA = (org(it.donor) || {}).area,
      rs = S.orgs.filter((o) => o.role === "recipient" && o.verified);
    if (!rs.length) return toast("No verified recipients");
    const r = rs.find((o) => o.area === dA) || rs[0];
    it.rec = r.id;
    it.status = "Matched";
    notify(`“${it.item}” matched with ${r.name}.`);
    notify(`You were matched with “${it.item}”.`, r.id);
  }
  if (a === "ok") {
    it.status = "Matched";
    notify(`Your request for “${it.item}” was approved.`, it.rec);
  }
  if (a === "no") {
    notify(`Your request for “${it.item}” was declined.`, it.rec);
    it.rec = null;
    it.status = "Available";
  }
  if (a === "done") {
    it.status = "Completed";
    it.done = today();
    notify(`“${it.item}” was picked up. Thank you!`);
  }
  if (a === "del") {
    if (!confirm("Delete this listing?")) return;
    S.items = S.items.filter((x) => x !== it);
  }
  render();
};
$("orgList").onclick = (e) => {
  const b = e.target.closest("[data-v]");
  if (!b) return;
  const o = org(b.dataset.v);
  o.verified = !o.verified;
  notify(
    `Your profile is now ${o.verified ? "verified" : "unverified"}.`,
    o.id,
  );
  render();
};
$("reqCard").onclick = (e) => {
  const b = e.target.closest("[data-ra]");
  if (!b) return;
  const rs = getR(),
    r = rs.find((x) => x.id === b.dataset.r);
  if (!r || r.status !== "pending") return;
  if (b.dataset.ra === "no") {
    if (!confirm("Reject this request?")) return;
    r.status = "rejected";
    setR(rs);
    toast("Request rejected");
    render();
    return;
  }
  const idv = document.querySelector(`.rid[data-r="${r.id}"]`).value.trim();
  if (!idv) return toast("Enter a login ID");
  if (
    idv.toLowerCase() === "codeverse" ||
    S.orgs.some(
      (o) =>
        (o.user || "").toLowerCase() === idv.toLowerCase() ||
        o.email === r.email ||
        o.phone === r.phone,
    )
  )
    return toast("Login ID, email or phone is already used");
  const o = {
    id: uid(),
    name: r.name,
    role: r.role,
    type: r.type || "",
    area: r.area,
    phone: r.phone,
    email: r.email,
    user: idv,
    pw: r.pw,
    verified: true,
  };
  S.orgs.push(o);
  r.status = "approved";
  r.user = idv;
  setR(rs);
  notify(`Welcome ${o.name}! Your profile was approved by admin.`, o.id);
  toast("Approved. Excel file downloaded.");
  exportCreds();
  render();
};
$("xl").onclick = exportCreds;
$("csv").onclick = () => {
  const q = (s) => `"${String(s).replace(/"/g, '""')}"`,
    rows = [
      [
        "Item",
        "Category",
        "Qty",
        "Unit",
        "Donor",
        "Recipient",
        "Expiry",
        "Status",
      ],
    ].concat(
      S.items.map((i) => [
        i.item,
        i.cat,
        i.qty,
        i.unit,
        (org(i.donor) || {}).name || "",
        ((i.rec && org(i.rec)) || {}).name || "",
        i.expiry,
        i.status,
      ]),
    );
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([rows.map((r) => r.map(q).join(",")).join("\n")], {
      type: "text/csv",
    }),
  );
  a.download = "donations-report.csv";
  a.click();
};
render();
