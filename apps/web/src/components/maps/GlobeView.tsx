import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Line, OrbitControls, Stars, useTexture } from '@react-three/drei'
import { AdditiveBlending, Color, DoubleSide, InstancedMesh, Matrix4, Vector3 } from 'three'
import gsap from 'gsap'
import type { ThreatIndicator } from '../../types'
import { demoConnections, severityColors } from '../../mocks/data'
import { severityRank } from '../../utils/threats'
import { useAnimationPreference } from '../../hooks/useAnimationPreference'
import type { Line2, OrbitControls as OrbitControlsImpl } from 'three-stdlib'

interface GlobeProps {
  threats: ThreatIndicator[]
  onSelect: (threat: ThreatIndicator) => void
  paused: boolean
  zoom: number
  reset: number
  focusCountry: string
}
interface HoveredMarker {
  x: number
  y: number
  items: ThreatIndicator[]
}
function latLng([lng, lat]: [number, number], radius = 2): Vector3 {
  const phi = (lat * Math.PI) / 180
  const theta = (lng * Math.PI) / 180
  return new Vector3(
    Math.cos(phi) * Math.cos(theta) * radius,
    Math.sin(phi) * radius,
    -Math.cos(phi) * Math.sin(theta) * radius,
  )
}
const atmosphereVertex = `varying vec3 vNormal; varying vec3 vPosition; void main() { vNormal = normalize(normalMatrix * normal); vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); vPosition = mvPosition.xyz; gl_Position = projectionMatrix * mvPosition; }`
const atmosphereFragment = `varying vec3 vNormal; varying vec3 vPosition; void main() { float edge = 1.0 - abs(dot(normalize(vNormal), normalize(-vPosition))); float intensity = pow(edge, 4.5) * 0.38; gl_FragColor = vec4(0.13, 0.48, 0.8, intensity); }`

function Earth({
  threats,
  onSelect,
  paused,
  zoom,
  reset,
  focusCountry,
  onHover,
  onReady,
}: GlobeProps & { onHover: (marker: HoveredMarker | null) => void; onReady: () => void }) {
  const texture = useTexture('/earth-day.jpg')
  const controls = useRef<OrbitControlsImpl>(null)
  const mesh = useRef<InstancedMesh>(null)
  const { camera, invalidate } = useThree()
  const { animate, active } = useAnimationPreference()
  const [distant, setDistant] = useState(true)
  useEffect(onReady, [onReady])
  const groups = useMemo(() => {
    const bins = new Map<string, ThreatIndicator[]>()
    threats.forEach((threat) => {
      const key = distant
        ? `${Math.floor((threat.coordinates[0] + 180) / 30)}-${Math.floor((threat.coordinates[1] + 90) / 30)}`
        : threat.id
      bins.set(key, [...(bins.get(key) ?? []), threat])
    })
    return [...bins.values()].map((items) => ({
      items,
      severity: [...items].sort((a, b) => severityRank[a.severity] - severityRank[b.severity])[0]
        .severity,
      point: latLng(items[0].coordinates, 2.035),
    }))
  }, [threats, distant])
  useEffect(() => {
    const instance = mesh.current
    if (!instance) return
    const matrix = new Matrix4()
    groups.forEach((group, i) => {
      const scale = group.items.length > 1 ? 0.047 : 0.027
      matrix.makeScale(scale, scale, scale).setPosition(group.point)
      instance.setMatrixAt(i, matrix)
      instance.setColorAt(i, new Color(severityColors[group.severity]))
    })
    instance.instanceMatrix.needsUpdate = true
    if (instance.instanceColor) instance.instanceColor.needsUpdate = true
    instance.computeBoundingSphere()
    invalidate()
  }, [groups, invalidate])
  useFrame(({ clock }) => {
    if (!animate || !mesh.current) return
    const matrix = new Matrix4()
    groups.forEach((group, i) => {
      const pulse = 1 + Math.sin(clock.elapsedTime * 2 + i) * 0.17
      const scale = (group.items.length > 1 ? 0.047 : 0.027) * pulse
      matrix.makeScale(scale, scale, scale).setPosition(group.point)
      mesh.current?.setMatrixAt(i, matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })
  useEffect(() => {
    if (zoom === 0) return
    const position = camera.position
      .clone()
      .normalize()
      .multiplyScalar(Math.max(3, Math.min(9, camera.position.length() * (zoom > 0 ? 0.8 : 1.25))))
    const tween = gsap.to(camera.position, {
      duration: animate ? 0.45 : 0,
      x: position.x,
      y: position.y,
      z: position.z,
      onUpdate: () => {
        controls.current?.update()
        invalidate()
      },
    })
    return () => {
      tween.kill()
    }
  }, [zoom, camera, invalidate, animate])
  useEffect(() => {
    if (focusCountry === 'All') return
    const threat = threats.find((item) => item.country === focusCountry)
    if (!threat) return
    const position = latLng(threat.coordinates, 4.6)
    const tween = gsap.to(camera.position, {
      x: position.x,
      y: position.y,
      z: position.z,
      duration: animate ? 0.8 : 0,
      onUpdate: () => {
        controls.current?.update()
        invalidate()
      },
    })
    return () => {
      tween.kill()
    }
  }, [focusCountry, threats, camera, invalidate, animate])
  useEffect(() => {
    camera.position.set(5.8, 2.1, -2.4)
    controls.current?.update()
    invalidate()
  }, [reset, camera, invalidate])
  function click(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation()
    if (event.instanceId === undefined) return
    const group = groups[event.instanceId]
    if (group.items.length === 1) onSelect(group.items[0])
    else {
      const position = group.point.clone().normalize().multiplyScalar(3.2)
      gsap.to(camera.position, {
        x: position.x,
        y: position.y,
        z: position.z,
        duration: animate ? 0.7 : 0,
        onUpdate: () => {
          controls.current?.update()
          invalidate()
        },
      })
    }
  }
  return (
    <>
      <ambientLight intensity={1.7} color="#7f9abb" />
      <directionalLight position={[5, 4, 5]} intensity={2.2} color="#b1d5ff" />
      <mesh
        onPointerMove={(event) => {
          event.stopPropagation()
          onHover(null)
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <sphereGeometry args={[2, 80, 64]} />
        <meshStandardMaterial map={texture} color="#47749a" roughness={0.9} metalness={0.12} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.06, 64, 48]} />
        <shaderMaterial
          vertexShader={atmosphereVertex}
          fragmentShader={atmosphereFragment}
          transparent
          blending={AdditiveBlending}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <instancedMesh
        key={groups.length}
        ref={mesh}
        args={[undefined, undefined, groups.length]}
        onClick={click}
        onPointerMove={(event) => {
          event.stopPropagation()
          if (event.instanceId !== undefined)
            onHover({
              items: groups[event.instanceId].items,
              x: event.nativeEvent.offsetX,
              y: event.nativeEvent.offsetY,
            })
        }}
        onPointerOut={() => onHover(null)}
      >
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      {demoConnections.map((connection) => {
        const from = threats.find((threat) => threat.id === connection.from)
        const to = threats.find((threat) => threat.id === connection.to)
        if (!from || !to) return null
        const start = latLng(from.coordinates, 2.04)
        const end = latLng(to.coordinates, 2.04)
        const points = Array.from({ length: 49 }, (_, i) => {
          const t = i / 48
          return start
            .clone()
            .lerp(end, t)
            .normalize()
            .multiplyScalar(2.04 + Math.sin(t * Math.PI) * 0.5)
            .toArray()
        })
        return <ConnectionArc key={`${from.id}-${to.id}`} points={points} animate={animate} />
      })}
      <Stars
        radius={70}
        depth={35}
        count={650}
        factor={1.2}
        saturation={0}
        fade
        speed={animate ? 0.15 : 0}
      />
      <OrbitControls
        ref={controls}
        enablePan={false}
        minDistance={2.7}
        maxDistance={9}
        autoRotate={active && animate && !paused && focusCountry === 'All'}
        autoRotateSpeed={0.17}
        enableDamping={animate}
        onChange={() => {
          setDistant(camera.position.length() > 4)
          invalidate()
        }}
      />
    </>
  )
}
function ConnectionArc({
  points,
  animate,
}: {
  points: [number, number, number][]
  animate: boolean
}) {
  const line = useRef<Line2>(null)
  useFrame((_, delta) => {
    if (animate && line.current) line.current.material.dashOffset -= Math.min(delta, 0.05) * 0.08
  })
  return (
    <Line
      ref={line}
      points={points}
      color="#58a7cc"
      lineWidth={0.7}
      transparent
      opacity={0.4}
      dashed
      dashSize={0.065}
      gapSize={0.035}
    />
  )
}
export default function GlobeView(props: GlobeProps) {
  const { active, animate } = useAnimationPreference()
  const [hovered, setHovered] = useState<HoveredMarker | null>(null)
  const [ready, setReady] = useState(false)
  const onReady = useMemo(() => () => setReady(true), [])
  return (
    <div className="globe-view">
      <Canvas
        aria-label="Interactive fictional threat globe. Drag to rotate, scroll to zoom. Use the indicator selector for keyboard access."
        camera={{ position: [5.8, 2.1, -2.4], fov: 43 }}
        dpr={[1, 1.5]}
        frameloop={!active ? 'never' : animate ? 'always' : 'demand'}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      >
        <Suspense fallback={null}>
          <Earth {...props} onHover={setHovered} onReady={onReady} />
        </Suspense>
      </Canvas>
      {!ready && <span className="globe-loading">Loading Earth texture...</span>}
      {hovered && (
        <div className="globe-tooltip" style={{ left: hovered.x, top: hovered.y }}>
          <strong>
            {hovered.items.length > 1
              ? `${hovered.items.length} sample indicators`
              : hovered.items[0].category}
          </strong>
          <span>{hovered.items[0].country} · Approximate</span>
          <small>
            {hovered.items.length > 1 ? 'Click to expand cluster' : 'Click to inspect indicator'}
          </small>
        </div>
      )}
    </div>
  )
}
