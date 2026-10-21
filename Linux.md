# Linux: The Operating System That Runs the Internet

Linux is a free and open-source operating system kernel first released by Linus Torvalds in 1991. Combined with the GNU userland tools, it forms the GNU/Linux operating system that powers the vast majority of servers, all Android phones, every top-500 supercomputer, most cloud infrastructure, and an increasing share of desktops. It is the single most important piece of software in modern computing that most people never think about.

## Why Linux Exists

In 1991, Linus Torvalds was a computer science student at the University of Helsinki. He wanted a Unix-like system he could run on his own PC — something better than the teaching version of MINIX he was using, but cheaper than the commercial UNIX workstations of the era.

He wrote a small kernel, posted it to a Usenet newsgroup with the now-famous message:

> "I'm doing a (free) operating system (just a hobby, won't be big and professional like gnu)..."

The rest is history. Combined with the GNU project's userland tools (which had been written since 1983 but lacked a kernel), Linux became the free Unix that Richard Stallman's GNU project had been aiming at for nearly a decade.

Key design choices that made Linux succeed:

- **Open source (GPLv2)** — anyone can read, modify, and redistribute.
- **POSIX-compatible** — programs written for Unix run on Linux.
- **Modular** — the kernel loads drivers as modules at runtime.
- **Portable** — runs on x86, ARM, RISC-V, MIPS, PowerPC, and more.
- **Community-driven** — thousands of contributors worldwide, coordinated by Torvalds and lieutenants.

## Linux vs GNU/Linux vs Distributions

Terminology matters here, because it causes endless confusion.

| Term | Meaning |
|------|---------|
| **Linux** | Strictly, the kernel |
| **GNU** | The userland tools (bash, coreutils, gcc, glibc) |
| **GNU/Linux** | Kernel + GNU userland (what most people call "Linux") |
| **Distribution (distro)** | A packaged, installable OS combining kernel + userland + package manager + defaults |

When someone says "I use Linux," they mean a distribution — Ubuntu, Fedora, Debian, Arch, etc. The kernel is one component of many.

## The Kernel

The Linux kernel is the core program that manages:

- **Processes** — scheduling, isolation, signals.
- **Memory** — virtual memory, paging, swapping.
- **Filesystems** — ext4, btrfs, xfs, zfs, etc.
- **Devices** — drivers for disks, network cards, GPUs, USB.
- **Networking** — TCP/IP stack, sockets, firewalls.
- **Security** — permissions, namespaces, cgroups, seccomp.

The kernel runs in **privileged mode** (kernel space); user programs run in **unprivileged mode** (user space). This separation is enforced by the CPU's memory management unit.

```
┌────────────────────────────────────────┐
│           User Space                   │
│  ┌───────┐ ┌───────┐ ┌───────┐        │
│  │ bash  │ │ nginx │ │  vim  │  ...   │
│  └───────┘ └───────┘ └───────┘        │
│                │                       │
│           System Calls                 │
│                │                       │
├────────────────┼───────────────────────┤
│           Kernel Space                 │
│  ┌──────────────────────────────────┐  │
│  │ Processes │ Memory │ Filesystems │  │
│  │ Network   │ Drivers│ Security    │  │
│  └──────────────────────────────────┘  │
├────────────────────────────────────────┤
│              Hardware                  │
└────────────────────────────────────────┘
```

Programs request kernel services via **system calls** — `read`, `write`, `open`, `fork`, `exec`, `mmap`, `socket`, and about 300 others.

## Distributions

A distribution bundles the kernel with a package manager, init system, desktop environment (optional), and curated software. There are hundreds of distros; most fall into a few families.

### Major Families

| Family | Package Manager | Representative Distros |
|--------|-----------------|------------------------|
| Debian | `apt` (.deb) | Debian, Ubuntu, Linux Mint, Pop!_OS |
| Red Hat | `dnf`/`yum` (.rpm) | Fedora, RHEL, CentOS Stream, Rocky, Alma |
| Arch | `pacman` | Arch, Manjaro, EndeavourOS |
| SUSE | `zypper` (.rpm) | openSUSE, SLES |
| Gentoo | `portage` (source) | Gentoo, Calculate |
| Independent | varies | Alpine (apk), NixOS (nix), Void, Slackware |

### Popular Choices

| Distro | Best for |
|--------|----------|
| **Ubuntu** | Beginners, servers, most third-party support |
| **Debian** | Stability, servers, the foundation of Ubuntu |
| **Fedora** | Latest features, upstream-first, developers |
| **Arch** | Learning Linux deeply, rolling release, DIY |
| **Linux Mint** | Windows converts, desktop users |
| **Pop!_OS** | Developers, NVIDIA users |
| **Alpine** | Containers, tiny footprint |
| **NixOS** | Reproducible, declarative configuration |
| **RHEL / Rocky / Alma** | Enterprise, long-term support |
| **openSUSE** | Enterprise, YaST, rolling (Tumbleweed) |

## Installation and First Steps

Modern installers (Ubuntu's Subiquity, Fedora's Anaconda, Calamares) make installation a 15-minute task. Download an ISO, write it to a USB stick with `dd`, `balenaEtcher`, or `Ventoy`, boot from it, follow the wizard.

Or install Linux inside Windows using **WSL2** — the easiest way to try it without touching your bootloader.

### Once Installed

```bash
# who am I?
whoami
id

# where am I?
pwd

# what's here?
ls -la

# what's my system?
uname -a
cat /etc/os-release

# what's running?
ps aux
top
htop

# disk space?
df -h
du -sh *
```

## The Shell

The shell is the primary interface to Linux. **Bash** is the default on most distributions; **zsh** and **fish** are popular alternatives.

### Essential Commands

| Command | Purpose |
|---------|---------|
| `ls` | List files |
| `cd` | Change directory |
| `pwd` | Print working directory |
| `cp` | Copy |
| `mv` | Move/rename |
| `rm` | Remove |
| `mkdir` | Make directory |
| `rmdir` | Remove empty directory |
| `touch` | Create file / update timestamp |
| `cat` | Print file |
| `less` | Page through file |
| `head`, `tail` | First/last lines |
| `grep` | Search text |
| `find` | Find files |
| `wc` | Count lines/words/bytes |
| `sort`, `uniq` | Sort, dedupe |
| `cut`, `awk`, `sed` | Text processing |
| `chmod` | Change permissions |
| `chown` | Change owner |
| `ps`, `top`, `htop` | Process management |
| `kill`, `killall` | Send signals |
| `df`, `du` | Disk usage |
| `tar`, `gzip`, `xz`, `zstd` | Archives |
| `ssh`, `scp`, `rsync` | Remote access |
| `curl`, `wget` | HTTP clients |
| `systemctl` | Manage services |
| `journalctl` | Read logs |
| `man` | Read manual pages |

### File System Layout (FHS)

Linux follows the **Filesystem Hierarchy Standard**.

| Path | Purpose |
|------|---------|
| `/` | Root |
| `/bin`, `/sbin` | Essential binaries (symlinked to `/usr/bin` on modern systems) |
| `/usr` | User programs, libraries, docs |
| `/etc` | System configuration |
| `/home` | User home directories |
| `/root` | Root user's home |
| `/var` | Variable data (logs, spools, databases) |
| `/tmp` | Temporary files (cleared on reboot) |
| `/opt` | Optional third-party software |
| `/srv` | Service data (web roots, etc.) |
| `/mnt`, `/media` | Mount points |
| `/dev` | Device files |
| `/proc`, `/sys` | Kernel and process information (virtual) |
| `/lib`, `/lib64` | Shared libraries |
| `/boot` | Kernel and bootloader |
| `/run` | Runtime state (since boot) |

### Permissions

Every file has an owner, a group, and permissions for each.

```
-rwxr-xr--  1 ada  staff  4096 Jan 15 10:00 script.sh
│└┬┘└┬┘└┬┘     │     │
│ │  │  └── others: read only
│ │  └───── group: read + execute
│ └──────── owner: read, write, execute
└────────── file type: - file, d directory, l symlink
```

```bash
chmod 755 script.sh         # rwxr-xr-x
chmod u+x script.sh         # add execute for owner
chmod go-w file.txt         # remove write for group and others
chmod -R 644 public/        # recursive

chown ada:staff file.txt
chown -R www-data:www-data /var/www
```

Numeric permissions: read=4, write=2, execute=1. Add them for each of the three classes.

### The `sudo` and Root User

`root` (UID 0) can do anything. `sudo` runs a command as root.

```bash
sudo apt update
sudo systemctl restart nginx
sudo -i                     # open a root shell
sudo -u postgres psql       # run as another user
```

Everyday use should be a normal user. `root` is for administration only.

## Package Management

Every distro has a package manager that handles install, upgrade, and removal.

### Debian / Ubuntu (`apt`)

```bash
sudo apt update                    # refresh package index
sudo apt upgrade                   # upgrade installed packages
sudo apt install nginx             # install
sudo apt remove nginx              # remove
sudo apt purge nginx               # remove + config
sudo apt search keyword            # search
apt list --installed               # list installed
sudo apt autoremove                # remove unused deps
```

### Fedora / RHEL (`dnf`)

```bash
sudo dnf install nginx
sudo dnf upgrade
sudo dnf remove nginx
dnf search keyword
dnf list installed
```

### Arch (`pacman`)

```bash
sudo pacman -Syu                   # sync + upgrade
sudo pacman -S nginx               # install
sudo pacman -Rns nginx             # remove + deps + config
pacman -Ss keyword                 # search
```

### Flatpak and Snap

Cross-distro sandboxed package formats for desktop apps.

```bash
flatpak install flathub com.spotify.Client
snap install code --classic
```

## Process Management

```bash
ps aux                    # all processes
ps aux | grep nginx
pgrep nginx               # PID by name
top                       # live process view
htop                      # prettier alternative
kill 1234                 # SIGTERM (graceful)
kill -9 1234              # SIGKILL (force)
killall nginx             # by name
pkill -f "pattern"        # by command line
```

### Background Jobs

```bash
command &                 # run in background
jobs                      # list jobs
fg                        # bring back to foreground
bg                        # continue in background
Ctrl+Z                    # suspend current job
nohup command &           # survive logout
```

### Process Priority

```bash
nice -n 10 command        # start with lower priority
renice -n 5 -p 1234       # change priority
```

## Systemd

Systemd is the init system on almost every modern distro. It manages services, mounts, timers, sockets, and the boot process.

```bash
systemctl status nginx
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl reload nginx
sudo systemctl enable nginx       # start on boot
sudo systemctl disable nginx
systemctl list-units --type=service
systemctl --failed
```

### Writing a Service

```ini
# /etc/systemd/system/myapp.service
[Unit]
Description=My App
After=network.target

[Service]
Type=simple
User=myapp
WorkingDirectory=/opt/myapp
ExecStart=/opt/myapp/bin/server
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now myapp
```

### Logs (`journalctl`)

```bash
journalctl                        # all logs
journalctl -u nginx               # specific service
journalctl -u nginx --since "1 hour ago"
journalctl -f                     # follow
journalctl -p err                 # errors only
journalctl -b                     # current boot
```

## Networking

```bash
ip a                              # interfaces
ip route                          # routing table
ss -tulnp                         # listening ports
ping example.com
curl https://example.com
wget https://example.com/file
dig example.com                   # DNS
traceroute example.com
nmap localhost                    # port scan
```

### Firewalls

`ufw` is the friendly frontend on Ubuntu/Debian.

```bash
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80,443/tcp
sudo ufw status verbose
```

`firewalld` on Fedora/RHEL.

```bash
sudo firewall-cmd --add-service=http --permanent
sudo firewall-cmd --reload
```

### SSH

```bash
ssh user@host
ssh -p 2222 user@host
ssh -i ~/.ssh/id_ed25519 user@host
scp file.txt user@host:/path/
rsync -avz src/ user@host:/dest/
```

Key-based auth: generate a key pair, copy the public key to `~/.ssh/authorized_keys`.

```bash
ssh-keygen -t ed25519 -C "ada@example.com"
ssh-copy-id user@host
```

## Users and Groups

```bash
sudo adduser ada                  # create user
sudo useradd -m -s /bin/bash ada  # lower level
sudo passwd ada                   # set password
sudo usermod -aG sudo ada         # add to group
sudo deluser ada                  # delete
groups ada                        # groups of a user
id                                # current user info
who                               # logged in users
last                              # login history
```

## Storage

```bash
lsblk                             # block devices
df -h                             # mounted filesystems
sudo mount /dev/sdb1 /mnt
sudo umount /mnt
sudo fdisk -l                     # partition table
```

### Filesystems

| FS | Strengths |
|----|-----------|
| **ext4** | Default, stable, fast |
| **btrfs** | Snapshots, checksums, subvolumes |
| **xfs** | High performance, large files |
| **zfs** | Advanced, checksums, snapshots, RAID |
| **f2fs** | Flash-optimized |

## Text Editors

| Editor | Notes |
|--------|-------|
| **vim** / **neovim** | Modal, ubiquitous, steep curve |
| **nano** | Simple, easy to learn |
| **emacs** | Extensible, Lisp-based |
| **micro** | Modern, mouse-friendly |
| **VS Code** | GUI, feature-rich |

Every server has `vi`. Learning enough to survive (`i` insert, `Esc`, `:wq` save and quit) is a rite of passage.

## Shell Scripting

Bash scripts automate the commands above.

```bash
#!/usr/bin/env bash
set -euo pipefail

NAME=${1:-world}
echo "Hello, $NAME"

for file in *.txt; do
  echo "Processing $file"
done

if [[ -f /etc/os-release ]]; then
  . /etc/os-release
  echo "Running $PRETTY_NAME"
fi
```

Key patterns:

- `set -euo pipefail` — exit on error, unset var, pipe failure.
- `$(command)` — command substitution.
- `$((expr))` — arithmetic.
- `"$var"` — always quote variables.
- `[[ ... ]]` — safer than `[ ... ]`.

## Containers and Virtualization

Linux invented most of what containers are built on — namespaces, cgroups, capabilities — and runs them natively.

```bash
docker run -it ubuntu bash
docker ps
docker logs container_name
```

```bash
podman run -it ubuntu bash      # rootless alternative
```

KVM (kernel-based virtual machine) provides full virtualization.

```bash
virsh list
virt-install --name vm1 --ram 2048 --vcpus 2 --disk size=20 ...
```

## Security

Linux is secure by design, but needs care.

- **Keep it updated.** `sudo apt upgrade` or `sudo dnf upgrade` regularly. Enable unattended-upgrades.
- **Use SSH keys, disable password auth.** Edit `/etc/ssh/sshd_config`, set `PasswordAuthentication no`.
- **Firewall everything.** Enable `ufw` or `firewalld`.
- **Fail2ban** — block brute-force attacks automatically.
- **SELinux / AppArmor** — mandatory access control. Don't disable them; learn them.
- **Principle of least privilege.** No service runs as root unless it must.
- **Monitor logs.** `journalctl`, `/var/log/`.
- **Audit installed packages.** Remove what you don't use.

## Shell Survival Tips

```bash
# find anything
find / -name "*.conf" 2>/dev/null
find . -type f -size +100M
grep -r "pattern" .

# chain commands
command1 && command2      # if first succeeds
command1 || command2      # if first fails
command1 | command2       # pipe output

# history
history | grep ssh
Ctrl+R                    # reverse search
!!

# shortcuts
Ctrl+C                    # interrupt
Ctrl+D                    # end input / logout
Ctrl+Z                    # suspend
Ctrl+L                    # clear screen
Tab                       # autocomplete
```

## Common Pitfalls

- **Running everything as root.** Destroys the permission model. Use `sudo` per-command.
- **`rm -rf /` or `rm -rf *` in the wrong directory.** No undo. Double-check paths.
- **Ignoring `--dry-run`.** Many destructive commands support it. Use it.
- **Editing config files without backups.** Copy to `.bak` first or use `git` in `/etc`.
- **Forgetting to `systemctl enable`.** Service runs now, but not after reboot.
- **Broken package manager state.** `sudo dpkg --configure -a` or `sudo apt install -f`.
- **Mixing package managers.** Installing Python packages via `apt`, `pip`, and `conda` on the same system creates conflicts. Use virtual environments.
- **Ignoring the shell prompt.** `$` vs `#` tells you whether you're a user or root. Watch it.
- **Not reading error messages.** Linux tells you exactly what went wrong. Read the last line of output.
- **Not using `man`.** Every command has documentation. `man command`.

## Linux vs Other Operating Systems

| | Linux | macOS | Windows |
|--|-------|-------|---------|
| License | GPL | Proprietary | Proprietary |
| Cost | Free | Bundled with hardware | Licensed |
| Kernel | Linux | XNU (Mach + BSD) | NT |
| Userland | GNU (usually) | BSD-derived | Windows |
| Package manager | Native (apt/dnf/…) | Homebrew (unofficial) | winget/choco |
| Shell | bash/zsh/fish | zsh | PowerShell/cmd |
| Server share | ~95% | small | small |
| Desktop share | ~4% | ~15% | ~72% |
| Customizable | Fully | Moderately | Moderately |

## Where Linux Is Used

- **Servers** — over 95% of web servers and cloud infrastructure.
- **Android** — every Android phone runs a Linux kernel.
- **Supercomputers** — 100% of the TOP500.
- **Cloud** — AWS, GCP, Azure all run on Linux.
- **Embedded** — routers, TVs, cars, IoT devices.
- **Chromebooks** — ChromeOS is Linux-based.
- **Steam Deck** — SteamOS is Arch-based.
- **Desktops** — growing, especially among developers.
- **Containers** — Docker, Kubernetes, Podman all run on Linux.

## When to Use Linux

**Good fit:**
- Servers, cloud, containers, anything that runs 24/7.
- Development environments.
- Embedded and IoT.
- Security-sensitive workloads.
- Anyone who wants full control over their system.
- Older hardware that modern Windows won't run on.

**Poor fit:**
- Users who need Windows-only software (Adobe, some games) and won't dual-boot or use VMs.
- Corporate environments locked into Microsoft's ecosystem.
- Users unwilling to troubleshoot occasionally.

## Summary

Linux's value comes down to five things:

1. **Open source** — you can read, modify, and redistribute every line.
2. **Free** — no licensing cost, ever.
3. **Stable** — servers run for years without rebooting.
4. **Portable** — from watches to supercomputers.
5. **Ubiquitous** — powers the internet, Android, cloud, and every supercomputer.

Linux has a reputation for being "for programmers," and that's partially true — it rewards curiosity and punishes carelessness. But it's also the most honest operating system: nothing is hidden, everything is a file, and the documentation is a `man` command away. Whether you use it as a server, a desktop, or embedded in a device you carry in your pocket, Linux is running the world.

## Further Reading

- *The Linux Command Line* by William Shotts (free): linuxcommand.org
- *How Linux Works* by Brian Ward
- *Linux from Scratch*: linuxfromscratch.org
- Arch Wiki: wiki.archlinux.org (the best Linux documentation anywhere)
- Ubuntu docs: help.ubuntu.com
- Fedora docs: docs.fedoraproject.org
- Kernel docs: kernel.org/doc
- *Linux Journey*: linuxjourney.com
- `man` and `info` on any system
