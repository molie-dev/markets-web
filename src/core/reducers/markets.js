import { createSelector } from 'reselect'
import { getAllMarkets } from '../../api'

export const MARKETS_FETCHED = 'MARKETS_FETCHED'

export const fetchMarkets = () => (dispatch, getState) => {
  if (getState().markets.coins.length) {
    return
  }

  return getAllMarkets().then(([markets, marketsDefi]) => {
    dispatch({
      type: MARKETS_FETCHED,
      markets: normalizeCoins(markets),
      marketsDefi: normalizeDeFi(marketsDefi)
    })
  })
}

const initialState = {
  coins: [],
  coinsDefi: []
}

export default function reducer(state = initialState, action) {

  switch (action.type) {
    case MARKETS_FETCHED: {
      return {
        coins: action.markets,
        coinsDefi: action.marketsDefi
      }
    }

    default:
      return state
  }
}

export const selectMarketsCoins = createSelector(
  state => state.markets.coins,
  (_, category) => category,
  (coins, category) => {
    if (category) {
      return []
    }

    return coins
  }
)

export const selectTopGainers = createSelector(
  state => state.markets.coins,
  coins => {
    return coins.slice().sort((a, b) => b.priceChange24h - a.priceChange24h)
  }
)

export const selectTopLosers = createSelector(
  state => state.markets.coins,
  coins => {
    return coins.slice().sort((a, b) => a.priceChange24h - b.priceChange24h)
  }
)

export const selectTvlGainers = createSelector(
  state => state.markets.coinsDefi,
  coins => {
    return coins.slice().sort((a, b) => b.change1d - a.change1d)
  }
)

export const selectTopGainers5 = createSelector(
  selectTopGainers, coins => coins.slice(0, 5)
)

export const selectTopLosers5 = createSelector(
  selectTopLosers, coins => coins.slice(0, 5)
)

export const selectTvlGainers5 = createSelector(
  selectTvlGainers, coins => coins.slice(0, 5)
)

// Normalizer

export function normalizeCoins(markets) {
  return markets.map(item => ({
    id: item.id,
    name: item.name,
    image: item.image,
    symbol: item.symbol,
    rank: item.market_cap_rank,
    price: item.current_price,
    priceChange24h: item.price_change_percentage_24h,
    priceChange7d: item.price_change_percentage_7d_in_currency,
    priceChange14d: item.price_change_percentage_14d_in_currency,
    priceChange30d: item.price_change_percentage_30d_in_currency,
    priceChange200d: item.price_change_percentage_200d_in_currency,
    priceChange1y: item.price_change_percentage_1y_in_currency,
    marketCap: item.market_cap,
    totalVolume: item.total_volume,
  }))
}

function normalizeDeFi(markets) {
  return markets.map(item => ({
    symbol: item.code,
    id: item.coingecko_id,
    tvl: item.tvl,
    logo: item.image_url,
    change1d: item.tvl_diff_24h
  }))
}
