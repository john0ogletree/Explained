# Introduction to How Cameras Work

A **camera** is an optical instrument designed to capture light from a scene and record it as a static image or dynamic video. At its fundamental core, every camera works on the same principle: focusing light through an aperture onto a light-sensitive surface.

---

## 1. The Core Components

```text
  [ Light Source ]
        │
        ▼ (Reflects off Subject)
  [ Lens System ] ──────► Focuses & Bends Light Rays
        │
        ▼
  [ Aperture ]    ──────► Controls Light Volume & Depth of Field
        │
        ▼
  [ Shutter ]     ──────► Controls Exposure Time
        │
        ▼
  [ Sensor / Film ] ────► Converts Light into Electrical Signals or Chemical Images
```

### Essential Hardware
* **Lens:** A collection of shaped glass elements that refracts incoming light to form a sharp image.
* **Aperture:** An adjustable diaphragm inside the lens that opens or closes to control how much light enters.
* **Shutter:** A mechanical curtain or electronic gate that opens for a set duration to expose the sensor to light.
* **Image Sensor (or Film):** A grid of light-sensitive pixels (photodiodes) that captures photon energy and converts it into digital data.

---

## 2. The Exposure Triangle

Every photograph's exposure (brightness) is determined by balancing three fundamental variables:

```text
               Aperture
               (f-stop)
                /\
               /  \
              /    \
             /      \
            /________\
  Shutter Speed       ISO
```

| Parameter | What It Measures | Secondary Visual Effect |
| :--- | :--- | :--- |
| **Aperture ($f$-stop)** | Size of the lens opening (e.g., $f/1.8$, $f/8$, $f/16$) | **Depth of Field:** Low $f$-number creates a blurry background (bokeh); high $f$-number keeps everything sharp. |
| **Shutter Speed** | Duration light hits the sensor (e.g., $1/1000\text{s}$, $1/30\text{s}$) | **Motion Blur:** Fast speed freezes action; slow speed blurs moving elements. |
| **ISO** | Amplification of the sensor's light signal | **Digital Noise / Grain:** Low ISO ($100$) produces clean images; high ISO ($6400+$) introduces grain. |

---

## 3. How Digital Sensors Work (Photons to Pixels)

1. **Photon Capture:** Light photons strike tiny silicon photodiodes on the sensor grid.
2. **Charge Generation:** Each photodiode releases electrons proportional to the intensity of light received.
3. **Bayer Filter Array:** Since photodiodes only measure brightness (grayscale), a filter grid of Red, Green, and Blue pixels sits over the sensor to isolate individual color channels.
4. **Analog-to-Digital Conversion (ADC):** The accumulated electric charge is measured and converted into digital numerical values.
5. **Demosaicing:** The camera’s internal image processor uses algorithms to interpolate the color values of neighboring pixels, creating a full-color image.

---

## 4. Main Types of Cameras

| Type | How Light Reaches the Viewer | Key Characteristics |
| :--- | :--- | :--- |
| **DSLR** | Bounces off a physical mirror through a pentaprism into an optical viewfinder. | Mechanical mirror flips up when shooting; excellent battery life. |
| **Mirrorless** | Passes straight to the sensor; preview displayed on an Electronic Viewfinder (EVF). | Compact body, continuous autofocus tracking, live exposure preview. |
| **Smartphones** | Fixed physical aperture with small sensors; heavily reliant on **Computational Photography**. | Combines multi-frame exposures and AI processing instantly. |
| **Film (Analog)** | Passes straight to light-sensitive chemical emulsion on plastic film stock. | Requires chemical development process; fixed ISO per film roll. |

---

## 5. Focusing Systems

* **Phase Detection Autofocus (PDAF):** Splits incoming light into pairs of images and measures their separation distance to achieve near-instantaneous focus tracking.
* **Contrast Detection Autofocus (CDAF):** Scans back and forth along the focus range until it finds the point of maximum pixel contrast.
* **Manual Focus:** Physical adjustment of the lens glass elements to manually align the focal plane onto the subject.
