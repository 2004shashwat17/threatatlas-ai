import { useEffect, useRef, useState } from 'react'
import * as maplibregl from 'maplibre-gl'
import type { GeoJSONSource, Map as LibreMap, MapLayerMouseEvent } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import type { FeatureCollection, Point } from 'geojson'
import type { ThreatIndicator } from '../../types'
import { useAnimationPreference } from '../../hooks/useAnimationPreference'

maplibregl.setWorkerUrl(workerUrl)

interface Props {
  threats: ThreatIndicator[]
  onSelect: (threat: ThreatIndicator) => void
  zoom: number
  reset: number
  focusCountry: string
}
function asGeoJSON(threats: ThreatIndicator[]): FeatureCollection<Point> {
  return {
    type: 'FeatureCollection',
    features: threats.map((threat) => ({
      type: 'Feature',
      properties: {
        id: threat.id,
        severity: threat.severity,
        rank: { Critical: 0, High: 1, Medium: 2, Low: 3 }[threat.severity],
      },
      geometry: { type: 'Point', coordinates: threat.coordinates },
    })),
  }
}
export default function MapView({ threats, onSelect, zoom, reset, focusCountry }: Props) {
  const container = useRef<HTMLDivElement>(null)
  const map = useRef<LibreMap | null>(null)
  const records = useRef(threats)
  const select = useRef(onSelect)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)
  const { reducedMotion } = useAnimationPreference()
  useEffect(() => {
    records.current = threats
    select.current = onSelect
  }, [threats, onSelect])
  useEffect(() => {
    if (!container.current) return
    let instance: LibreMap
    try {
      instance = new maplibregl.Map({
        container: container.current,
        center: [15, 20],
        zoom: 1.2,
        minZoom: 0.7,
        maxZoom: 8,
        attributionControl: false,
        style: {
          version: 8,
          sources: { countries: { type: 'geojson', data: '/countries.geojson' } },
          layers: [
            { id: 'background', type: 'background', paint: { 'background-color': '#0a1422' } },
            {
              id: 'land',
              type: 'fill',
              source: 'countries',
              paint: { 'fill-color': '#1b2c40', 'fill-opacity': 0.85 },
            },
            {
              id: 'borders',
              type: 'line',
              source: 'countries',
              paint: { 'line-color': '#3b536b', 'line-width': 0.6 },
            },
          ],
        },
      })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Map renderer could not initialize.')
      return
    }
    map.current = instance
    instance.addControl(
      new maplibregl.AttributionControl({
        compact: true,
        customAttribution: 'Natural Earth · Fictional indicators',
      }),
      'bottom-right',
    )
    instance.on('error', (event) => setError(`Geographic map unavailable: ${event.error.message}`))
    instance.on('load', () => {
      instance.addSource('threats', {
        type: 'geojson',
        data: asGeoJSON(records.current),
        cluster: true,
        clusterRadius: 38,
        clusterMaxZoom: 4,
        clusterProperties: { severityRank: ['min', ['get', 'rank']] },
      })
      instance.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'threats',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'match',
            ['get', 'severityRank'],
            0,
            '#f87171',
            1,
            '#f5ae55',
            2,
            '#689dff',
            '#41d4b0',
          ],
          'circle-radius': ['step', ['get', 'point_count'], 11, 3, 15, 6, 20],
          'circle-stroke-width': 6,
          'circle-stroke-color': '#3c6475',
          'circle-stroke-opacity': 0.25,
        },
      })
      instance.addLayer({
        id: 'points',
        type: 'circle',
        source: 'threats',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'match',
            ['get', 'severity'],
            'Critical',
            '#f87171',
            'High',
            '#f5ae55',
            'Medium',
            '#689dff',
            '#41d4b0',
          ],
          'circle-radius': 5,
          'circle-stroke-width': 6,
          'circle-stroke-color': '#528f9c',
          'circle-stroke-opacity': 0.17,
        },
      })
      const clickPoint = (event: MapLayerMouseEvent) => {
        const id = event.features?.[0]?.properties?.id
        const record = records.current.find((item) => item.id === id)
        if (record) select.current(record)
      }
      instance.on('click', 'points', clickPoint)
      instance.on('click', 'clusters', async (event) => {
        const feature = event.features?.[0]
        if (!feature || feature.geometry.type !== 'Point') return
        try {
          const expansionZoom = await (
            instance.getSource('threats') as GeoJSONSource
          ).getClusterExpansionZoom(Number(feature.properties?.cluster_id))
          instance.easeTo({
            center: feature.geometry.coordinates as [number, number],
            zoom: expansionZoom,
            essential: false,
          })
        } catch (cause) {
          setError(cause instanceof Error ? cause.message : 'Unable to expand cluster.')
        }
      })
      for (const layer of ['points', 'clusters']) {
        instance.on('mouseenter', layer, () => {
          instance.getCanvas().style.cursor = 'pointer'
        })
        instance.on('mouseleave', layer, () => {
          instance.getCanvas().style.cursor = ''
        })
      }
      setReady(true)
    })
    const observer = new ResizeObserver(() => instance.resize())
    observer.observe(container.current)
    return () => {
      observer.disconnect()
      instance.remove()
      map.current = null
    }
  }, [])
  useEffect(() => {
    if (ready)
      (map.current?.getSource('threats') as GeoJSONSource | undefined)?.setData(asGeoJSON(threats))
  }, [threats, ready])
  useEffect(() => {
    if (ready && zoom)
      map.current?.easeTo({
        zoom: (map.current?.getZoom() ?? 1) + (zoom > 0 ? 0.8 : -0.8),
        duration: reducedMotion ? 0 : 350,
      })
  }, [zoom, ready, reducedMotion])
  useEffect(() => {
    if (ready)
      map.current?.easeTo({ center: [15, 20], zoom: 1.2, duration: reducedMotion ? 0 : 500 })
  }, [reset, ready, reducedMotion])
  useEffect(() => {
    if (!ready || focusCountry === 'All') return
    const record = threats.find((threat) => threat.country === focusCountry)
    if (record)
      map.current?.easeTo({
        center: record.coordinates,
        zoom: 4,
        duration: reducedMotion ? 0 : 600,
      })
  }, [focusCountry, threats, ready, reducedMotion])
  return (
    <>
      <div
        ref={container}
        className="maplibre-container"
        data-ready={ready}
        aria-label="Interactive 2D fictional threat map"
      />
      {error && (
        <div role="alert" className="map-error">
          {error} Use the indicator selector below to inspect records.
        </div>
      )}
    </>
  )
}
