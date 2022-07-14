import React, {useEffect} from "react";

interface HoverTogglerProps {
    /** The element that is shown when not hovered. */
    baseElement: JSX.Element
    /** The element that is shown when hovered. */
    hoverElement: JSX.Element
    /** The delay before switching back from the hovered element to the base element in ms. */
    switchBackDelay?: number
}

/** Displays a specific element. Displays another element when hovered. */
export const HoverToggler = ({baseElement, hoverElement, switchBackDelay = 200}: HoverTogglerProps) => {
    const [hovered, setHovered] = React.useState(false)
    const [showHovered, setShowHovered] = React.useState(false)

    // Handle showing the hovered element
    useEffect(() => {
        if(hovered) {
            setShowHovered(true)
        } else if(!hovered && showHovered) {
            if(switchBackDelay > 0) {
                const id = setTimeout(() => {
                    setShowHovered(false)
                }, switchBackDelay)
                return () => clearTimeout(id)
            } else {
                setShowHovered(false)
            }
        }
    }, [hovered, showHovered, switchBackDelay])

    return <span
        onMouseOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setHovered(true)
        }}
        onMouseOut={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setHovered(false)
        }}
        style={{width: "100%", height: "100%"}}
    >
        {showHovered ? hoverElement : baseElement}
    </span>
}
