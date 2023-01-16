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
               style={{fill:"#ffeeaa", stroke:"none", "stroke-width":"10", "stroke-linecap":"square", "stroke-linejoin":"miter", "stroke-dasharray":"none"}}
               width="1920"
               height="1080"
               x="0"
               y="0" />
            <rect
               style={{"fill":"#fff6d5", "stroke":"#ffcc00", "stroke-width":"10", "stroke-linecap":"square", "stroke-linejoin":"miter", "stroke-dasharray":"none"}}
               width="1810"
               height="970"
               x="55"
               y="55" />
            <path
               style={{"fill":"none", "stroke":"#ffcc00", "stroke-width":"10", "stroke-linecap":"butt", "stroke-linejoin":"miter", "stroke-opacity":"1", "stroke-dasharray":"none"}}
               d="m 55,55 1810,970"
            />
            <path
               style={{"fill":"none", "stroke":"#ffcc00", "stroke-width":"10", "stroke-linecap":"butt", "stroke-linejoin":"miter", "stroke-opacity":"1", "stroke-dasharray":"none"}}
               d="M 55,1025 1865,55"
            />
            <text
               style={{"font-style":"normal", "font-variant":"normal", "font-weight":"normal", "font-stretch":"normal", "font-size":"133.333px", "line-height":"1.25", "font-family":"Roboto", "-inkscape-font-specification":"Roboto"}}
               x="592.71484"
               y="587.39581"
            ><tspan
                 x="592.71484"
                 y="587.39581">1920 x 1080</tspan></text>
          </g>
        </svg>
    );
}
