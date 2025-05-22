// src/components/features/body/BodyModel3D.jsx
import React, { useRef, useEffect,useState } from 'react'
import PropTypes from 'prop-types'


import femaleImg from '../../../assets/Female.png'
import maleImg   from '../../../assets/Male.png'

// your body‐part shapes
const BODY_PARTS = [
  {
    id: 'neck',
    label: 'Nacken',
    mPath: "M76,55 L97,57 L100,60 L103,57 L124,55 L110,47 L109,39 L105,43 L96,43 L91,39 L90,47 L76,55 Z",
    fPath: "M77,59 L96,61 L100,64 L104,61 L122,59 L110,54 L108,51 L107,44 L105,46 L100,47 L96,46 L93,44 L92.5,51 L90,55 L77,59 Z"
  },
  {
    id: 'chest',
    label: 'Brustumfang',
    mPath: "M79,56 L75,64 L72,73 L73,76 L76,81 L79,83 L95,83 L100,81 L104,83 L120,83 L124,81 L128,73 L125,64 L121,56 L103,58 L100,61 L97,58 L79,56 Z",
    fPath: "M86,60 L79,71 L80,75 L79,83 L80,87 L83,89 L88,90 L95,88.5 L100,84 L105,88.3 L112,90 L118,89 L120.5,85 L121.2,82 L120.5,74 L121,70 L115,60 L104,61 L100,64 L96,61 L86,60 Z"
  },
  {
    id: 'waist',
    label: 'Taille',
    mPath: "M78,104 L78,119 L87,120 L112,120 L122,119 L122,104 L113,107 L86,107 L78,104 Z",
    fPath: "M83,105 L80.7,113 L78,119 L88,121 L100,121.7 L113,121 L122,119 L119.3,112 L117,105 L83,105 Z"
  },
  {
    id: 'hips',
    label: 'Hüfte',
    mPath: "M78,119 L75,132 L125,132 L122,119 L112,120 L87,120 L78,119 Z",
    fPath: "M78,119 L75,131 L82,133 L90,134.5 L100,135 L110,134.5 L118,133 L125.5,131 L122,119.1 L113,121.1 L100,121.8 L88,121.1 L78,119 Z"
  },
  {
    id: 'biceps_right',//right bizeps is left side in the image
    label: 'Bizeps rechts',
    mPath: "M61,81 L66,77 L72,73 L74,80 L72,94 L67,105 L64,106 L59,104 L58,100 L61,82 Z",
    fPath: "M68,82 L77,74 L79,80 L78.5,85 L74.5,103 L68.5,108 L65.8,100 L68,82 Z"
  },
  {
    id: 'biceps_left',//left bizeps is right side in the image
    label: 'Bizeps links',
    mPath: "M139,81 L128,73 L126,80 L128,94 L133,105 L136,106 L141,104 L142,100 L139,82 Z",
    fPath: "M132,82 L123.7,74 L122,80 L121.5,85 L126,103 L132,108 L134.5,100 L132,82 Z"
  },
  {
    id: 'thigh_right',//right thigh is left side in the image
    label: 'Oberschenkel rechts',
    mPath: "M86,135 L73,161 L73,170 L74,181 L77,193 L84,189 L89,196 L91,197 L94,194 L95,190 L98,165 L99,148 L93,144 L86,135 Z",
    fPath: "M75,131 L72,143 L71.7,150 L72.5,160 L80.3,195.5 L87.5,194 L90,194 L96,195 L97.5,170 L98,149 L93,143 L86,136 L75,131 Z"
  },
  {
    id: 'thigh_left',//left thigh is right side in the image
    label: 'Oberschenkel links',
    mPath: "M114,135 L127,161 L127,170 L126,181 L123,193 L116,189 L111,196 L109,197 L106,194 L105,185  L102,165 L101,148 L107,144 L114,135 Z",
    fPath: "M126,131 L128.5,143 L128.7,150 L127.7,160 L120,195.5 L113.7,194 L110.5,194 L104.5,195 L102.7,168 L102.5,149 L107.3,143 L114,136 L126,131 Z"
  },
  {
    id: 'calf_right',//right calf is left side in the image
    label: 'Wade rechts',
    mPath: "M77,202 L74,220 L74,230 L77,245 L90,245 L92,235 L93,230 L93,222 L91,208 L77,202 Z",
    fPath: "M80.5,207 L78.3,220 L78.9,230 L80.5,240 L94.5,240 L95.3,235 L96,225 L94.2,209 L87.5,210 L80.5,207 Z"
  },
  {
    id: 'calf_left',//left calf is right side in the image
    label: 'Wade links',
    mPath: "M123,202 L126,220 L126,230 L123,245 L110,245 L108,235 L107,230 L107,222 L109,208 L123,202",
    fPath: "M119.5,207 L121.7,220 L121.4,230 L119.5,240 L105.5,240 L104.9,235 L104.3,225 L105.8,209 L112.5,210 L115.5,209 L119.5,207 Z"
  }
];


const BodyModel3D = ({ gender, onBodyPartSelect }) => {
  const [hovered, setHovered] = useState(null)
  const svgRef = useRef(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const handleClick = (e) => {
      // bounding box in CSS pixels
      const { left, top, width: cssW, height: cssH } = svg.getBoundingClientRect()
      // click position in CSS px
      const clickX = e.clientX - left
      const clickY = e.clientY - top

      // map CSS px → SVG viewBox coords (0–200 by 0–300)
      const svgX = Math.round((clickX / cssW) * 200)
      const svgY = Math.round((clickY / cssH) * 300)

      console.log('SVG CLICK @', svgX, svgY)
      e.preventDefault()
    }

    svg.addEventListener('click', handleClick)
    return () => svg.removeEventListener('click', handleClick)
  }, [])

  const outlineSrc = gender === 'f' ? femaleImg : maleImg

  return (
    <div className="relative w-full max-w-sm mx-auto select-none">
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 300"
        className="w-full h-[600px] md:h-[800px] mx-auto"
      >
        <image
          href={outlineSrc}
          x="0" y="0"
          width="200" height="300"
          preserveAspectRatio="xMidYMid meet"
        />

        {BODY_PARTS.map((part) => (
          <path
            key={part.id}
            d={gender === 'f' ? part.fPath : part.mPath}
            fill={hovered === part.id
              ? 'rgba(59, 130, 246, .6)'
              : 'rgba(224, 231, 239, .6)'
            }
            stroke="#222"
            strokeWidth={hovered === part.id ? 1.5 : 0.5}
            className="cursor-pointer transition-all duration-150"
            onMouseEnter={() => setHovered(part.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onBodyPartSelect(part.id)}
          />
        ))}
      </svg>

      {hovered && (
        <div
          className="absolute left-1/2 -translate-x-1/2 top-2
                     bg-black bg-opacity-75 text-white text-xs
                     px-2 py-1 rounded pointer-events-none"
        >
          {BODY_PARTS.find(p => p.id === hovered)?.label}
        </div>
      )}

      <p className="mt-2 text-center text-sm text-gray-600">
        Klicken Sie auf einen Bereich — {gender === 'f' ? 'Weibliche Ansicht' : gender === 'm' ? 'Männliche Ansicht' : 'Symbolbild'}
      </p>
    </div>
  )
}

BodyModel3D.propTypes = {
  gender: PropTypes.oneOf(['m','f']).isRequired,
  onBodyPartSelect: PropTypes.func.isRequired,
}

export default BodyModel3D
