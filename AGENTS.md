# Project Rules: Retro 8-Bit Arcade

## Visual & Aesthetic Invariants
1. **Sharp 90-Degree Corners**:
   - All buttons, status panels, modal dialogs, and game borders must strictly use `rounded-none`.
   - Never use rounded corners (`rounded`, `rounded-md`, `rounded-lg`) on retro arcade elements.
2. **Freestanding D-Pad**:
   - The directional D-pad must be rendered as an open, freestanding 5-square cross (`UP`, `LEFT`, `CENTER`, `RIGHT`, `DOWN`).
   - Do NOT enclose the D-pad inside an outer square border or card frame.
3. **Dedicated Playable Area Border**:
   - Maintain a dedicated `playableBorderColor` framing the game grid canvas.
   - Keep the playable area border visually distinct from outer chassis bezels or containers.
4. **Pure Web Interface**:
   - Do NOT add mobile mockups, phone casings, or simulated device chassis frames.
5. **Zero-Scroll Mobile Viewport (`100dvh`)**:
   - On mobile screens, the header, status bar HUD, square LCD canvas, and freestanding D-pad must fit completely within `100dvh` with zero manual scrolling required.
   - Dynamically clamp mobile canvas dimensions (e.g. `max-h-[calc(100dvh-235px)] aspect-square`) to leave ample vertical space for the D-pad.
6. **No Horizontal Screen Overflow & 2-Tier Mobile HUD**:
   - Never force long status readouts into a single row that exceeds narrow mobile screens (< 380px).
   - Format the mobile HUD into 2 compact tiers (Scores on row 1, Level/Length/Mode on row 2), keep header and HUD max-widths synchronized with the canvas, and enforce `overflow-x: hidden` and `max-width: 100vw` on root containers.

## Input & Architecture Invariants
1. **Decoupled Input Listeners**:
   - Global keyboard listeners (`keydown` for Arrow keys, WASD, Space, Enter, M) and touch/swipe handlers must reside at the engine hook level (`useSnakeGame`) or canvas root (`LcdScreen`).
   - Never place primary gameplay input listeners inside secondary UI components (like `<Controls />`), as views such as Full Screen Mode may unmount or hide them.
2. **Platform-Adaptive Interface Partitioning**:
   - Completely hide virtual on-screen D-pads and bottom action buttons on desktop screens (`sm:hidden`). Desktop users rely on keyboard controls and top headers.
   - Reserve virtual touch D-pads and swipe listeners strictly for mobile devices (`< 640px`).
3. **Modal-Driven Configuration & Safe Pause**:
   - Keep game mode, speed, and theme selectors inside a 3-dot modal dialog rather than displaying them on the main game screen.
   - Opening any modal must auto-pause active gameplay and suppress all global keydown listeners to prevent background collisions.
4. **Relative Vite Paths**:
   - Keep `base: './'` in `vite.config.ts` to ensure assets resolve properly on GitHub Pages or nested subpaths.
