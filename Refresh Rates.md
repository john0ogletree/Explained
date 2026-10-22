# Introduction to Display Refresh Rates

A display's **refresh rate** refers to the number of times per second the screen updates its drawn image. Measured in **Hertz (Hz)**, higher refresh rates result in smoother motion, reduced input latency, and diminished motion blur.

---

## 1. Refresh Rate (Hz) vs. Frame Rate (FPS)

While closely related, refresh rate and frame rate are distinct concepts:

* **Frame Rate (FPS):** The rate at which the graphics card (GPU) or source device renders and outputs completed images per second.
* **Refresh Rate (Hz):** The fixed hardware capability of the monitor specifying how many times per second it redraws the screen grid.

```text
  [ GPU Rendering (FPS) ] ──► [ Video Buffer ] ──► [ Monitor Display Panel (Hz) ]
```

### Motion Mismatches
* **FPS > Hz:** The GPU renders faster than the display can draw. Can cause **screen tearing** where multiple frames appear stacked on a single refresh pass.
* **FPS < Hz:** The display refreshes faster than new frames arrive. Causes repeated frames and visual stuttering or judder.

---

## 2. Common Refresh Rates & Primary Use Cases

| Refresh Rate | Typical Use Cases | Key Benefits |
| :--- | :--- | :--- |
| **60 Hz** | Standard TVs, basic office monitors, legacy smartphones | Low power consumption; sufficient for basic UI and non-competitive content. |
| **90 Hz / 120 Hz** | Modern smartphones, tablets (e.g., Apple ProMotion), mainstream TVs | Noticeably smoother scrolling and UI animations with minimal battery impact. |
| **144 Hz / 165 Hz** | Mainstream PC gaming, esports monitors | Dramatic reduction in motion blur; lower input latency for competitive gaming. |
| **240 Hz – 500+ Hz** | Professional esports and ultra-high-speed competitive displays | Extreme motion clarity and sub-millisecond response feedback for fast-paced titles. |

---

## 3. Variable Refresh Rate (VRR) Technologies

Variable Refresh Rate dynamically synchronizes the monitor's refresh rate ($Hz$) in real-time to match the variable frame rate ($FPS$) produced by the GPU, eliminating screen tearing and reducing stuttering.

```text
Fixed Refresh:  | 16.6ms | 16.6ms | 16.6ms | 16.6ms |  (Fixed 60Hz intervals)
VRR Sync:       |--12ms--|---22ms---|--14ms--|--18ms--|  (Draws immediately on frame complete)
```

* **VESA Adaptive-Sync:** The open royalty-free standard incorporated into the DisplayPort and HDMI specifications.
* **AMD FreeSync:** AMD's implementation built on Adaptive-Sync standards, supported across PC hardware and modern consoles.
* **NVIDIA G-Sync:** NVIDIA's proprietary synchronization technology (historically required dedicated hardware modules in monitors, now offers software-based "G-Sync Compatible" support).

---

## 4. Key Factors Affecting Motion Clarity

High refresh rate is only one component of clear motion. Other critical display parameters include:

* **Pixel Response Time (GtG / MPRT):** How fast pixels transition between gray shades. Slow pixel response creates "ghosting" trailing effects behind fast objects regardless of $Hz$.
* **Motion Blur Reduction / Backlight Strobing:** Pulsing the screen backlight off between frame refreshes to clear the human eye's visual persistence, simulating the motion clarity of CRT displays.
* **Low Framerate Compensation (LFC):** A VRR feature that duplicates rendered frames when GPU performance drops below the monitor's minimum supported adaptive refresh range.
