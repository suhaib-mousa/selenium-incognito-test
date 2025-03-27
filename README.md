# 🚀 selenium-incognito-tool

**selenium-incognito-tool** is a lightweight and developer-friendly browser automation tool that opens a specified URL in **Google Chrome's incognito mode** using Selenium WebDriver.

It supports two powerful modes:

- 🧪 **QA Mode** – capture screenshots for visual testing  
- ⚡ **Performance Mode** – measure page load time with zero UI overhead

---

## 📦 Features

- Runs Chrome in **incognito** mode for clean, cache-free sessions
- Supports **headless mode** for speed and CI compatibility
- Flexible screenshot control: odd/even/every-N runs
- Auto-generates detailed **JSON reports**
- Easy to configure via `package.json`
- Pure Node.js – no extra CLI tools or GUIs required

---

## 🛠️ Setup

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/selenium-incognito-tool.git
cd selenium-incognito-tool
```

### 2. Install dependencies

```bash
npm install
```

### 3. Ensure Chrome is installed
This tool attempts to auto-detect the Chrome executable path by:

1. Checking config.chromePath in your package.json

1. Using the CHROME_PATH environment variable

1. Falling back to system-installed Chrome via chrome-launcher

You can explicitly define Chrome's path in your config or environment if needed.

---

## ⚙️ Configuration

```json
"config": {
  "url": "https://example.com",
  "times": 5,
  "delay": 1000,
  "headless": true,
  "mode": "qa",
  "chromePath": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", // optional
  "screenshot": {
    "pattern": "run-{index}.png",
    "condition": "every-2",
    "disabled": false
  }
}
```
> **💡 The chromePath field is optional. If omitted, the tool will try to detect Chrome automatically.**

### 🔍 Screenshot Behavior

| Mode     | Condition Respected | Notes |
|----------|---------------------|-------|
| `"qa"`   | ✅ Yes               | Screenshots follow `condition` rules (`odd`, `even`, `every-3`, etc.) |
| `"perf"` | ❌ No                | Screenshots are always skipped in performance mode |
| `"seo"`  | Not yet supported   | Reserved for future use |

**Conditions supported:**
- `"all"` → every run
- `"odd"` → 1st, 3rd, 5th...
- `"even"` → 2nd, 4th, 6th...
- `"every-N"` → every Nth run (e.g. `every-3`)
- `"none"` → skip all screenshots

If `"disabled": true`, all screenshots are skipped regardless of the condition or mode.


### 🔍 Explanation:

| Key               | Type      | Description |
|------------------|-----------|-------------|
| `url`            | string    | URL to open in browser |
| `times`          | number    | Number of runs (sessions) |
| `delay`          | number (ms) | Wait time before closing each session |
| `headless`       | boolean   | Run Chrome in headless mode |
| `mode`           | `"qa"` / `"perf"` | Operation mode |
| `chromePath`           | `string` (Optional) | Path to Chrome binary |
| `screenshot.pattern` | string | Filename format (use `{index}` as placeholder) |
| `screenshot.condition` | `"all"`, `"odd"`, `"even"`, `"every-N"` | When to take screenshots |
| `screenshot.disabled` | boolean | Completely disables screenshots |

---

## 🚦 Modes

### 🧪 `mode: "qa"`

- Takes screenshots.
- Best for visual testing or regression checks

### ⚡ `mode: "perf"`

- Only measures page load time
- No screenshots or metadata captured
- Fastest and lightest mode

---

## ▶️ Run the Tool

```bash
npm start
```

The tool will:
- Launch Chrome in incognito mode
- Open your configured URL
- Capture screenshots (if enabled)
- Measure load times
- Save everything into a `report.json`

---

## 📄 Output

Example `report.json`:

```json
[
  {
    "url": "https://example.com",
    "status": "success",
    "loadTimeMs": 1052,
    "screenshot": "run-1.png"
  },
  {
    "url": "https://example.com",
    "status": "success",
    "loadTimeMs": 990,
    "screenshot": null
  }
]
```

---

## 🧩 Use Cases

- QA teams testing landing pages and UI snapshots
- Performance testing on clean browser sessions
- Scheduled automation for checking page behavior
- Debugging redirects, CDNs, or A/B tests
- Smoke testing before deployment

---

## 🪪 License

MIT — free to use, modify, and share.

---

## 🙌 Contributing

Got a cool idea or want to improve it?  
Fork the repo, make your changes, and submit a pull request.

We welcome:
- Bug fixes
- Feature enhancements
- Documentation improvements
- New ideas for testing or automation use cases

Issues and discussions are also welcome!

---

Made with 🧠 and ☕ by [suhaib-mousa](https://github.com/suhaib-mousa)
