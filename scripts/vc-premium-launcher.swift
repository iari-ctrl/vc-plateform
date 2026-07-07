// VC Premium Experience — lanceur natif.
// App AppKit + WKWebView : icône propre, fenêtre native (réduction/restauration correctes),
// indépendante de Chrome. Démarre `npm run dev` à l'ouverture, l'arrête à la fermeture.
//
// Compilation (voir scripts/build-launcher.sh) :
//   swiftc -O scripts/vc-premium-launcher.swift -framework Cocoa -framework WebKit \
//     -o "VC Premium Experience.app/Contents/MacOS/vc-premium"

import Cocoa
import WebKit

let appURLString = "http://localhost:5173/"
let logPath = "/tmp/vc-premium-dev.log"

// .../vc-platform/VC Premium Experience.app  →  parent = racine du dépôt
func projectDir() -> String {
    return Bundle.main.bundleURL.deletingLastPathComponent().path
}

// Une app au double-clic n'hérite pas du PATH terminal : node/npm = ~/.local/bin, lsof = /usr/sbin.
func serverEnv() -> [String: String] {
    var env = ProcessInfo.processInfo.environment
    let home = NSHomeDirectory()
    env["PATH"] = "\(home)/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin"
    return env
}

@discardableResult
func runShell(_ command: String) -> Int32 {
    let p = Process()
    p.executableURL = URL(fileURLWithPath: "/bin/bash")
    p.arguments = ["-c", command]
    p.environment = serverEnv()
    do { try p.run() } catch { return -1 }
    p.waitUntilExit()
    return p.terminationStatus
}

func portOpen(_ port: Int) -> Bool {
    return runShell("/usr/bin/nc -z localhost \(port) >/dev/null 2>&1") == 0
}

final class AppDelegate: NSObject, NSApplicationDelegate, NSWindowDelegate {
    var window: NSWindow!
    var webView: WKWebView!
    var serverProcess: Process?
    var startedServer = false
    var appLoaded = false

    func applicationDidFinishLaunching(_ note: Notification) {
        buildMenu()
        buildWindow()
        startServerIfNeeded()
        webView.loadHTMLString(splashHTML, baseURL: nil)
        schedulePoll()
        NSApp.activate(ignoringOtherApps: true)
    }

    func buildWindow() {
        webView = WKWebView(frame: NSRect(x: 0, y: 0, width: 1280, height: 840),
                            configuration: WKWebViewConfiguration())
        if #available(macOS 12.0, *) { webView.underPageBackgroundColor = NSColor(white: 0.055, alpha: 1) }
        window = NSWindow(contentRect: NSRect(x: 0, y: 0, width: 1280, height: 840),
                          styleMask: [.titled, .closable, .miniaturizable, .resizable],
                          backing: .buffered, defer: false)
        window.title = "VC Premium Experience"
        window.backgroundColor = NSColor(white: 0.055, alpha: 1)
        window.contentView = webView
        window.delegate = self
        window.setFrameAutosaveName("VCPremiumMainWindow")
        window.center()
        window.makeKeyAndOrderFront(nil)
    }

    func startServerIfNeeded() {
        if portOpen(5173) { return }   // déjà lancé ailleurs (terminal) → on n'y touche pas
        let p = Process()
        p.executableURL = URL(fileURLWithPath: "/bin/bash")
        p.arguments = ["-c", "exec npm run dev"]
        p.currentDirectoryURL = URL(fileURLWithPath: projectDir())
        p.environment = serverEnv()
        FileManager.default.createFile(atPath: logPath, contents: nil)
        if let fh = FileHandle(forWritingAtPath: logPath) {
            p.standardOutput = fh
            p.standardError = fh
        }
        do { try p.run(); serverProcess = p; startedServer = true } catch {}
    }

    func schedulePoll() {
        DispatchQueue.global(qos: .utility).async {
            let up = portOpen(5173)
            DispatchQueue.main.async {
                if up && !self.appLoaded {
                    self.appLoaded = true
                    self.webView.load(URLRequest(url: URL(string: appURLString)!))
                } else if !up {
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) { self.schedulePoll() }
                }
            }
        }
    }

    func stopServer() {
        guard startedServer else { return }
        startedServer = false
        if let p = serverProcess, p.isRunning { p.terminate() }
        // Filet de sécurité : tue ce qui écoute encore sur les deux ports (vite + tsx).
        runShell("for port in 5173 4000; do pids=$(/usr/sbin/lsof -ti tcp:$port 2>/dev/null); [ -n \"$pids\" ] && kill $pids 2>/dev/null; done")
    }

    // Cycle de vie
    func applicationShouldTerminateAfterLastWindowClosed(_ s: NSApplication) -> Bool { return true }
    func windowWillClose(_ n: Notification) { stopServer() }
    func applicationWillTerminate(_ n: Notification) { stopServer() }
    func applicationShouldHandleReopen(_ s: NSApplication, hasVisibleWindows flag: Bool) -> Bool {
        if window.isMiniaturized { window.deminiaturize(nil) }
        if !flag { window.makeKeyAndOrderFront(nil) }
        return true
    }

    @objc func reload() { if appLoaded { webView.reload() } }

    func buildMenu() {
        let main = NSMenu()

        let appItem = NSMenuItem(); main.addItem(appItem)
        let appMenu = NSMenu()
        appMenu.addItem(withTitle: "Recharger", action: #selector(reload), keyEquivalent: "r")
        appMenu.addItem(.separator())
        appMenu.addItem(withTitle: "Masquer", action: #selector(NSApplication.hide(_:)), keyEquivalent: "h")
        appMenu.addItem(withTitle: "Quitter VC Premium Experience",
                        action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        appItem.submenu = appMenu

        let editItem = NSMenuItem(); main.addItem(editItem)
        let editMenu = NSMenu(title: "Édition")
        editMenu.addItem(withTitle: "Annuler", action: Selector(("undo:")), keyEquivalent: "z")
        editMenu.addItem(withTitle: "Rétablir", action: Selector(("redo:")), keyEquivalent: "Z")
        editMenu.addItem(.separator())
        editMenu.addItem(withTitle: "Couper", action: #selector(NSText.cut(_:)), keyEquivalent: "x")
        editMenu.addItem(withTitle: "Copier", action: #selector(NSText.copy(_:)), keyEquivalent: "c")
        editMenu.addItem(withTitle: "Coller", action: #selector(NSText.paste(_:)), keyEquivalent: "v")
        editMenu.addItem(withTitle: "Tout sélectionner", action: #selector(NSText.selectAll(_:)), keyEquivalent: "a")
        editItem.submenu = editMenu

        NSApp.mainMenu = main
    }
}

let splashHTML = """
<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<style>
  :root { --accent:#D28236; --bg:#0e0e10; --fg:#f4f1ea; --muted:#8a857c; }
  html,body{height:100%;margin:0}
  body{background:var(--bg);color:var(--fg);font:15px/1.6 -apple-system,system-ui,sans-serif;
       display:flex;align-items:center;justify-content:center;-webkit-font-smoothing:antialiased}
  .box{text-align:center;padding:2rem}
  .spinner{width:38px;height:38px;margin:0 auto 1.6rem;border:3px solid rgba(244,241,234,.15);
           border-top-color:var(--accent);border-radius:50%;animation:spin .9s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  @media (prefers-reduced-motion:reduce){.spinner{animation-duration:2.4s}}
  h1{font-size:1.05rem;font-weight:600;margin:0 0 .4rem}
  p{color:var(--muted);margin:.3rem 0 0}
  #hint{display:none;margin-top:1rem;font-size:13px}
  code{color:var(--fg)}
</style></head>
<body><div class="box">
  <div class="spinner"></div>
  <h1>VC Premium Experience</h1>
  <p>Démarrage du serveur de développement…</p>
  <p id="hint">Plus long que prévu — vérifie <code>/tmp/vc-premium-dev.log</code>.</p>
</div>
<script>setTimeout(function(){document.getElementById('hint').style.display='block';},12000);</script>
</body></html>
"""

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.regular)
app.run()
