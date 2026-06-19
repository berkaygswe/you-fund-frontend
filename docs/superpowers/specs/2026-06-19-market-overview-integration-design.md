# Design Spec: Market Overview Integration & Speedometer Visualization
**Date**: 2026-06-19
**Status**: APPROVED

## Goal
Replace the mock quick stats section in the Market Overview page with real-time metrics fetched from the backend API `/market/overview`. Build a professional, interactive, and visually stunning dashboard interface featuring a radial speedometer for the Fear & Greed index, dynamic charts for market breadth, and real-time open status indicators for global markets.

## Requirements
1. **Fear & Greed Index**:
   - Numeric score (0 to 100) and text label (e.g. Extreme Fear, Fear, Neutral, Greed, Extreme Greed) from `/market/overview`.
   - Speedometer gauge matching the color zone of the score.
2. **Market Breadth**:
   - Total advancing, declining, and unchanged counts.
   - Advancing percentage of total active listings.
   - Stacked horizontal proportion bar (Green for advancing, Red for declining, Gray for unchanged).
3. **Hot Category**:
   - Leader category (e.g. Stocks) and median change.
   - Weakest category (e.g. Commodities) and median change.
4. **Open Markets**:
   - Status indicators for US, BIST, and CRYPTO markets.
   - Pulsing green status light for OPEN, solid red/gray for CLOSED.
5. **Caching & Fetching**:
   - Load initial data instantly, cache for 5 minutes, and refresh when the window receives focus (`refetchOnWindowFocus`).
   - Standard React Query hook for component isolation.
6. **I18n (Translations)**:
   - Complete i18n support in English (`en.json`) and Turkish (`tr.json`). No hardcoded UI strings.

## Architecture
- **API Client Method**: Added to `fundsApi` in `src/services/api.ts`.
- **Query Hook**: `useMarketOverview` hook in `src/hooks/useMarketOverview.ts`.
- **UI Components**:
  - `MarketOverview` (`src/app/[locale]/market-overview/page.tsx`): Main server-rendered page wrapper.
  - `QuickStats` (`src/app/[locale]/market-overview/components/quick-stats.tsx`): client-side component displaying the 4 cards.
  - `FearGreedSpeedometer` (`src/app/[locale]/market-overview/components/fear-greed-speedometer.tsx`): SVG semi-circular gauge.
  - `MarketBreadthBar` (`src/app/[locale]/market-overview/components/market-breadth-bar.tsx`): Custom stacked progress indicator.

## Localization Key Mapping
Add to `en.json` and `tr.json` under `Dashboard.MarketOverview`:
```json
{
  "fearGreedIndex": "Fear & Greed Index",
  "marketBreadth": "Market Breadth",
  "hotCategory": "Hot Category",
  "openMarkets": "Open Markets",
  "advancing": "Advancing",
  "declining": "Declining",
  "unchanged": "Unchanged",
  "leader": "Leader",
  "weakest": "Weakest",
  "open": "OPEN",
  "closed": "CLOSED",
  "strongParticipation": "Strong participation",
  "greed": "Greed",
  "extremeGreed": "Extreme Greed",
  "neutral": "Neutral",
  "fear": "Fear",
  "extremeFear": "Extreme Fear"
}
```
