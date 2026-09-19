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

## Input & Architecture Invariants
1. **Decoupled Input Listeners**:
   - Global keyboard listeners (`keydown` for Arrow keys, WASD, Space, Enter, M) and touch/swipe handlers must reside at the engine hook level (`useSnakeGame`) or canvas root (`LcdScreen`).
   - Never place primary gameplay input listeners inside secondary UI components (like `<Controls />`), as views such as Full Screen Mode may unmount or hide them.
2. **Relative Vite Paths**:
   - Keep `base: './'` in `vite.config.ts` to ensure assets resolve properly on GitHub Pages or nested subpaths.
