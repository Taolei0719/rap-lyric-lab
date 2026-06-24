const Engine = window.RapLyricEngine;
const STORAGE_KEY = Engine.STORAGE_KEY;
const ACCOUNT_STORAGE_KEY = "rapLyricLab.localAccounts.v1";
const SESSION_STORAGE_KEY = "rapLyricLab.activeAccount.v1";
const HISTORY_LIMIT = 8;
const MAX_TRAINING_CHARS = 60000;
const MAX_COVER_BYTES = 2 * 1024 * 1024;
const ALLOWED_COVER_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
let rapperProfiles = loadRapperProfiles();
let pendingCoverDataUrl = "";
let activeAccountId = loadActiveAccountId();
let currentDraft = null;
let backendOnline = false;
let backendUser = null;

if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

const els = {
  accountInput: document.querySelector("#accountInput"),
  passwordInput: document.querySelector("#passwordInput"),
  loginButton: document.querySelector("#loginButton"),
  logoutButton: document.querySelector("#logoutButton"),
  accountBadge: document.querySelector("#accountBadge"),
  backendBadge: document.querySelector("#backendBadge"),
  authStatus: document.querySelector("#authStatus"),
  rapperSelect: document.querySelector("#rapperSelect"),
  rapperChipGroup: document.querySelector("#rapperChipGroup"),
  albumSelect: document.querySelector("#albumSelect"),
  albumChipGroup: document.querySelector("#albumChipGroup"),
  localRapperInput: document.querySelector("#localRapperInput"),
  localAlbumInput: document.querySelector("#localAlbumInput"),
  coverInput: document.querySelector("#coverInput"),
  coverPreview: document.querySelector("#coverPreview"),
  moodSelect: document.querySelector("#moodSelect"),
  themeInput: document.querySelector("#themeInput"),
  keywordInput: document.querySelector("#keywordInput"),
  localKeywordsInput: document.querySelector("#localKeywordsInput"),
  lineCountInput: document.querySelector("#lineCountInput"),
  mixSelect: document.querySelector("#mixSelect"),
  explicitInput: document.querySelector("#explicitInput"),
  hookInput: document.querySelector("#hookInput"),
  rhymeInput: document.querySelector("#rhymeInput"),
  rhymeButton: document.querySelector("#rhymeButton"),
  rhymeToKeywordButton: document.querySelector("#rhymeToKeywordButton"),
  rhymeKeyBadge: document.querySelector("#rhymeKeyBadge"),
  rhymeResults: document.querySelector("#rhymeResults"),
  explicitValue: document.querySelector("#explicitValue"),
  hookValue: document.querySelector("#hookValue"),
  generateButton: document.querySelector("#generateButton"),
  randomizeButton: document.querySelector("#randomizeButton"),
  copyButton: document.querySelector("#copyButton"),
  exportButton: document.querySelector("#exportButton"),
  reviewScore: document.querySelector("#reviewScore"),
  reviewSummary: document.querySelector("#reviewSummary"),
  reviewChecks: document.querySelector("#reviewChecks"),
  clearHistoryButton: document.querySelector("#clearHistoryButton"),
  historyList: document.querySelector("#historyList"),
  learnButton: document.querySelector("#learnButton"),
  clearTrainingButton: document.querySelector("#clearTrainingButton"),
  removeLocalButton: document.querySelector("#removeLocalButton"),
  trainingInput: document.querySelector("#trainingInput"),
  trainingStatus: document.querySelector("#trainingStatus"),
  activeRapperBadge: document.querySelector("#activeRapperBadge"),
  outputTitle: document.querySelector("#outputTitle"),
  lyricsOutput: document.querySelector("#lyricsOutput"),
  cadenceMeter: document.querySelector("#cadenceMeter"),
  energyMeter: document.querySelector("#energyMeter"),
  toneMeter: document.querySelector("#toneMeter")
};

function scopedStorageKey(accountId = activeAccountId) {
  return accountId === "guest" ? STORAGE_KEY : `${STORAGE_KEY}.${accountId}`;
}

function historyStorageKey(accountId = activeAccountId) {
  return `rapLyricLab.history.v1.${accountId || "guest"}`;
}

function loadAccounts() {
  try {
    return JSON.parse(window.localStorage.getItem(ACCOUNT_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveAccounts(accounts) {
  window.localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accounts));
}

function loadActiveAccountId() {
  return window.localStorage.getItem(SESSION_STORAGE_KEY) || "guest";
}

function setActiveAccount(accountId) {
  activeAccountId = accountId || "guest";
  window.localStorage.setItem(SESSION_STORAGE_KEY, activeAccountId);
  rapperProfiles = loadRapperProfiles();
  renderRapperOptions();
  renderAccountStatus();
  updateRapperStatus();
  generateLyrics();
}

function accountDisplayName(accountId = activeAccountId) {
  if (accountId === "guest") return "访客";
  const account = loadAccounts()[accountId];
  return account?.displayName || accountId.replace(/^local_/, "");
}

async function hashPassword(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function randomSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex) {
  const clean = String(hex || "").replace(/[^a-f0-9]/gi, "");
  const bytes = new Uint8Array(Math.floor(clean.length / 2));
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

async function hashPasswordPbkdf2(password, saltHex) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: hexToBytes(saltHex),
      iterations: 120000
    },
    keyMaterial,
    256
  );
  return [...new Uint8Array(bits)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function accountIdFromName(name, prefix = "local") {
  const cleaned = String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 32);
  return `${prefix}_${cleaned || Date.now().toString(36)}`;
}

function loadRapperProfiles() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(scopedStorageKey()) || "null");
    return Engine.mergeSavedProfiles(saved);
  } catch {
    return Engine.cloneProfiles();
  }
}

function saveRapperProfiles() {
  window.localStorage.setItem(scopedStorageKey(), JSON.stringify(rapperProfiles));
}

function loadHistory() {
  try {
    return JSON.parse(window.localStorage.getItem(historyStorageKey()) || "[]");
  } catch {
    return [];
  }
}

function saveHistory(items) {
  window.localStorage.setItem(historyStorageKey(), JSON.stringify(items.slice(0, HISTORY_LIMIT)));
}

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    headers: {
      "content-type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "请求失败。");
  return payload;
}

async function detectBackend() {
  try {
    await apiRequest("/api/health", { method: "GET", headers: {} });
    backendOnline = true;
  } catch {
    backendOnline = false;
  }
  renderBackendStatus();
}

function renderBackendStatus() {
  els.backendBadge.textContent = backendOnline ? "数据库在线" : "本地模式";
  els.backendBadge.classList.toggle("is-online", backendOnline);
}

async function loadBackendSession() {
  if (!backendOnline) return;
  try {
    const session = await apiRequest("/api/me", { method: "GET", headers: {} });
    backendUser = session.user;
    if (session.authenticated && backendUser) {
      activeAccountId = `server_${backendUser.username}`;
      window.localStorage.setItem(SESSION_STORAGE_KEY, activeAccountId);
      const savedProfiles = await apiRequest("/api/profiles", { method: "GET", headers: {} });
      rapperProfiles = Engine.mergeSavedProfiles(savedProfiles.profiles);
      const savedHistory = await apiRequest("/api/history", { method: "GET", headers: {} });
      saveHistory(savedHistory.items || []);
    }
  } catch {
    backendUser = null;
  }
}

async function syncProfilesToBackend() {
  if (!backendOnline || !backendUser) return;
  try {
    await apiRequest("/api/profiles", {
      method: "PUT",
      body: JSON.stringify({ profiles: rapperProfiles })
    });
  } catch {
    backendOnline = false;
    renderBackendStatus();
  }
}

async function syncHistoryItemToBackend(item) {
  if (!backendOnline || !backendUser) return;
  try {
    await apiRequest("/api/history", {
      method: "POST",
      body: JSON.stringify(item)
    });
  } catch {
    backendOnline = false;
    renderBackendStatus();
  }
}

async function clearBackendHistory() {
  if (!backendOnline || !backendUser) return;
  try {
    await apiRequest("/api/history", { method: "DELETE", headers: {} });
  } catch {
    backendOnline = false;
    renderBackendStatus();
  }
}

function activeRapperKey() {
  return rapperProfiles[els.rapperSelect.value] ? els.rapperSelect.value : "asen";
}

function activeRapper() {
  return rapperProfiles[activeRapperKey()] || rapperProfiles.asen;
}

function activeAlbumKey() {
  const albums = Engine.ensureAlbumStyles(activeRapper());
  return albums[els.albumSelect.value] ? els.albumSelect.value : "general";
}

function activeAlbum() {
  const albums = Engine.ensureAlbumStyles(activeRapper());
  return albums[activeAlbumKey()] || albums.general;
}

function makeLocalKey(prefix, name) {
  const cleaned = String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 32);
  return `${prefix}_${cleaned || Date.now().toString(36)}`;
}

function localAlbumTemplate(label, cover = "") {
  return {
    label,
    cover,
    themeHint: "",
    aliases: [label],
    nouns: [],
    verbs: [],
    hooks: [],
    images: [],
    keywords: [],
    learned: Engine.emptyBank()
  };
}

function renderRapperOptions(selectedKey = "asen") {
  els.rapperSelect.replaceChildren();
  els.rapperChipGroup.replaceChildren();
  for (const { key, label } of Engine.listRappers(rapperProfiles)) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = label;
    els.rapperSelect.append(option);

    const chip = document.createElement("button");
    chip.className = "rapper-chip";
    chip.type = "button";
    chip.dataset.rapperKey = key;
    chip.textContent = label;
    chip.addEventListener("click", () => selectRapper(key));
    els.rapperChipGroup.append(chip);
  }
  els.rapperSelect.value = rapperProfiles[selectedKey] ? selectedKey : "asen";
  renderAlbumOptions();
  syncRapperChips();
}

async function loginWithPassword() {
  const username = els.accountInput.value.trim();
  const password = els.passwordInput.value;
  if (!username || !password) {
    els.authStatus.textContent = "请输入账号和密码。";
    return;
  }
  if (backendOnline) {
    try {
      const result = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password })
      });
      backendUser = result.user;
      activeAccountId = `server_${backendUser.username}`;
      window.localStorage.setItem(SESSION_STORAGE_KEY, activeAccountId);
      const savedProfiles = await apiRequest("/api/profiles", { method: "GET", headers: {} });
      rapperProfiles = Engine.mergeSavedProfiles(savedProfiles.profiles);
      const savedHistory = await apiRequest("/api/history", { method: "GET", headers: {} });
      saveHistory(savedHistory.items || []);
      els.passwordInput.value = "";
      renderRapperOptions();
      renderAccountStatus();
      updateRapperStatus();
      renderHistory();
      generateLyrics();
      els.authStatus.textContent = `${username} 已登录，素材和历史会保存到 SQLite 数据库。`;
      return;
    } catch (error) {
      els.authStatus.textContent = error.message || "后端登录失败，已保留本地模式。";
      return;
    }
  }
  const accounts = loadAccounts();
  const accountId = accountIdFromName(username);
  const existingAccount = accounts[accountId];
  let salt = existingAccount?.passwordSalt || randomSalt();
  let passwordHash = await hashPasswordPbkdf2(password, salt);

  if (existingAccount) {
    const legacyHash = existingAccount.passwordHash && !existingAccount.passwordSalt
      ? await hashPassword(password)
      : "";
    const matchesModern = existingAccount.passwordSalt && existingAccount.passwordHash === passwordHash;
    const matchesLegacy = legacyHash && existingAccount.passwordHash === legacyHash;
    if (!matchesModern && !matchesLegacy) {
      els.authStatus.textContent = "密码不正确。";
      return;
    }
    if (matchesLegacy) {
      salt = randomSalt();
      passwordHash = await hashPasswordPbkdf2(password, salt);
    }
  }
  accounts[accountId] = {
    type: "password",
    displayName: username,
    passwordAlgo: "PBKDF2-SHA256",
    passwordSalt: salt,
    passwordHash,
    updatedAt: new Date().toISOString()
  };
  saveAccounts(accounts);
  els.passwordInput.value = "";
  setActiveAccount(accountId);
  els.authStatus.textContent = `${username} 已登录，本地素材库已切换。`;
}

function logout() {
  if (backendOnline && backendUser) {
    apiRequest("/api/auth/logout", { method: "POST", body: "{}" }).catch(() => {});
  }
  backendUser = null;
  setActiveAccount("guest");
  els.authStatus.textContent = "已退出，当前使用访客本地素材库。";
}

function renderAccountStatus() {
  const name = backendUser?.displayName || accountDisplayName();
  els.accountBadge.textContent = name;
  if (activeAccountId === "guest") {
    els.authStatus.textContent = backendOnline ? "后端数据库已连接。登录后会保存到 SQLite。" : "未登录时使用访客本地素材库。";
  } else if (backendUser) {
    els.authStatus.textContent = `${name} 的素材库和历史会保存到 SQLite 数据库。`;
  } else {
    els.authStatus.textContent = `${name} 的素材库仅保存在本机浏览器。`;
  }
}

function renderAlbumOptions(selectedKey = "general") {
  const albums = Engine.listAlbums(rapperProfiles, activeRapperKey());
  els.albumSelect.replaceChildren();
  els.albumChipGroup.replaceChildren();
  for (const album of albums) {
    const option = document.createElement("option");
    option.value = album.key;
    option.textContent = album.label;
    els.albumSelect.append(option);

    const chip = document.createElement("button");
    chip.className = album.cover ? "album-card" : "album-card album-card--plain";
    chip.type = "button";
    chip.dataset.albumKey = album.key;
    chip.setAttribute("aria-label", `选择 ${album.label} 专辑风格`);
    if (album.cover) {
      const cover = document.createElement("img");
      cover.src = album.cover;
      cover.alt = `${album.label} 封面`;
      cover.loading = "lazy";
      chip.append(cover);
    } else {
      const placeholder = document.createElement("span");
      placeholder.className = "album-placeholder";
      placeholder.textContent = "Mix";
      chip.append(placeholder);
    }
    const label = document.createElement("span");
    label.className = "album-card-title";
    label.textContent = album.label;
    chip.append(label);
    chip.addEventListener("click", () => selectAlbum(album.key));
    els.albumChipGroup.append(chip);
  }
  els.albumSelect.value = albums.some((album) => album.key === selectedKey) ? selectedKey : "general";
  syncAlbumChips();
}

function selectRapper(key) {
  if (!rapperProfiles[key]) return;
  els.rapperSelect.value = key;
  els.trainingInput.value = "";
  renderAlbumOptions();
  updateRapperStatus();
  generateLyrics();
}

function selectAlbum(key) {
  const albums = Engine.ensureAlbumStyles(activeRapper());
  if (!albums[key]) return;
  els.albumSelect.value = key;
  if (albums[key].themeHint) els.themeInput.value = albums[key].themeHint;
  if (albums[key].keywords?.length) els.keywordInput.value = albums[key].keywords.join("、");
  els.trainingInput.value = "";
  updateRapperStatus();
  generateLyrics();
}

function syncRapperChips() {
  for (const chip of els.rapperChipGroup.querySelectorAll(".rapper-chip")) {
    chip.classList.toggle("is-active", chip.dataset.rapperKey === activeRapperKey());
  }
}

function syncAlbumChips() {
  for (const chip of els.albumChipGroup.querySelectorAll(".album-card")) {
    chip.classList.toggle("is-active", chip.dataset.albumKey === activeAlbumKey());
  }
}

function renderSelfReview(review) {
  if (!review) {
    els.reviewScore.textContent = "--";
    els.reviewSummary.textContent = "生成后会检查关键词贯穿、叙事走向、句式新鲜度和段落收束。";
    els.reviewChecks.replaceChildren();
    return;
  }
  els.reviewScore.textContent = `${review.score}`;
  els.reviewSummary.textContent = `${review.label} · ${review.arc}。${review.promise}${review.repaired ? " 已自动补过承接句。" : ""}`;
  els.reviewChecks.replaceChildren();
  for (const check of review.checks || []) {
    const item = document.createElement("div");
    item.className = check.ok ? "review-check is-ok" : "review-check is-warn";
    const status = document.createElement("span");
    status.className = "review-check-status";
    status.textContent = check.ok ? "OK" : "Fix";
    const text = document.createElement("span");
    text.textContent = `${check.label}：${check.detail}`;
    item.append(status, text);
    els.reviewChecks.append(item);
  }
}

function draftToHistoryItem(result) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: result.title,
    text: result.text,
    review: result.selfReview,
    createdAt: new Date().toISOString(),
    rapper: activeRapper().label,
    album: activeAlbum().label,
    keyword: els.keywordInput.value.trim(),
    theme: els.themeInput.value.trim()
  };
}

function rememberDraft(result) {
  const item = draftToHistoryItem(result);
  const history = loadHistory().filter((saved) => saved.text !== item.text);
  saveHistory([item, ...history]);
  renderHistory();
  syncHistoryItemToBackend(item);
}

function renderHistory() {
  const history = loadHistory();
  els.historyList.replaceChildren();
  if (!history.length) {
    const empty = document.createElement("p");
    empty.className = "status";
    empty.textContent = "还没有历史记录。生成后会自动保存最近 8 次草稿在当前账号本地。";
    els.historyList.append(empty);
    return;
  }
  for (const item of history) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "history-item";
    const title = document.createElement("strong");
    title.textContent = item.title;
    const meta = document.createElement("span");
    const time = new Date(item.createdAt);
    meta.textContent = `${Number.isNaN(time.getTime()) ? "" : time.toLocaleString("zh-CN", { hour12: false })} · ${item.keyword || item.theme || "自由主题"} · 自审 ${item.review?.score || "--"}`;
    button.append(title, meta);
    button.addEventListener("click", () => {
      currentDraft = item;
      els.lyricsOutput.textContent = item.text;
      els.outputTitle.textContent = item.title;
      renderSelfReview(item.review);
    });
    els.historyList.append(button);
  }
}

function generateLyrics(options = {}) {
  const shouldRemember = Boolean(options.remember);
  const result = Engine.generateLyrics({
    profiles: rapperProfiles,
    rapperKey: activeRapperKey(),
    albumKey: activeAlbumKey(),
    styleKey: "auto",
    moodKey: els.moodSelect.value,
    themeText: els.themeInput.value,
    keywordText: els.keywordInput.value,
    lineCount: Number.parseInt(els.lineCountInput.value, 10),
    explicit: Number.parseInt(els.explicitInput.value, 10),
    hookRepeats: Number.parseInt(els.hookInput.value, 10),
    mix: els.mixSelect.value
  });

  currentDraft = result;
  els.lyricsOutput.textContent = result.text;
  els.outputTitle.textContent = result.title;
  els.cadenceMeter.textContent = result.cadence;
  els.energyMeter.textContent = `能量 ${result.energy}`;
  els.toneMeter.textContent = result.tone;
  renderSelfReview(result.selfReview);
  if (shouldRemember) rememberDraft(result);
}

function learnFromInput() {
  const raw = els.trainingInput.value.trim();
  const rawRapperName = els.localRapperInput.value.trim();
  const rawAlbumName = els.localAlbumInput.value.trim();
  const rawKeywords = els.localKeywordsInput.value.trim();
  if (!raw) {
    els.trainingStatus.textContent = "没有可学习的文本。";
    return;
  }
  if (raw.length > MAX_TRAINING_CHARS) {
    els.trainingStatus.textContent = `歌词文本太长，请控制在 ${MAX_TRAINING_CHARS.toLocaleString("zh-CN")} 字以内。`;
    return;
  }
  const rapperKey = rawRapperName ? findOrCreateLocalRapper(rawRapperName) : activeRapperKey();
  const albumKey = rawAlbumName || pendingCoverDataUrl ? findOrCreateLocalAlbum(rapperKey, rawAlbumName || "我的本地风格") : activeAlbumKey();
  const rapper = rapperProfiles[rapperKey];
  const album = Engine.ensureAlbumStyles(rapper)[albumKey];

  album.learned = Engine.parseTrainingText(raw);
  album.keywords = Engine.normalizeKeywords(rawKeywords || els.keywordInput.value);
  if (pendingCoverDataUrl) album.cover = pendingCoverDataUrl;
  if (rawAlbumName) album.themeHint = rawAlbumName;
  saveRapperProfiles();
  syncProfilesToBackend();
  renderRapperOptions(rapperKey);
  els.albumSelect.value = albumKey;
  renderAlbumOptions(albumKey);
  els.keywordInput.value = album.keywords.join("、");
  updateRapperStatus();
  els.trainingStatus.textContent = `${rapper.label} / ${album.label}：已保存到你的本地素材库，学习 ${album.learned.fragments.length} 行，提取 ${album.learned.hooks.length} 条 hook 候选、${album.learned.images.length} 条意象。`;
  generateLyrics();
}

function clearTraining() {
  const rapper = activeRapper();
  const album = activeAlbum();
  album.learned = Engine.emptyBank();
  if (!Engine.isBuiltInAlbum(activeRapperKey(), activeAlbumKey())) {
    album.cover = "";
  }
  saveRapperProfiles();
  syncProfilesToBackend();
  els.trainingInput.value = "";
  pendingCoverDataUrl = "";
  els.coverInput.value = "";
  renderCoverPreview("");
  renderAlbumOptions(activeAlbumKey());
  els.trainingStatus.textContent = `${rapper.label} / ${album.label}：已清空当前本地素材。`;
  generateLyrics();
}

function removeCurrentLocalItem() {
  const rapperKey = activeRapperKey();
  const albumKey = activeAlbumKey();
  const rapper = activeRapper();
  const album = activeAlbum();

  if (!Engine.isBuiltInRapper(rapperKey)) {
    delete rapperProfiles[rapperKey];
    saveRapperProfiles();
    syncProfilesToBackend();
    renderRapperOptions("asen");
    updateRapperStatus();
    generateLyrics();
    els.trainingStatus.textContent = `已移除本地歌手 ${rapper.label}。`;
    return;
  }

  if (!Engine.isBuiltInAlbum(rapperKey, albumKey) && albumKey !== "general") {
    delete Engine.ensureAlbumStyles(rapper)[albumKey];
    saveRapperProfiles();
    syncProfilesToBackend();
    renderAlbumOptions("general");
    updateRapperStatus();
    generateLyrics();
    els.trainingStatus.textContent = `已移除本地专辑 / 风格 ${album.label}。`;
    return;
  }

  els.trainingStatus.textContent = "当前是内置歌手或内置专辑，不能移除。";
}

function findOrCreateLocalRapper(name) {
  const existing = Object.entries(rapperProfiles).find(([, profile]) => profile.label === name);
  if (existing) return existing[0];
  let key = makeLocalKey("local_rapper", name);
  while (rapperProfiles[key]) key = `local_rapper_${Date.now().toString(36)}`;
  rapperProfiles[key] = Engine.createRapperProfile(name);
  return key;
}

function findOrCreateLocalAlbum(rapperKey, name) {
  const rapper = rapperProfiles[rapperKey] || activeRapper();
  const albums = Engine.ensureAlbumStyles(rapper);
  const existing = Object.entries(albums).find(([, album]) => album.label === name);
  if (existing) return existing[0];
  let key = makeLocalKey("local_album", name);
  while (albums[key]) key = `local_album_${Date.now().toString(36)}`;
  albums[key] = localAlbumTemplate(name, pendingCoverDataUrl);
  return key;
}

function updateRapperStatus() {
  const rapper = activeRapper();
  const album = activeAlbum();
  const learned = album.learned || Engine.emptyBank();
  els.activeRapperBadge.textContent = `${rapper.label} / ${album.label}`;
  syncRapperChips();
  syncAlbumChips();
  if (learned.fragments.length) {
    els.trainingStatus.textContent = `${rapper.label} / ${album.label}：已学习 ${learned.fragments.length} 行，可继续覆盖更新。`;
  } else {
    els.trainingStatus.textContent = `${rapper.label} / ${album.label}：未导入额外训练文本。`;
  }
}

function randomize() {
  const preset = Engine.randomPreset();
  els.moodSelect.value = preset.moodKey;
  els.themeInput.value = preset.themeText;
  els.keywordInput.value = "";
  els.lineCountInput.value = String(preset.lineCount);
  els.mixSelect.value = preset.mix;
  els.explicitInput.value = String(preset.explicit);
  els.hookInput.value = String(preset.hookRepeats);
  syncRangeLabels();
  generateLyrics({ remember: true });
}

function syncRangeLabels() {
  els.explicitValue.textContent = els.explicitInput.value;
  els.hookValue.textContent = els.hookInput.value;
}

async function copyLyrics() {
  const text = els.lyricsOutput.textContent.trim();
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    els.copyButton.textContent = "复制失败";
    window.setTimeout(() => {
      els.copyButton.textContent = "复制";
    }, 1200);
    return;
  }
  const old = els.copyButton.textContent;
  els.copyButton.textContent = "已复制";
  window.setTimeout(() => {
    els.copyButton.textContent = old;
  }, 1200);
}

function slugifyFileName(value) {
  return String(value || "rap-lyrics")
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "rap-lyrics";
}

function exportMarkdown() {
  const text = els.lyricsOutput.textContent.trim();
  if (!text) return;
  const review = currentDraft?.selfReview || currentDraft?.review;
  const checks = review?.checks?.map((check) => `- ${check.ok ? "[x]" : "[ ]"} ${check.label}: ${check.detail}`).join("\n") || "- 未记录";
  const markdown = [
    `# ${els.outputTitle.textContent || "Rap Lyric Draft"}`,
    "",
    "## Meta",
    "",
    `- Rapper: ${activeRapper().label}`,
    `- Album/Style: ${activeAlbum().label}`,
    `- Theme: ${els.themeInput.value.trim() || "未填写"}`,
    `- Keyword: ${els.keywordInput.value.trim() || "未填写"}`,
    `- Mood: ${els.moodSelect.selectedOptions[0]?.textContent || els.moodSelect.value}`,
    `- Generated At: ${new Date().toLocaleString("zh-CN", { hour12: false })}`,
    "",
    "## Self Review",
    "",
    `- Score: ${review?.score || "--"}`,
    `- Result: ${review?.label || "未记录"}`,
    `- Arc: ${review?.arc || "未记录"}`,
    "",
    checks,
    "",
    "## Lyrics",
    "",
    "```text",
    text,
    "```",
    ""
  ].join("\n");
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slugifyFileName(els.outputTitle.textContent)}.md`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  const old = els.exportButton.textContent;
  els.exportButton.textContent = "已导出";
  window.setTimeout(() => {
    els.exportButton.textContent = old;
  }, 1200);
}

function clearHistory() {
  saveHistory([]);
  renderHistory();
  clearBackendHistory();
}

els.moodSelect.replaceChildren();
for (const { key, label } of Engine.listMoods()) {
  const option = document.createElement("option");
  option.value = key;
  option.textContent = label;
  els.moodSelect.append(option);
}

function renderCoverPreview(src) {
  els.coverPreview.replaceChildren();
  if (src) {
    const image = document.createElement("img");
    image.src = src;
    image.alt = "本地封面预览";
    els.coverPreview.append(image);
  } else {
    const text = document.createElement("span");
    text.textContent = "本地封面";
    els.coverPreview.append(text);
  }
}

function handleCoverInput() {
  const file = els.coverInput.files?.[0];
  if (!file) {
    pendingCoverDataUrl = "";
    renderCoverPreview("");
    return;
  }
  if (!ALLOWED_COVER_TYPES.has(file.type)) {
    els.trainingStatus.textContent = "请选择 JPG、PNG、WebP 或 GIF 图片。";
    els.coverInput.value = "";
    return;
  }
  if (file.size > MAX_COVER_BYTES) {
    els.trainingStatus.textContent = "封面图片不能超过 2MB。";
    els.coverInput.value = "";
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    pendingCoverDataUrl = String(reader.result || "");
    renderCoverPreview(pendingCoverDataUrl);
  });
  reader.readAsDataURL(file);
}

function renderRhymeResults(result) {
  els.rhymeKeyBadge.textContent = result.label;
  els.rhymeResults.replaceChildren();
  const groups = [
    ["中文近韵", result.cn],
    ["英文近韵", result.en],
    ["句尾短语", result.phrases]
  ];
  for (const [label, items] of groups) {
    const block = document.createElement("div");
    block.className = "rhyme-group";
    const title = document.createElement("h3");
    title.textContent = label;
    block.append(title);
    const chips = document.createElement("div");
    chips.className = "rhyme-chip-group";
    for (const item of items) {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "rhyme-chip";
      chip.textContent = item;
      chip.addEventListener("click", () => {
        els.keywordInput.value = item;
        generateLyrics();
      });
      chips.append(chip);
    }
    block.append(chips);
    els.rhymeResults.append(block);
  }
}

function generateRhymeResults() {
  const value = els.rhymeInput.value.trim() || els.keywordInput.value.trim();
  if (!value) {
    els.rhymeKeyBadge.textContent = "近韵";
    els.rhymeResults.textContent = "输入一个中文或英文词语。";
    return;
  }
  renderRhymeResults(Engine.generateRhymes(value));
}

function rhymeInputToKeyword() {
  const value = els.rhymeInput.value.trim();
  if (!value) return;
  els.keywordInput.value = value;
  generateLyrics();
}

els.loginButton.addEventListener("click", loginWithPassword);
els.logoutButton.addEventListener("click", logout);
els.generateButton.addEventListener("click", () => generateLyrics({ remember: true }));
els.randomizeButton.addEventListener("click", randomize);
els.copyButton.addEventListener("click", copyLyrics);
els.exportButton.addEventListener("click", exportMarkdown);
els.clearHistoryButton.addEventListener("click", clearHistory);
els.learnButton.addEventListener("click", learnFromInput);
els.clearTrainingButton.addEventListener("click", clearTraining);
els.removeLocalButton.addEventListener("click", removeCurrentLocalItem);
els.rhymeButton.addEventListener("click", generateRhymeResults);
els.rhymeToKeywordButton.addEventListener("click", rhymeInputToKeyword);
els.rhymeInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") generateRhymeResults();
});
els.coverInput.addEventListener("change", handleCoverInput);
els.explicitInput.addEventListener("input", syncRangeLabels);
els.hookInput.addEventListener("input", syncRangeLabels);
els.keywordInput.addEventListener("input", generateLyrics);
els.rapperSelect.addEventListener("change", () => {
  selectRapper(els.rapperSelect.value);
});
els.albumSelect.addEventListener("change", () => {
  selectAlbum(els.albumSelect.value);
});
els.moodSelect.addEventListener("change", generateLyrics);

async function bootstrap() {
  await detectBackend();
  await loadBackendSession();
  renderRapperOptions();
  renderCoverPreview("");
  renderAccountStatus();
  generateRhymeResults();
  updateRapperStatus();
  syncRangeLabels();
  renderHistory();
  generateLyrics();
}

bootstrap();
