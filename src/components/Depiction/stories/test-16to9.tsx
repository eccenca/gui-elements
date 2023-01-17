import React from "react";

export const Svg16to9 = () => {
    return (
        <svg
           width="1920"
           height="1080"
           viewBox="0 0 1920 1080"
           // preserveAspectRatio="xMidYMid slice"
           version="1.1"
           xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <rect
               style={{fill:"#ffeeaa", stroke:"none", strokeWidth:"10", strokeLinecap:"square", strokeLinejoin:"miter", strokeDasharray:"none"}}
               width="1920"
               height="1080"
               x="0"
               y="0" />
            <rect
               style={{"fill":"#fff6d5", "stroke":"#ffcc00", strokeWidth:"10", strokeLinecap:"square", strokeLinejoin:"miter", strokeDasharray:"none"}}
               width="1810"
               height="970"
               x="55"
               y="55" />
            <path
               style={{"fill":"none", "stroke":"#ffcc00", strokeWidth:"10", strokeLinecap:"butt", strokeLinejoin:"miter", strokeOpacity:"1", strokeDasharray:"none"}}
               d="m 55,55 1810,970"
            />
            <path
               style={{"fill":"none", "stroke":"#ffcc00", strokeWidth:"10", strokeLinecap:"butt", strokeLinejoin:"miter", strokeOpacity:"1", strokeDasharray:"none"}}
               d="M 55,1025 1865,55"
            />
            <text
               style={{fontStyle:"normal", fontVariant:"normal", fontWeight:"normal", fontStretch:"normal", fontSize:"133.333px", lineHeight:"1.25", fontFamily:"Roboto"}}
               x="592.71484"
               y="587.39581"
            ><tspan
                 x="592.71484"
                 y="587.39581">1920 x 1080</tspan></text>
          </g>
        </svg>
    );
}
