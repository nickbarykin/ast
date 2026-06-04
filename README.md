# Astrology Chart Architecture Plan

## Main Goal

Build the first version of the astrology chart as a simple, working natal chart, but with a data and rendering architecture that will not need to be rewritten later.

The first target is **not** a universal visual engine.

The first target is:

```text
Raw API Data
    ↓
Normalized Chart Model
    ↓
Derived Astrology Model
    ↓
Simple Scene Model
    ↓
SVG Natal Chart
```

Future views like cylindrical layout, 2.5D, timelines, relationship graphs and advanced animations should be possible later, but they must not overcomplicate the first implementation.

---

# 1. Architecture Priorities

## Current Priority

Focus on:

- stable data model
- clear naming
- stable IDs
- normalized chart structure
- correct astrological coordinate math
- houses as areas, not just lines
- aspects as relations, not just SVG lines
- simple SVG rendering through a scene abstraction

## Not Current Priority

Do not implement yet:

- Cylinder layout
- Perspective camera
- WebGL renderer
- Canvas renderer
- Full animation system
- Full behavior engine
- Complex gesture system
- Timeline layout
- Graph layout

These ideas should influence architecture, but not become first-stage code.

---

# 2. Core Architecture

```text
Backend Raw Chart Response
        ↓
normalizeChart()
        ↓
ChartEntity
        ↓
Scene Builder
        ↓
Scene / Layers / Nodes / Shapes
        ↓
SVG Renderer
```

The backend response must never be used directly by UI components.

The frontend should work with a stable normalized chart model.

---

# 3. Raw API Model

The raw API model is the technical response from the backend.

It may contain Swiss Ephemeris-specific data.

Example data categories:

- Julian day
- planets
- houses
- ascendant
- midheaven
- geographic data
- calculation metadata

This layer is allowed to be backend-specific.

It should be transformed immediately before being used by the application.

---

# 4. Normalized Chart Model

The normalized chart model is the main frontend data contract.

It should be stable and independent from rendering.

## ChartEntity

Root object of the chart.

Contains:

- id
- meta
- points
- houses
- signs
- aspects
- relations

```text
ChartEntity
 ├── meta
 ├── points
 ├── houses
 ├── signs
 ├── aspects
 └── relations
```

---

# 5. Points Instead of Only Planets

Do not model everything as planets.

Use a broader entity type: `PointEntity`.

A point can represent:

- planet
- angle
- lunar node
- asteroid
- calculated point
- hypothetical point

Examples:

```text
point:sun
point:moon
point:mars
point:ascendant
point:mc
point:north_node
point:lilith
point:chiron
```

This prevents future problems with Ascendant, MC, Nodes, Lilith, Chiron, asteroids and other non-planet objects.

---

# 6. PointEntity

Represents a celestial or calculated point.

Should contain:

- id
- key
- name
- type
- longitude
- latitude
- distance
- speed
- retrograde
- signId
- houseId
- metadata

Important:

- longitude is domain data
- screen position is not domain data
- x/y should be calculated only by layout

---

# 7. HouseEntity

A house is an area, not just a cusp line.

Should contain:

- id
- number
- startLongitude
- endLongitude
- size
- cuspLongitude
- pointIds inside this house

Important:

- house should describe an astrological sector
- SVG paths should not be stored in the house entity
- visual sector geometry should be created by layout/shape layer

---

# 8. SignEntity

A sign is a zodiac sector.

Can be mostly constant data.

Should contain:

- id
- key
- name
- startLongitude
- endLongitude
- element
- modality
- rulerPointId or rulerKey
- metadata

Signs should be usable both for rendering and interpretation.

---

# 9. AspectEntity

An aspect is a relationship between two points.

It is not just a visual line.

Should contain:

- id
- sourcePointId
- targetPointId
- type
- exactAngle
- actualAngle
- orb
- exactness
- metadata

Initial supported aspects:

- conjunction
- opposition
- trine
- square
- sextile

Future aspects can be added later.

---

# 10. Relation Model

Relations are important for highlighting, explanations, tooltips and learning mode.

A relation is a generic connection between two entities.

## Relation

Should contain:

- id
- type
- sourceId
- targetId
- payload

Initial relation types:

- point_in_sign
- point_in_house
- aspect_between_points

Future relation types:

- sign_ruler
- house_ruler
- dispositor
- transit_to_natal
- progression_relation

Relations should use stable IDs and should not depend on rendering.

---

# 11. Stable ID Rules

IDs should be stable, readable and namespaced.

Avoid random UUIDs for core astrological objects.

Examples:

```text
point:sun
point:moon
point:mars
point:ascendant

house:1
house:2
house:7

sign:aries
sign:taurus

aspect:sun-moon-trine
relation:mars-house-7
```

For future multi-chart modes:

```text
point:natal:mars
point:transit:mars
aspect:transit:mars__natal:venus__square
```

Stable IDs are required for:

- selection
- hover
- relation highlighting
- tooltips
- transitions
- debugging
- React keys
- future layout changes

---

# 12. Domain Model Implementation Style

Domain data should be simple.

Prefer plain objects over heavy JavaScript classes.

Good approach:

```text
Domain model = plain data objects
Transformers/selectors = pure functions
Scene/Shape/Layout = runtime objects or classes
```

Reasons:

- easier to serialize
- easier to debug
- easier to test
- easier to pass into React
- easier to compare
- easier to save or load

---

# 13. Normalization Layer

The most important first module is:

```text
normalizeChart(rawChart)
```

It should transform backend data into a stable chart object.

Responsibilities:

- normalize raw planet data into points
- create angles as points
- normalize houses
- create sign references
- calculate point sign placement
- calculate point house placement
- calculate aspects
- build relations
- attach stable IDs
- return a complete ChartEntity

The rest of the frontend should depend on this normalized result, not on the backend response.

---

# 14. Coordinate Math Layer

Coordinate math must be separate from rendering.

This prevents magic formulas and wrong chart orientation.

Needed helpers:

- normalizeAngle
- getSignByLongitude
- getDegreeInSign
- getHouseByLongitude
- getHouseSector
- getAngularDistance
- getAspectBetweenPoints
- longitudeToChartAngle
- chartAngleToScreenAngle

This layer should define how astronomical longitude becomes chart angle.

Important:

- do not hide Ascendant rotation inside random components
- do not use unexplained formulas like `130 - ascendant`
- all chart rotation rules must live in one place

---

# 15. Aspect Calculation

Aspect calculation should be part of the data pipeline.

The aspect calculator should:

- compare point pairs
- calculate angular distance
- match supported aspect types
- apply allowed orb
- return AspectEntity objects
- create relation records for aspects

For MVP, only major aspects are required.

Initial aspects:

```text
0°   conjunction
60°  sextile
90°  square
120° trine
180° opposition
```

Orb rules can be simple at first and improved later.

---

# 16. Selectors

Selectors should provide safe access to chart data.

Examples:

- getPointById
- getHouseById
- getSignById
- getAspectById
- getRelationsForEntity
- getAspectsForPoint
- getPointsInHouse
- getPointsInSign

Selectors prevent UI code from manually searching through raw arrays everywhere.

---

# 17. Scene Model

After the data model is stable, create a simple scene abstraction.

The scene model should not be a full game engine.

It only needs enough structure to render a clean SVG chart and support interaction.

```text
Scene
 ├── Layers
 │    ├── Nodes
 │    │    ├── Shapes
```

---

# 18. Scene

Scene is the root visual object.

Should contain:

- layers
- scene state
- display settings
- layout result
- metadata

The scene should be built from normalized chart data.

---

# 19. Layers

Layers control visual grouping and render order.

Initial layers:

- zodiac
- houses
- aspects
- points
- labels
- debug
- overlay

Layer should contain:

- id
- name
- visible
- locked
- opacity
- zIndex
- nodes

Layer visibility is important for debugging and future user controls.

---

# 20. SceneNode

A node is a visual representation of a domain entity.

Examples:

- PointNode
- HouseNode
- SignNode
- AspectNode
- LabelNode

A node should contain:

- id
- entityId
- type
- shapes
- state
- metadata

Important:

- node is connected to domain entity by ID
- node does not perform astrology calculations
- node does not directly render SVG
- node can have one or more shapes

---

# 21. Shapes

Shapes are visual primitives.

Shapes should not know anything about astrology.

Initial shape types:

- GroupShape
- PointShape
- LineShape
- SectorShape
- TextShape
- PathShape

Possible future shape types:

- RectShape
- PanelShape
- CurvedPanelShape
- GlowShape

Shape should contain:

- id
- type
- geometry
- style
- transform
- visibility
- opacity
- hit area data

Important:

- Shape does not know what Mars is
- Shape does not know what House 7 is
- Shape only describes visual geometry

---

# 22. Layout

Layout calculates visual positions.

The first layout is:

```text
CircularChartLayout
```

It should calculate:

- zodiac sector positions
- house sector positions
- point positions
- aspect line positions
- label positions

Important:

- layout should not render
- layout should not contain astrology calculations that belong to normalization/math
- layout should not produce SVG elements directly
- layout should only calculate geometry and transforms

Future layouts can use the same normalized chart model.

---

# 23. SVG Renderer

The first renderer should be SVG.

SVG is enough for MVP because the chart has a limited number of objects:

- 12 signs
- 12 houses
- 10–20 points
- several aspects
- labels
- overlays

SVG Renderer should:

- read scene layers
- read nodes
- read shapes
- convert shapes into SVG elements
- preserve entity IDs for interaction
- respect layer visibility and z-index

Renderer should not know astrology.

---

# 24. Scene Builder

Create a builder that transforms normalized chart data into a scene.

Example responsibility:

```text
buildNatalChartScene(chart, options)
```

It should create:

- ZodiacLayer
- HouseLayer
- AspectLayer
- PointLayer
- LabelLayer
- DebugLayer
- OverlayLayer

Each node should reference an entity ID.

Examples:

```text
PointNode
  entityId: point:mars
  shapes:
    - point marker
    - glyph text

HouseNode
  entityId: house:7
  shapes:
    - sector

AspectNode
  entityId: aspect:mars-venus-square
  shapes:
    - line
```

---

# 25. Scene State

Simple interaction state should exist before complex behaviors.

Initial state:

- hoveredEntityId
- selectedEntityId
- activeTooltipEntityId
- highlightedRelationIds
- visibleLayerIds
- currentLayout

This is enough for:

- hover
- click
- select
- tooltip
- relation highlight

Avoid putting global interaction logic inside shapes.

---

# 26. Basic Interaction

Initial interaction should be simple.

Required actions:

- hover entity
- select entity
- show tooltip or info panel
- highlight related entities
- clear selection

Example behavior:

```text
Click on Mars
    ↓
selectedEntityId = point:mars
    ↓
highlight all relations connected to point:mars
    ↓
show Mars info panel
```

No full behavior system is needed yet.

A behavior system can be added later if interaction logic becomes repetitive.

---

# 27. Overlay and Tooltip

Do not think only in terms of tooltip.

Future UI may use:

- tooltip
- popover
- side panel
- bottom sheet
- learning card
- modal

For MVP, a simple tooltip or info panel is enough.

But architecturally it should be connected to:

```text
activeTooltipEntityId
selectedEntityId
```

Not directly hardcoded inside shapes.

---

# 28. Debug Mode

Debug mode should be added early.

It will help verify chart math.

Debug overlay can show:

- Ascendant line
- 0° Aries line
- sign boundaries
- house cusps
- point longitude
- screen angle
- hit areas
- node IDs
- layer names

This is important because chart orientation and Ascendant rotation are easy to get wrong.

---

# 29. Display Settings

Display settings should control visual complexity.

Initial settings:

- show zodiac
- show houses
- show aspects
- show points
- show labels
- show debug
- show minor points later
- show only major aspects later

These settings should affect scene/layer/node visibility, not raw data.

---

# 30. Theme / Visual Style Config

Do not hardcode all visual styles inside components.

Create a simple visual config.

Should contain:

- chart radius
- ring sizes
- point sizes
- line widths
- font sizes
- aspect styles
- hover scale
- opacity rules

This does not need to be a full design system.

It only needs to centralize visual constants.

---

# 31. React Role

React should be the application shell, not the chart engine.

React should:

- fetch data
- call normalizeChart
- create scene
- render SVG container
- manage high-level UI panels
- sync scene state with UI

React should not become the place where all chart math and rendering logic is mixed.

---

# 32. Future Compatibility Rules

The current chart should be simple, but it must follow these rules.

## Rule 1

Domain entities must not store screen coordinates.

Bad:

```text
point.x
point.y
```

Good:

```text
point.longitude
```

## Rule 2

Houses must not store SVG path data.

Bad:

```text
house.pathD
```

Good:

```text
house.startLongitude
house.endLongitude
```

## Rule 3

Aspects must not be modeled as lines.

Bad:

```text
aspect.x1
aspect.y1
aspect.x2
aspect.y2
```

Good:

```text
aspect.sourcePointId
aspect.targetPointId
aspect.type
aspect.orb
```

## Rule 4

Everything should be connected by stable IDs.

Bad:

```text
aspect.source = fullMarsObject
```

Good:

```text
aspect.sourcePointId = point:mars
```

## Rule 5

Layout owns visual placement.

Do not calculate final screen positions inside domain objects.

## Rule 6

Renderer only renders.

Renderer must not know astrology.

## Rule 7

Scene nodes bridge data and visuals.

Node knows which entity it represents, but does not perform domain calculations.

---

# 33. Recommended Folder Structure

```text
astrology/
  constants/
    points.js
    signs.js
    houses.js
    aspects.js

  math/
    angles.js
    zodiac.js
    houses.js
    aspects.js

  normalize/
    normalizeChart.js
    normalizePoints.js
    normalizeHouses.js
    normalizeAspects.js
    buildRelations.js

  selectors/
    chartSelectors.js
    relationSelectors.js

  scene/
    Scene.js
    Layer.js
    SceneNode.js

  shapes/
    Shape.js
    PointShape.js
    LineShape.js
    SectorShape.js
    TextShape.js
    PathShape.js

  layout/
    CircularChartLayout.js

  renderers/
    SvgRenderer.jsx

  builders/
    buildNatalChartScene.js
```

This structure is intentionally simple.

It keeps future architecture possible without forcing a full visual engine immediately.

---

# 34. MVP Development Order

## Stage 1 — Data Normalization

Goal: create a stable frontend chart model.

Tasks:

- define chart entity shape
- define point entity shape
- define house entity shape
- define sign entity shape
- define aspect entity shape
- define relation shape
- create stable IDs
- normalize backend planets into points
- normalize Ascendant and MC as points
- normalize houses as sectors
- attach signs to points
- attach houses to points
- calculate aspects
- build relations

---

## Stage 2 — Coordinate Math

Goal: remove magic angle formulas.

Tasks:

- normalize angles
- calculate angular distance
- convert longitude to zodiac sign
- calculate degree inside sign
- detect house by longitude
- convert longitude to chart angle
- convert chart angle to screen angle
- define Ascendant-based rotation
- test chart orientation

---

## Stage 3 — Selectors

Goal: avoid manual object searching in UI.

Tasks:

- get point by ID
- get house by ID
- get sign by ID
- get aspect by ID
- get relations for entity
- get aspects for point
- get points in house
- get points in sign

---

## Stage 4 — Simple Scene Model

Goal: create a minimal visual abstraction.

Tasks:

- create Scene
- create Layer
- create SceneNode
- create basic Shape model
- connect nodes to entity IDs
- support layer visibility
- support node visibility

---

## Stage 5 — SVG Natal Chart

Goal: render the first real chart.

Tasks:

- create SVG renderer
- create circular chart layout
- render zodiac sectors
- render house sectors
- render house cusp lines
- render point markers
- render point glyphs
- render aspect lines
- render labels
- render basic chart frame

---

## Stage 6 — Debug Layer

Goal: verify chart math visually.

Tasks:

- show Ascendant line
- show 0° Aries line
- show sign boundaries
- show house cusps
- show point angles
- show entity IDs
- show hit areas later

---

## Stage 7 — Basic Interaction

Goal: make the chart inspectable.

Tasks:

- hover entity
- select entity
- show selected state
- show tooltip or info panel
- highlight related aspects
- highlight point sign
- highlight point house
- clear selection

---

## Stage 8 — Display Settings

Goal: control visual complexity.

Tasks:

- toggle zodiac layer
- toggle house layer
- toggle aspect layer
- toggle point labels
- toggle debug layer
- toggle major aspects only later
- toggle minor points later

---

## Stage 9 — Visual Config

Goal: centralize visual constants.

Tasks:

- chart radius config
- ring width config
- point size config
- font size config
- aspect line style config
- hover style config
- opacity config

---

# 35. Future Stages

Do not implement now.

Keep as future direction.

## Future Stage — Behavior System

Possible when interactions become repetitive.

Examples:

- HoverBehavior
- SelectBehavior
- TooltipBehavior
- HighlightRelationsBehavior

## Future Stage — Animation System

Possible when visual transitions become important.

Examples:

- hover animation
- focus animation
- layout transition
- pulse animation

## Future Stage — Camera / View Transform

Needed before 2.5D and cylindrical views.

Examples:

- zoom
- rotation
- pan
- focus

## Future Stage — Cylinder Layout

Alternative visualization mode.

Must reuse:

- ChartEntity
- PointEntity
- HouseEntity
- SignEntity
- AspectEntity
- Relation
- Scene
- Node
- Shape

Should not require rewriting the data model.

---

# Simplified Checklist

## Data Model

- [x] Define ChartEntity
- [x] Define PointEntity
- [x] Define HouseEntity
- [x] Define SignEntity
- [x] Define AspectEntity
- [x] Define Relation
- [x] Define stable ID format
- [x] Use points, not only planets
- [x] Store Ascendant as a point
- [x] Store MC as a point
- [x] Store houses as sectors
- [x] Store aspects as relations between points

## Normalization

- [x] Create normalizeChart(rawChart)
- [x] Normalize backend planets into points
- [x] Normalize angles into points
- [x] Normalize houses
- [x] Add signs to chart
- [x] Assign each point to a sign
- [x] Assign each point to a house
- [x] Calculate aspects
- [x] Build relations
- [x] Return stable normalized chart object

## Coordinate Math

- [x] Create angle helpers
- [x] Create zodiac helpers
- [x] Create house helpers
- [x] Create aspect math helpers
- [x] Implement longitude → sign
- [x] Implement longitude → degree in sign
- [x] Implement longitude → house
- [x] Implement longitude → chart angle
- [x] Implement chart angle → screen angle
- [x] Implement Ascendant-based rotation
- [x] Remove all magic rotation formulas

## Selectors

- [x] Get point by ID
- [x] Get house by ID
- [ ] Get sign by ID
- [ ] Get aspect by ID
- [ ] Get relations for entity
- [ ] Get aspects for point
- [ ] Get points in house
- [ ] Get points in sign

## Scene

- [ ] Create Scene
- [ ] Create Layer
- [ ] Create SceneNode
- [ ] Create basic shape model
- [ ] Connect nodes to entity IDs
- [ ] Add layer visibility
- [ ] Add node visibility

## Shapes

- [ ] Create PointShape
- [ ] Create LineShape
- [ ] Create SectorShape
- [ ] Create TextShape
- [ ] Create PathShape
- [ ] Keep shapes astrology-independent

## Layout

- [ ] Create CircularChartLayout
- [ ] Calculate zodiac sector geometry
- [ ] Calculate house sector geometry
- [ ] Calculate point positions
- [ ] Calculate aspect line positions
- [ ] Calculate label positions
- [ ] Keep layout rendering-independent

## SVG Renderer

- [ ] Create SvgRenderer
- [ ] Render layers
- [ ] Render nodes
- [ ] Render point shapes
- [ ] Render line shapes
- [ ] Render sector shapes
- [ ] Render text shapes
- [ ] Respect layer order
- [ ] Respect visibility

## Natal Chart Scene

- [ ] Create buildNatalChartScene(chart, options)
- [ ] Create zodiac layer
- [ ] Create house layer
- [ ] Create aspect layer
- [ ] Create point layer
- [ ] Create label layer
- [ ] Create debug layer
- [ ] Render first full natal chart

## Debug

- [ ] Show Ascendant line
- [ ] Show 0° Aries line
- [ ] Show sign boundaries
- [x] Show house cusps
- [x] Show point IDs
- [x] Show point longitudes
- [ ] Show hit areas later

## Interaction

- [ ] Add hovered entity state
- [ ] Add selected entity state
- [ ] Add active tooltip entity state
- [ ] Add highlighted relation IDs
- [ ] Hover point
- [ ] Select point
- [ ] Show tooltip/info panel
- [ ] Highlight related aspects
- [ ] Highlight point sign
- [ ] Highlight point house
- [ ] Clear selection

## Display Settings

- [ ] Toggle zodiac layer
- [ ] Toggle house layer
- [ ] Toggle aspect layer
- [ ] Toggle point labels
- [ ] Toggle debug layer
- [ ] Prepare setting for minor points
- [ ] Prepare setting for minor aspects

## Visual Config

- [ ] Centralize chart radius
- [ ] Centralize ring widths
- [ ] Centralize point sizes
- [ ] Centralize font sizes
- [ ] Centralize aspect line styles
- [ ] Centralize hover styles
- [ ] Centralize opacity rules

## Do Not Do Yet

- [x] Do not implement CylinderLayout yet
- [x] Do not implement PerspectiveCamera yet
- [x] Do not implement WebGLRenderer yet
- [x] Do not implement CanvasRenderer yet
- [x] Do not implement full AnimationSystem yet
- [x] Do not implement full BehaviorSystem yet
- [x] Do not implement TimelineLayout yet
- [x] Do not implement GraphLayout yet
