import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { useEffect, useState, useRef, cloneElement } from "react"
import { motion } from "framer-motion"
import {
    borderProp,
    fillProp,
    createBackground,
    Border,
    HideElement,
    useMultiStepFormStore,
    getCanvasState,
    getFormInfo,
} from "https://framer.com/m/FramerFormsShared-XPyb.js@RhTkfEJwV2NS1uN2FS3e"

const CANVAS_HIDDEN_CLASS_NAME = "framerforms-canvas-hidden"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function MultiStepFormButton(props) {
    const prev = props.page == "previous"
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const isOptimizing = typeof window === "undefined"

    const [multiStepFormState, setMultiStepFormState] = useMultiStepFormStore()
    const [formId, setFormId] = useState(null)
    const ref = useRef(null)

    const state = multiStepFormState[formId]

    useEffect(() => {
        const newFormId = getFormInfo(ref.current).formId
        if (!multiStepFormState[newFormId]) {
            setMultiStepFormState({})
        }

        setFormId(newFormId)
    }, [])

    let hidden = false
    if (isOptimizing || !state) {
        hidden = prev
    } else if (state?.pageHistory) {
        const page = state.pageHistory[state.pageHistory.length - 1]

        if (prev) {
            hidden = page === 0
        } else {
            hidden = state.isEndPage
        }
    }

    if (hidden && !isCanvas) {
        return <HideElement ref={ref} />
    }

    function onClick() {
        if (state) {
            if (prev) {
                state.previousPage()
            } else {
                state.nextPage()
            }
        }
        props.click?.()
    }

    if (props.appearance == "custom") {
        let layer = props.customLayer?.[0]
        const width = props.style?.width
        const height = props.style?.height
        if (layer && props.style && (width || height)) {
            layer = cloneElement(layer, {
                style: {
                    ...layer.props.style,
                    ...(width && { width: width }),
                    ...(height && { height: height }),
                },
            })
        }

        return (
            <button
                ref={ref}
                style={{ display: "contents" }}
                onClick={onClick}
                onMouseEnter={props.hover}
            >
                {layer}
            </button>
        )
    }

    return (
        <motion.button
            ref={ref}
            type="button"
            onClick={onClick}
            onMouseEnter={props.hover}
            className={hidden && isCanvas ? CANVAS_HIDDEN_CLASS_NAME : ""}
            whileFocus={{
                ...createBackground(props.fill, null, true),
                borderColor: props.border?.colorFocus ?? props.border?.color,
            }}
            style={{
                position: "relative",
                display: "flex",
                justifyContent: props.font?.textAlign || "center",
                alignItems: "center",
                ...createBackground(props.fill),
                border: "none",
                color: props.color,
                padding: props.padding,
                borderRadius: props.radius,
                userSelect: "none",
                cursor: "pointer",
                textWrap: props.style?.width == "100%" ? undefined : "nowrap",
                boxShadow: props.shadows,
                borderColor: props.border?.color,
                ...props.font,
                ...props.style,
            }}
            transition={props.transition}
        >
            {props.text}
            <Border {...props.border} />
            {hidden && isCanvas && (
                <style>{`
                [data-framer-component-container="true"] div:has(> .${CANVAS_HIDDEN_CLASS_NAME}) {
                    display: none !important;
                }`}</style>
            )}
        </motion.button>
    )
}

MultiStepFormButton.displayName = "Multi-Step Form Button"

addPropertyControls(MultiStepFormButton, {
    page: {
        type: ControlType.Enum,
        defaultValue: "next",
        options: ["previous", "next"],
        optionTitles: ["Previous", "Next"],
        displaySegmentedControl: true,
    },
    autoHide: {
        type: ControlType.Boolean,
        defaultValue: true,
        title: "Auto-Hide",
        description: "Hide on first/last page",
    },
    appearance: {
        type: ControlType.Enum,
        defaultValue: "default",
        options: ["default", "custom"],
        optionTitles: ["Default", "Custom"],
        displaySegmentedControl: true,
    },
    customLayer: {
        type: ControlType.ComponentInstance,
        title: "Layer",
        description: "Connect a custom layer outside the breakpoint",
        hidden: (props) => props.appearance !== "custom",
    },
    text: {
        type: ControlType.String,
        defaultValue: "Next",
        hidden: (props) => props.appearance !== "default",
    },
    fill: fillProp({
        focus: true,
        invalid: false,
        color: "#333",
        colorA: "#8C8C8C",
        colorB: "#000",
        hidden: (props) => props.appearance !== "default",
    }),
    color: {
        type: ControlType.Color,
        defaultValue: "#FFF",
        hidden: (props) => props.appearance !== "default",
    },
    font: {
        type: "font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: 14,
            lineHeight: 1.2,
        },
        hidden: (props) => props.appearance !== "default",
    },
    padding: {
        type: ControlType.Padding,
        defaultValue: "10px 16px 10px 16px",
        hidden: (props) => props.appearance !== "default",
    },
    radius: {
        type: ControlType.BorderRadius,
        defaultValue: "10px",
        hidden: (props) => props.appearance !== "default",
    },
    border: borderProp({
        focus: true,
        color: "#0099FF00",
        hidden: (props) => props.appearance !== "default",
    }),
    shadows: {
        type: ControlType.BoxShadow,
        hidden: (props) => props.appearance !== "default",
    },
    transition: {
        type: ControlType.Transition,
        defaultValue: { type: false },
        hidden: (props) => props.appearance !== "default",
    },
    click: {
        type: ControlType.EventHandler,
    },
    hover: {
        type: ControlType.EventHandler,
    },
})
