import {
    addPropertyControls,
    ControlType,
    Link,
    RenderTarget,
    Image,
} from "framer"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import {
    FormIcon,
    iconPropertyControls,
    useFormStore,
    createBackground,
    fillProp,
    fillPropOnOff,
} from "https://framer.com/m/SharedFormCode-HQOZ.js@pl3ng44Hc2Iq0qNooDOc"
import {
    countries,
    countryEmojis,
} from "https://framer.com/m/Countries-9rNQ.js@ODe8DhLtilxFv110E4dB"

const NO_REQUIRED_TYPES = ["checkbox", "consent", "slider"]
const NO_PREFILL_TYPES = ["consent"]
const CHARACTER_LIMIT_TYPES = ["input", "textArea"]
const CHECKBOX_TYPES = ["checkbox", "consent", "multiSelect"]
const OPTIONS_TYPES = ["dropdown", "radio", "multiSelect"]
const TEXT_PLACEHOLDER_TYPES = ["input", "textArea"]
const PLACEHOLDER_FONT_COLOR_TYPES = [
    "input",
    "textArea",
    "number",
    "email",
    "phoneNumber",
    "dropdown",
    "country",
]
const GAP_TYPES = ["checkbox", "consent", "slider", "nps", "phoneNumber"]
const GAP_HV_TYPES = ["radio", "multiSelect", "imageSelect"]
const MIN_MAX_STEP_TYPES = ["number", "slider"]
const BOOLEAN_VALUE_TYPES = ["checkbox", "consent"]
const INVALID_STATE = {
    valid: false,
    required: "required",
    value: "value",
}
const DROPDOWN_NONE_SELECTED_VALUE = "[{(None Selected)}]"
const DASHES_ONLY_REGEX = /^-+$/

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 500
 */
export default function FormField(props) {
    const {
        formId,
        type,
        name,
        options,
        gap,
        border,
        icon,
        consentLink,
        invalidStyle,
        checkboxStyle,
        booleanValues,
    } = props

    const id = props.id ?? "a" + String(Math.floor(Math.random() * 999999999))

    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const required = NO_REQUIRED_TYPES.includes(type) ? true : props.required
    const iconOnLeft = icon?.position == "left"

    const pt = props.paddingIsMixed ? props.paddingTop : props.padding
    const pl = props.paddingIsMixed ? props.paddingLeft : props.padding
    const pb = props.paddingIsMixed ? props.paddingBottom : props.padding
    const pr = props.paddingIsMixed ? props.paddingRight : props.padding
    const plIcon = pl + (icon && iconOnLeft ? icon.size + icon.gap : 0)
    const prIcon = pr + (icon && !iconOnLeft ? icon.size + icon.gap : 0)

    const minHeight = icon ? pt + icon.size + pb : undefined

    const [formState, setFormState] = useFormStore()
    const value = formState[formId]?.[name]?.value

    const [invalid, setInvalid] = useState(INVALID_STATE.valid)
    const invalidRef = useRef(INVALID_STATE.valid)
    const ref = useRef(null)

    function updateField(key, value) {
        setFormState((prev) => ({
            [formId]: {
                ...prev[formId],
                [name]: {
                    ...prev[formId]?.[name],
                    [key]: value,
                },
            },
        }))
    }

    function invalidate(newState) {
        invalidRef.current = newState
        setInvalid(newState)
    }

    function revalidate() {
        invalidRef.current = INVALID_STATE.valid
        setInvalid(INVALID_STATE.valid)
    }

    async function isValid(value) {
        let valid = true

        if (required) {
            switch (type) {
                case "input":
                case "textArea":
                case "email":
                case "url":
                    valid = value && value.length > 0
                    break
                case "phoneNumber":
                    if (props.phoneNumberCountryCode) {
                        valid =
                            Array.isArray(value) &&
                            value[0]?.length > 0 &&
                            value[1]?.length > 0
                    } else {
                        valid = Array.isArray(value) && value[1]?.length
                    }
                    break
                case "multiSelect":
                case "imageSelect":
                    valid = Array.isArray(value) && value.length > 0
                    break
                case "consent":
                    valid = value == booleanValues.on
                    break
                default:
                    valid = value != null
                    break
            }
        }

        // Invalidate and early return
        if (!valid) {
            invalidate(INVALID_STATE.required)
            return valid
        }

        // Check field value validity
        switch (type) {
            case "email":
                if (value.length > 0) {
                    const { emailFilters } = props

                    if (!isEmailAddress(value)) {
                        valid = false
                    }

                    const domain = value.split("@")[1]

                    if (valid) {
                        for (const blockedDomain of emailFilters.blockedDomains.split(
                            "\n"
                        )) {
                            if (blockedDomain == domain) {
                                valid = false
                                break
                            }
                        }
                    }

                    if (valid && emailFilters.businessEmailsOnly) {
                        try {
                            const response = await fetch(
                                "https://f.hubspotusercontent40.net/hubfs/2832391/Marketing/Lead-Capture/free-domains-2.csv"
                            )
                            if (!response.ok) {
                                throw new Error("Network response was not ok")
                            }
                            const data = await response.text()
                            valid = !data.split("\r\n").includes(domain)
                        } catch (error) {
                            console.error(
                                "Error fetching email domains list:",
                                error
                            )
                        }
                    }

                    if (emailFilters.blockedDomains.length > 0) {
                        for (const domain of emailFilters.blockedDomains) {
                            if (value.endsWith(domain)) {
                                return false
                            }
                        }
                    }
                }
                break
            case "input":
            case "textArea":
                if (
                    props.textCharacterLimit &&
                    (value.length < props.textCharacterLimit.min ||
                        value.length > props.textCharacterLimit.max)
                ) {
                    valid = false
                }
                break
            case "url":
                if (
                    value.length > 0 &&
                    !parseURL(value, props.urlAcceptedDomains)[0]
                ) {
                    valid = false
                }
                break
        }

        if (!valid) {
            invalidate(INVALID_STATE.value)
        }

        return valid
    }

    useEffect(() => {
        let defaultValue = null
        switch (type) {
            case "input":
            case "textArea":
            case "email":
            case "url":
                defaultValue = ""
                break
            case "checkbox":
                defaultValue = booleanValues.off
                break
            case "consent":
                defaultValue = props.defaultChecked ? booleanValues.on : null
                break
            case "dropdown":
                defaultValue = options.includes(props.dropdownDefaultValue)
                    ? props.dropdownDefaultValue
                    : null
                break
            case "multiSelect":
            case "imageSelect":
                defaultValue = []
                break
            case "phoneNumber":
                defaultValue = [
                    props.phoneNumberCountryCode
                        ? String(
                              props.phoneNumberCountryCode.defaultCountryCode
                          )
                        : null,
                    "",
                ]
                break
            case "slider":
                defaultValue = props.sliderDefaultValue
                break
            case "country":
                defaultValue =
                    props.countryDefaultValue == "none"
                        ? null
                        : props.countryDefaultValue
                break
        }

        let prefillValue = null

        if (props.prefill && !NO_PREFILL_TYPES.includes(type)) {
            const urlParam = props.prefillUrlParameter || props.name
            const searchParams = new URLSearchParams(window.location.search)

            if (searchParams.has(urlParam)) {
                const param = searchParams.get(urlParam)

                switch (type) {
                    case "checkbox":
                        prefillValue = ["true", "yes", "on", "y"].includes(
                            param.toLowerCase()
                        )
                            ? booleanValues.on
                            : booleanValues.off
                        break
                    case "number":
                        if (isNumber(param)) {
                            prefillValue = Number(param)
                        }
                        break
                    case "slider":
                        if (isNumber(param)) {
                            prefillValue = Math.min(
                                Math.max(Number(param), props.min),
                                props.max
                            )
                        }
                        break
                    case "multiSelect":
                        const values = param.split(/,\s*/)

                        prefillValue = []
                        for (const value of values) {
                            if (options.includes(value)) {
                                prefillValue.push(value)
                            }
                        }
                        break
                    case "imageSelect":
                        const optionNames = props.imageOptions.map(
                            (v) => v.name
                        )
                        if (props.imageSelectMultiSelect) {
                            const values = param.split(/,\s*/)

                            prefillValue = []
                            for (const value of values) {
                                if (optionNames.includes(value)) {
                                    prefillValue.push(value)
                                }
                            }
                        } else {
                            if (optionNames.includes(param)) {
                                prefillValue = [param]
                            }
                        }
                    case "radio":
                    case "dropdown":
                        if (options.includes(param)) {
                            prefillValue = param
                        }
                        break
                    case "nps":
                        if (isNumber(param)) {
                            prefillValue = Math.min(
                                Math.max(Number(param), 0),
                                props.npsMax
                            )
                        }
                        break
                    case "phoneNumber":
                        break
                    default:
                        if (param !== "") {
                            prefillValue = param
                        }
                        break
                }
            }
        }

        const otherFieldData = {}
        if (type == "phoneNumber") {
            otherFieldData.processValue = (value) => {
                if (props.phoneNumberCountryCode && value[0] != null) {
                    return `+${value[0]}${value[1]}`
                } else {
                    return String(value[1])
                }
            }
        }

        setFormState((prev) => {
            return {
                [formId]: {
                    ...prev[formId],
                    [name]: {
                        ref,
                        class: "formField",
                        value: prev[formId]?.[name]
                            ? prev[formId]?.[name].value
                            : (prefillValue ?? defaultValue),
                        defaultValue,
                        name,
                        required,
                        visible: true,
                        isValid,
                        type,
                        ...otherFieldData,
                    },
                },
            }
        })

        return () => {
            updateField("visible", false)
        }
    }, [])

    const borderRadius = props.radiusIsMixed
        ? `${props.radiusTopLeft}px ${props.radiusTopRight}px ${props.radiusBottomRight}px ${props.radiusBottomLeft}px`
        : `${props.radius}px`
    const style = {
        flex: 1,
        border: "none",
        outline: "none",
        backgroundColor: "transparent",
        paddingTop: pt,
        paddingRight: prIcon,
        paddingBottom: pb,
        paddingLeft: plIcon,
        color: props.fontColor,
        ...props.font,
        ...props.style,
    }

    function onChangeEventTargetValue(event) {
        updateField("value", event.target.value)
    }

    const elements = []

    switch (type) {
        case "input":
            elements.push(
                <input
                    value={value}
                    onChange={onChangeEventTargetValue}
                    onFocus={revalidate}
                    style={style}
                    placeholder={props.textPlaceholder}
                    maxLength={props.textCharacterLimit?.max || undefined}
                />
            )
            break
        case "checkbox":
        case "consent":
            elements.push(
                <label
                    style={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "row",
                        cursor: "pointer",
                        alignItems: "center",
                        gap: gap,
                        ...style,
                    }}
                >
                    <Checkbox
                        {...checkboxStyle}
                        on={value === booleanValues.on}
                    />
                    <input
                        type="checkbox"
                        name={name}
                        checked={value === booleanValues.on}
                        onChange={(event) => {
                            updateField(
                                "value",
                                event.target.checked
                                    ? booleanValues.on
                                    : type == "checkbox"
                                      ? booleanValues.off
                                      : null
                            )
                        }}
                        onFocus={revalidate}
                        style={{
                            position: "absolute",
                            pointerEvents: "none",
                            opacity: 0,
                        }}
                    />
                    {type == "checkbox" ? (
                        props.checkboxText
                    ) : (
                        <span>
                            {props.consentText}
                            {props.consentLinkText.length > 0 && (
                                <Link
                                    href={consentLink.link}
                                    openInNewTab={consentLink.newTab}
                                >
                                    <motion.a
                                        whileHover={{
                                            color: consentLink.hoverColor,
                                            textDecoration:
                                                consentLink.underline == "hover"
                                                    ? "underline"
                                                    : undefined,
                                        }}
                                        whileTap={{
                                            color: consentLink.pressColor,
                                        }}
                                        style={{
                                            color: consentLink.color,
                                            textDecoration:
                                                consentLink.underline == "yes"
                                                    ? "underline"
                                                    : "none",
                                        }}
                                        initial={false}
                                        transition={{
                                            type: false,
                                        }}
                                    >
                                        {props.consentLinkText}
                                    </motion.a>
                                </Link>
                            )}
                            {props.consentSuffixText}
                        </span>
                    )}
                </label>
            )
            break
        case "dropdown":
            const dropdownNoneSelected =
                value == null || !options.includes(value)

            elements.push(
                <Dropdown
                    style={style}
                    baseStyle={props.style}
                    value={
                        dropdownNoneSelected
                            ? DROPDOWN_NONE_SELECTED_VALUE
                            : value
                    }
                    onChange={(event) => {
                        updateField(
                            "value",
                            event.target.value == DROPDOWN_NONE_SELECTED_VALUE
                                ? null
                                : event.target.value
                        )
                    }}
                    onFocus={revalidate}
                    fontColor={
                        dropdownNoneSelected
                            ? props.placeholderFontColor
                            : style.color
                    }
                    paddingRight={prIcon}
                    arrow={props.dropdownArrow}
                >
                    {!options.includes(props.dropdownDefaultValue) && [
                        <option
                            value={DROPDOWN_NONE_SELECTED_VALUE}
                            disabled={required}
                        >
                            {props.dropdownNoneSelectedText}
                        </option>,
                        <hr />,
                    ]}
                    {options.map((option, index) =>
                        DASHES_ONLY_REGEX.test(option) && option.length >= 3 ? (
                            <hr />
                        ) : (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        )
                    )}
                </Dropdown>
            )
            break
        case "textArea":
            const { textAreaHeight } = props
            const useMinMaxHeight = textAreaHeight.mode !== "fixed"
            const minHeightCalc = `calc(${textAreaHeight.minLines}lh + ${
                pt + pb
            }px)`

            elements.push(
                <div
                    style={{
                        borderRadius,
                        overflow: "hidden",
                        flex: 1,
                    }}
                >
                    <textarea
                        value={value}
                        onChange={onChangeEventTargetValue}
                        onFocus={revalidate}
                        rows={
                            textAreaHeight.mode == "fixed"
                                ? textAreaHeight.lines
                                : 1
                        }
                        style={{
                            display: "block",
                            minHeight: useMinMaxHeight
                                ? minHeight
                                    ? `max(${minHeight}px, ${minHeightCalc})`
                                    : minHeightCalc
                                : minHeight,
                            maxHeight: useMinMaxHeight
                                ? `calc(${textAreaHeight.maxLines}lh + ${
                                      pt + pb
                                  }px)`
                                : undefined,
                            fieldSizing:
                                textAreaHeight.mode == "auto"
                                    ? "content"
                                    : undefined,
                            resize:
                                textAreaHeight.mode == "resizable"
                                    ? "vertical"
                                    : "none",
                            ...style,
                        }}
                        placeholder={props.textPlaceholder}
                        maxLength={props.textCharacterLimit?.max || undefined}
                    />
                </div>
            )

            if (!props.textAreaScrollbar) {
                elements.push(
                    <style>
                        {`#${id} textarea::-webkit-scrollbar {
                            display: none; /* WebKit browsers (Chrome, Safari) */
                        }
                        #${id} textarea {
                            -ms-overflow-style: none; /* IE and Edge */
                            scrollbar-width: none; /* Firefox */
                        }
                        #${id} textarea {
                            scrollbar-width: none; /* Firefox */
                        }`}
                    </style>
                )
            }
            break
        case "multiSelect":
            const multiSelectArray = Array.isArray(value) ? value : []

            const multiSelectOnChange = (event) => {
                const multiSelectValue = event.target.checked
                    ? [...multiSelectArray, event.target.name]
                    : multiSelectArray.filter((v) => v !== event.target.name)
                updateField("value", multiSelectValue)
            }

            elements.push(
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: props.gapV,
                        ...style,
                    }}
                >
                    {props.options.map((option, index) => (
                        <label
                            key={index}
                            style={{
                                position: "relative",
                                display: "flex",
                                flexDirection: "row",
                                gap: props.gapH,
                                alignItems: "center",
                                cursor: "pointer",
                            }}
                        >
                            <Checkbox
                                {...checkboxStyle}
                                on={multiSelectArray.includes(option)}
                            />
                            <input
                                type="checkbox"
                                name={option}
                                checked={multiSelectArray.includes(option)}
                                onChange={multiSelectOnChange}
                                onFocus={revalidate}
                                style={{
                                    position: "absolute",
                                    pointerEvents: "none",
                                    opacity: 0,
                                }}
                            />
                            {option}
                        </label>
                    ))}
                </div>
            )
            break
        case "radio":
            const { radioStyle } = props
            const radioBorder = radioStyle.border
            const radioDotPadding = (radioStyle.size - radioStyle.dotSize) / 2

            elements.push(
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: props.gapV,
                        ...style,
                    }}
                >
                    {props.options.map((option, index) => (
                        <label
                            key={index}
                            onClick={() => {
                                updateField(
                                    "value",
                                    value === option ? "" : option
                                )
                            }}
                            style={{
                                position: "relative",
                                display: "flex",
                                flexDirection: "row",
                                gap: props.gapH,
                                alignItems: "center",
                                cursor: "pointer",
                            }}
                        >
                            <motion.div
                                animate={{
                                    backgroundColor:
                                        value === option
                                            ? radioStyle.fillOn
                                            : radioStyle.fillOff,
                                    boxShadow:
                                        value === option
                                            ? radioStyle.shadowOn
                                            : radioStyle.shadowOff,
                                }}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: radioStyle.size,
                                    height: radioStyle.size,
                                    minWidth: radioStyle.size,
                                    borderRadius: radioStyle.radius,
                                    position: "relative",
                                }}
                                initial={false}
                                transition={radioStyle.transition}
                            >
                                {radioStyle.dotColor && (
                                    <motion.div
                                        animate={{
                                            scale: value === option ? 1 : 0.5,
                                            opacity: value === option ? 1 : 0,
                                        }}
                                        style={{
                                            position: "absolute",
                                            left: radioDotPadding,
                                            top: radioDotPadding,
                                            width: radioStyle.dotSize,
                                            height: radioStyle.dotSize,
                                            backgroundColor:
                                                radioStyle.dotColor,
                                            borderRadius: Math.max(
                                                0,
                                                radioStyle.radius -
                                                    radioDotPadding
                                            ),
                                        }}
                                        initial={false}
                                        transition={radioStyle.transition}
                                    />
                                )}
                                {radioBorder && (
                                    <motion.div
                                        animate={{
                                            borderColor:
                                                value === option
                                                    ? radioBorder.colorOn
                                                    : radioBorder.colorOff,
                                        }}
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            borderWidth:
                                                radioBorder.widthIsMixed
                                                    ? `${radioBorder.widthTop}px ${radioBorder.widthRight}px ${radioBorder.widthBottom}px ${radioBorder.widthLeft}px`
                                                    : `${radioBorder.width}px`,
                                            borderStyle: radioBorder.style,
                                            borderRadius: radioStyle.radius,
                                            pointerEvents: "none",
                                        }}
                                        initial={false}
                                        transition={radioStyle.transition}
                                    />
                                )}
                            </motion.div>
                            {option}
                        </label>
                    ))}
                </div>
            )
            break
        case "imageSelect":
            const {
                imageOptions,
                imageSelectButtons,
                imageSelectColumns,
                imageSelectMultiSelect,
            } = props

            const imageStyle = {
                position: "relative",
                width: "100%",
                height: "auto",
                aspectRatio:
                    imageSelectButtons.images.aspectRatioMode == "fixed"
                        ? imageSelectButtons.images.aspectRatio
                        : undefined,
                borderRadius: imageSelectButtons.images.radius,
                pointerEvents: "none",
                objectFit: "cover",
            }
            const imageSelectArray = Array.isArray(value) ? value : []

            const rows = []

            for (let i = 0; i < imageOptions.length; i++) {
                const option = imageOptions[i]
                const selected = imageSelectMultiSelect
                    ? imageSelectArray.includes(option.name)
                    : imageSelectArray.length === 1 &&
                      imageSelectArray[0] === option.name

                if (i % imageSelectColumns == 0) {
                    rows.push([])
                }

                let layoutProps = {}
                if (
                    imageOptions.length % imageSelectColumns == 0 ||
                    imageOptions.length - i >= imageSelectColumns
                ) {
                    layoutProps = { flex: 1 }
                } else {
                    layoutProps = {
                        flexBasis: `calc(${100 / imageSelectColumns}% - ${
                            props.gapH * (1 - 1 / imageSelectColumns)
                        }px)`,
                    }
                }

                const onClick = () => {
                    if (imageSelectMultiSelect) {
                        updateField(
                            "value",
                            selected
                                ? imageSelectArray.filter(
                                      (v) => v !== option.name
                                  )
                                : [...imageSelectArray, option.name]
                        )
                    } else {
                        updateField("value", selected ? [] : [option.name])
                    }
                }

                rows[rows.length - 1]?.push(
                    <motion.div
                        key={option.name}
                        onClick={onClick}
                        animate={{
                            ...createBackground(
                                imageSelectButtons.fill,
                                selected
                            ),
                            color: selected
                                ? imageSelectButtons.text?.fontColorOn
                                : imageSelectButtons.text?.fontColorOff,
                            boxShadow: selected
                                ? imageSelectButtons.shadowOn
                                : imageSelectButtons.shadowOff,
                        }}
                        style={{
                            position: "relative",
                            display: "flex",
                            flexDirection:
                                imageSelectButtons.text?.location == "bottom"
                                    ? "column-reverse"
                                    : "column",
                            gap: imageSelectButtons.text?.gap,
                            padding: imageSelectButtons.padding,
                            borderRadius: imageSelectButtons.radius,
                            cursor: "pointer",
                            overflow: "hidden",
                            ...layoutProps,
                        }}
                        initial={false}
                        transition={imageSelectButtons.transition}
                    >
                        {imageSelectButtons.text && (
                            <span
                                style={{
                                    minHeight: "1lh",
                                }}
                            >
                                {option.name}
                            </span>
                        )}
                        <div
                            style={{
                                width: "100%",
                                flex: 1,
                                display: "flex",
                                alignItems: imageSelectButtons.images.align,
                            }}
                        >
                            {option.image ? (
                                isCanvas ? (
                                    <img
                                        src={option.image.src}
                                        alt={option.image.alt || option.name}
                                        style={imageStyle}
                                    />
                                ) : (
                                    <Image
                                        className={`${props.id}-image`}
                                        background={{
                                            fit: "fill",
                                            ...option.image,
                                            alt:
                                                option.image.alt || option.name,
                                        }}
                                        style={imageStyle}
                                    />
                                )
                            ) : (
                                <svg
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 38 38"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{
                                        border: "1px solid #808080",
                                        backgroundColor: "#80808033",
                                        borderRadius:
                                            imageSelectButtons.images.radius,
                                    }}
                                >
                                    <path
                                        d="M22 15H22.01"
                                        stroke="#808080"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                    <path
                                        d="M10 13C10 12.2044 10.3161 11.4413 10.8787 10.8787C11.4413 10.3161 12.2044 10 13 10H25C25.7956 10 26.5587 10.3161 27.1213 10.8787C27.6839 11.4413 28 12.2044 28 13V25C28 25.7956 27.6839 26.5587 27.1213 27.1213C26.5587 27.6839 25.7956 28 25 28H13C12.2044 28 11.4413 27.6839 10.8787 27.1213C10.3161 26.5587 10 25.7956 10 25V13Z"
                                        stroke="#808080"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                    <path
                                        d="M10 23.0001L15 18.0001C15.928 17.1071 17.072 17.1071 18 18.0001L23 23.0001"
                                        stroke="#808080"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                    <path
                                        d="M21 21.0001L22 20.0001C22.928 19.1071 24.072 19.1071 25 20.0001L28 23.0001"
                                        stroke="#808080"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            )}
                        </div>
                        {imageSelectButtons.border && (
                            <motion.div
                                animate={{
                                    borderColor: selected
                                        ? imageSelectButtons.border.colorOn
                                        : imageSelectButtons.border.colorOff,
                                }}
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    borderWidth:
                                        imageSelectButtons.border.width,
                                    borderStyle:
                                        imageSelectButtons.border.style,
                                    borderRadius: "inherit",
                                    pointerEvents: "none",
                                }}
                                initial={false}
                                transition={imageSelectButtons.transition}
                            />
                        )}
                    </motion.div>
                )
            }

            elements.push(
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: props.gapV,
                        flex: 1,
                        ...style,
                        ...imageSelectButtons.text?.font,
                    }}
                >
                    {rows.map((items, index) => (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: props.gapH,
                                width: "100%",
                                alignItems:
                                    imageSelectButtons.height == "fill"
                                        ? "stretch"
                                        : "start",
                                justifyContent: props.imageSelectAlign,
                            }}
                        >
                            {items}
                        </div>
                    ))}
                    <style>{`
                        .${props.id}-image > div {
                            position: relative !important;
                            ${
                                imageSelectButtons.images.aspectRatioMode ==
                                "fixed"
                                    ? "height: 100%;"
                                    : ""
                            }
                        }
                    `}</style>
                </div>
            )
            break
        case "number":
            const numberUpdateFormState = (event) => {
                const roundedValue =
                    Math.round(Number(event.target.value) / props.step) *
                    props.step
                const boundedValue = Math.min(
                    Math.max(roundedValue, props.min),
                    props.max
                )
                updateField("value", boundedValue)
            }

            const numberOnFocusLost = (event) => {
                numberUpdateFormState(event)
            }

            const numberOnKeyDown = (event) => {
                if (event.key === "Enter") {
                    numberUpdateFormState(event)
                }
            }

            elements.push(
                <input
                    type="number"
                    value={value == null ? "" : value}
                    onChange={onChangeEventTargetValue} // Handle input changes
                    onFocus={revalidate}
                    onKeyDown={numberOnKeyDown}
                    onBlur={numberOnFocusLost}
                    style={style}
                    placeholder={props.numberPlaceholder}
                    min={props.min}
                    max={props.max}
                    step={props.step}
                />
            )
            break
        case "slider":
            const track = props.sliderTrack
            const handle = props.sliderHandle

            const handleCSS = `appearance: none;
                -webkit-appearance: none;
                width: ${handle.size}px;
                height: ${handle.size}px;
                border-radius: ${handle.radius}px;
                background-color: ${handle.color};
                box-sizing: border-box;
                translate: 0 ${
                    (-handle.size + track.height) / 2 -
                    (track.border
                        ? Math.min(track.border.width, track.height / 2)
                        : 0)
                }px;
                border-width: ${handle.border?.width || 0}px;
                border-style: ${handle.border ? "solid" : "none"};
                border-color: ${handle.border?.color || "none"};`

            const trackCSS = `appearance: none;
                -webkit-appearance: none;
                height: ${track.height}px;
                border-radius: ${track.radius}px;
                background-color: ${track.color};
                box-sizing: border-box;
                border-width: ${track.border?.width || 0}px;
                border-style: ${track.border ? "solid" : "none"};
                border-color: ${track.border?.color || "none"};`

            elements.push(
                <div
                    style={{
                        display: "flex",
                        flexDirection:
                            props.sliderLabel?.position == "right"
                                ? "row-reverse"
                                : "row",
                        gap: gap,
                        alignItems: "center",
                        ...style,
                    }}
                >
                    {props.sliderLabel && (
                        <p
                            style={{
                                margin: 0,
                                minWidth: props.sliderLabel.minWidth,
                            }}
                        >
                            {props.sliderLabel.prefix}
                            {value || props.sliderDefaultValue}
                            {props.sliderLabel.suffix}
                        </p>
                    )}
                    <input
                        type="range"
                        min={props.min}
                        max={props.max}
                        step={props.step}
                        value={value || props.sliderDefaultValue}
                        onChange={onChangeEventTargetValue}
                        onFocus={revalidate}
                        style={{
                            flex: 1,
                            appearance: "none",
                            outline: "none",
                            margin: 0,
                            cursor: "pointer",
                            height: Math.max(handle.size, track.height),
                            background: "none",
                        }}
                    />
                </div>,
                <style>
                    {`#${id} input[type=range]::-webkit-slider-thumb {${handleCSS}}
                    #${id} input[type=range]::-moz-range-thumb {${handleCSS}}

                    #${id} input[type=range]::-webkit-slider-runnable-track {${trackCSS}}
                    #${id} input[type=range]::-moz-range-track {${trackCSS}}
                    #${id} input[type=range]::-moz-range-progress {${trackCSS}}
                    `}
                </style>
            )
            break
        case "nps":
            const { npsButtons, npsLabels } = props
            const { innerRadius, outerRadius } = npsButtons
            const buttonBorder = npsButtons.border

            elements.push(
                <div
                    style={{
                        display: "flex",
                        flexDirection:
                            npsLabels?.location == "bottom"
                                ? "column-reverse"
                                : "column",
                        gap: gap,
                        ...style,
                        width: undefined,
                    }}
                >
                    {npsLabels && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <span>{npsLabels.left}</span>
                            <span>{npsLabels.right}</span>
                        </div>
                    )}
                    <div
                        style={{
                            display: "flex",
                            gap: npsButtons.gap,
                        }}
                    >
                        {Array.from({ length: props.npsMax + 1 }).map(
                            (_, index) => {
                                const selected = value === index
                                const radius =
                                    index == 0
                                        ? `${outerRadius}px ${innerRadius}px ${innerRadius}px ${outerRadius}px`
                                        : index == props.npsMax
                                          ? `${innerRadius}px ${outerRadius}px ${outerRadius}px ${innerRadius}px`
                                          : `${innerRadius}px`

                                return (
                                    <motion.button
                                        key={index}
                                        animate={{
                                            ...createBackground(
                                                npsButtons.fill,
                                                selected
                                            ),
                                            color: selected
                                                ? npsButtons.selectedFontColor
                                                : npsButtons.deelectedFontColor,
                                        }}
                                        style={{
                                            position: "relative",
                                            flex: 1,
                                            height: npsButtons.height,
                                            border: "none",
                                            outline: "none",
                                            borderRadius: radius,
                                            minWidth: npsButtons.minWidth,
                                            cursor: "pointer",
                                            ...npsButtons.font,
                                        }}
                                        onClick={() => {
                                            updateField(
                                                "value",
                                                selected ? null : index
                                            )
                                            revalidate()
                                        }}
                                        initial={false}
                                        transition={npsButtons.transition}
                                    >
                                        {index}
                                        {buttonBorder && (
                                            <motion.div
                                                animate={{
                                                    borderColor: selected
                                                        ? buttonBorder.selectedColor
                                                        : buttonBorder.deselectedColor,
                                                }}
                                                style={{
                                                    position: "absolute",
                                                    inset: 0,
                                                    borderWidth:
                                                        buttonBorder.widthIsMixed
                                                            ? `${buttonBorder.widthTop}px ${buttonBorder.widthRight}px ${buttonBorder.widthBottom}px ${buttonBorder.widthLeft}px`
                                                            : `${buttonBorder.width}px`,
                                                    borderStyle:
                                                        buttonBorder.style,
                                                    borderRadius: radius,
                                                    pointerEvents: "none",
                                                }}
                                                initial={false}
                                                transition={
                                                    npsButtons.transition
                                                }
                                            />
                                        )}
                                    </motion.button>
                                )
                            }
                        )}
                    </div>
                </div>
            )
            break
        case "date":
        case "time":
            elements.push(
                <input
                    type={type}
                    value={value == null ? "" : value}
                    onChange={onChangeEventTargetValue}
                    onFocus={revalidate}
                    style={{
                        ...style,
                    }}
                />,
                <style>{`#${id} input::-webkit-datetime-edit {
                    flex: 0 1 auto;
                    z-index: 1;
                    cursor: text;
                    color: ${props.fontColor};
                }
                
                #${id} input::-webkit-calendar-picker-indicator {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    inset: 0;
                    padding: 0;
                    opacity: 0;
                    margin: 0;
                    overflow: visible;
                    cursor: pointer;
                }`}</style>
            )
            break
        case "email":
            function emailOnFocusLost(event) {
                if (
                    event.target.value.length > 0 &&
                    !isEmailAddress(event.target.value)
                ) {
                    invalidate(INVALID_STATE.value)
                }
            }

            elements.push(
                <input
                    type="email"
                    value={value}
                    onChange={onChangeEventTargetValue}
                    onFocus={revalidate}
                    onBlur={emailOnFocusLost}
                    style={style}
                    placeholder={props.emailPlaceholder}
                />
            )
            break
        case "phoneNumber":
            const countryCode = props.phoneNumberCountryCode
            const phoneFormat =
                props.phoneNumberFormat == "custom"
                    ? props.phoneNumberCustomFormat == ""
                        ? "XXXXXXXXXX"
                        : props.phoneNumberCustomFormat
                    : props.phoneNumberFormat

            const phoneValue = Array.isArray(value)
                ? value
                : [
                      countryCode
                          ? String(countryCode.defaultCountryCode)
                          : null,
                      "",
                  ]

            function phoneNumberOnChange(event) {
                const unformatted = unformatPhoneNumber(event.target.value)
                const formattedValue = formatPhoneNumber(
                    phoneValue[1],
                    phoneFormat
                )

                if (
                    !isLastCharacterANumber(formattedValue) &&
                    event.target.value.length < formattedValue.length
                ) {
                    updateField("value", [
                        phoneValue[0],
                        unformatted.slice(0, -1),
                    ])
                } else {
                    updateField("value", [phoneValue[0], unformatted])
                }
            }

            if (countryCode) {
                const countryCodeFormat =
                    countryCode.format == "custom"
                        ? countryCode.customFormat == ""
                            ? "X"
                            : countryCode.customFormat
                        : countryCode.format

                function countryCodeOnChange(event) {
                    const unformatted = unformatCountryCode(
                        event.target.value
                    ).substring(0, 3)
                    const formattedValue = formatCountryCode(
                        phoneValue[0],
                        countryCodeFormat
                    )

                    if (
                        !isLastCharacterANumber(formattedValue) &&
                        event.target.value.length < formattedValue.length
                    ) {
                        updateField("value", [
                            unformatted.slice(0, -1),
                            phoneValue[1],
                        ])
                    } else {
                        updateField("value", [unformatted, phoneValue[1]])
                    }
                }

                function onCountryCodeFocus() {
                    revalidate()

                    const lastChar = countryCodeFormat.slice(-1)
                    if (ref.current && lastChar != "X" && lastChar != "x") {
                        const countryCodeInput =
                            ref.current.querySelector(".countryCode")
                        if (countryCodeInput) {
                            const formattedValue = formatCountryCode(
                                phoneValue[0],
                                countryCodeFormat
                            )
                            const cursorPosition =
                                Math.max(
                                    countryCodeFormat.lastIndexOf("X"),
                                    countryCodeFormat.lastIndexOf("x")
                                ) + phoneValue[0].length

                            setTimeout(
                                () =>
                                    countryCodeInput.setSelectionRange(
                                        cursorPosition,
                                        cursorPosition
                                    ),
                                5
                            )
                        }
                    }
                }

                elements.push(
                    <input
                        type="tel"
                        className="countryCode"
                        value={formatCountryCode(
                            isCanvas
                                ? countryCode.defaultCountryCode
                                : phoneValue[0],
                            countryCodeFormat
                        )}
                        onChange={countryCodeOnChange}
                        onFocus={onCountryCodeFocus}
                        style={{
                            ...style,
                            flex: 0,
                            width: countryCode.width + plIcon,
                            padding: `${pt}px 0 ${pb}px ${plIcon}px`,
                        }}
                        placeholder={formatCountryCode(
                            countryCode.defaultCountryCode,
                            countryCodeFormat
                        )}
                    />
                )
            }

            elements.push(
                <input
                    type="tel"
                    maxLength={phoneFormat.length}
                    value={formatPhoneNumber(phoneValue[1], phoneFormat)}
                    onChange={phoneNumberOnChange}
                    onFocus={revalidate}
                    style={{
                        ...style,
                        padding: `${pt}px ${prIcon}px ${pb}px ${
                            countryCode ? 0 : plIcon
                        }px`,
                    }}
                    placeholder={
                        props.phoneNumberPlaceholder ||
                        replaceXWithNumbers(phoneFormat)
                    }
                />
            )
            break
        case "url":
            function urlOnFocusLost(event) {
                const [urlValid, domain, fullURL] = parseURL(
                    event.target.value,
                    props.urlAcceptedDomains
                )
                if (!urlValid) {
                    invalidate(INVALID_STATE.value)
                }
            }

            elements.push(
                <input
                    type="url"
                    value={value}
                    onChange={onChangeEventTargetValue}
                    onFocus={revalidate}
                    onBlur={urlOnFocusLost}
                    style={style}
                    placeholder={props.urlPlaceholder}
                />
            )
            break
        case "country":
            const countryNoneSelected =
                value == null || !countries.includes(value)

            elements.push(
                <Dropdown
                    style={style}
                    baseStyle={props.style}
                    value={
                        countryNoneSelected
                            ? DROPDOWN_NONE_SELECTED_VALUE
                            : value
                    }
                    onChange={(event) => {
                        updateField(
                            "value",
                            event.target.value == DROPDOWN_NONE_SELECTED_VALUE
                                ? null
                                : event.target.value
                        )
                    }}
                    onFocus={revalidate}
                    fontColor={
                        countryNoneSelected
                            ? props.placeholderFontColor
                            : style.color
                    }
                    paddingRight={prIcon}
                    arrow={props.dropdownArrow}
                >
                    {props.countryDefaultValue == "none" && [
                        <option
                            value={DROPDOWN_NONE_SELECTED_VALUE}
                            disabled={required}
                        >
                            {props.countryNoneSelectedText}
                        </option>,
                        <hr />,
                    ]}
                    {props.pinnedCountries.length > 0 && [
                        ...props.pinnedCountries.map((country, index) => (
                            <option key={country} value={country}>
                                {props.countryEmojis
                                    ? countryEmojis[
                                          countries.indexOf(country)
                                      ] +
                                      " " +
                                      country
                                    : country}
                            </option>
                        )),
                        <hr />,
                    ]}
                    {countries.map((country, index) => (
                        <option key={country} value={country}>
                            {props.countryEmojis
                                ? countryEmojis[index] + " " + country
                                : country}
                        </option>
                    ))}
                </Dropdown>
            )
            break
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                ...props.style,
            }}
        >
            <motion.div
                ref={ref}
                id={id}
                animate={{
                    ...createBackground(
                        invalid && invalidStyle.fill
                            ? invalidStyle.fill
                            : props.fill
                    ),
                }}
                style={{
                    position: "relative",
                    display: "flex",
                    color: props.fontColor,
                    borderRadius: borderRadius,
                    overflow: "visible",
                    minHeight: minHeight,
                    userSelect: "none",
                    boxShadow: props.shadows,
                    ...props.font,
                    ...props.style,
                }}
                initial={false}
                transition={invalidStyle.transition}
            >
                {icon && (
                    <FormIcon
                        icon={icon}
                        style={{
                            position: "absolute",
                            top: `calc(50% - ${icon.size / 2}px)`,
                            left: iconOnLeft ? pl : undefined,
                            right: !iconOnLeft ? pr : undefined,
                        }}
                    />
                )}
                {elements}
                {border && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderWidth: border.widthIsMixed
                                ? `${border.widthTop}px ${border.widthRight}px ${border.widthBottom}px ${border.widthLeft}px`
                                : `${border.width}px`,
                            borderStyle: border.style,
                            borderColor: border.color,
                            borderRadius: borderRadius,
                            pointerEvents: "none",
                        }}
                    />
                )}
                {invalidStyle.border && (
                    <motion.div
                        animate={{
                            opacity: invalid ? 1 : 0,
                        }}
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderWidth: invalidStyle.border.widthIsMixed
                                ? `${invalidStyle.border.widthTop}px ${invalidStyle.border.widthRight}px ${invalidStyle.border.widthBottom}px ${invalidStyle.border.widthLeft}px`
                                : `${invalidStyle.border.width}px`,
                            borderStyle: invalidStyle.border.style,
                            borderColor: invalidStyle.border.color,
                            borderRadius: borderRadius,
                            pointerEvents: "none",
                        }}
                        initial={false}
                        transition={invalidStyle.transition}
                    />
                )}
                {PLACEHOLDER_FONT_COLOR_TYPES.includes(type) && (
                    <style>{`#${id} input::placeholder, #${id} textarea::placeholder {
                        color: ${props.placeholderFontColor};
                    }`}</style>
                )}
            </motion.div>
            {invalid && invalidStyle.errorMessage && (
                <p
                    style={{
                        width: "100%",
                        margin: 0,
                        marginTop: invalidStyle.errorMessage.gap,
                        whiteSpace: "pre",
                        color: invalidStyle.errorMessage.fontColor,
                        ...invalidStyle.errorMessage.font,
                    }}
                >
                    {invalid == INVALID_STATE.required
                        ? invalidStyle.errorMessage.requiredMessage
                        : invalidStyle.errorMessage.invalidMessage}
                </p>
            )}
        </div>
    )
}

FormField.displayName = "Form Field"

addPropertyControls(FormField, {
    formId: {
        type: ControlType.Number,
        defaultValue: 0,
        step: 1,
        min: 0,
        displayStepper: true,
        title: "Form ID",
        description: "Match with Form ID on Submit Button.",
    },
    type: {
        type: ControlType.Enum,
        defaultValue: "input",
        options: [
            "input",
            "checkbox",
            "dropdown",
            "textArea",
            "email",
            "phoneNumber",
            "multiSelect",
            "radio",
            "imageSelect",
            "number",
            "slider",
            "nps",
            "date",
            "time",
            "consent",
            "url",
            "country",
        ],
        optionTitles: [
            "Input",
            "Checkbox",
            "Dropdown",
            "Multiline Text",
            "Email",
            "Phone Number",
            "Multi-Select",
            "Radio",
            "Image Select",
            "Number",
            "Slider",
            "Net Promoter Score",
            "Date",
            "Time",
            "Consent",
            "URL",
            "Country",
        ],
    },
    name: {
        type: ControlType.String,
        defaultValue: "fieldName",
    },
    required: {
        type: ControlType.Boolean,
        defaultValue: false,
        hidden: (props) => NO_REQUIRED_TYPES.includes(props.type),
    },
    defaultChecked: {
        type: ControlType.Boolean,
        title: "Checked by default",
        defaultValue: false,
        hidden: (props) => props.type !== "consent",
    },

    prefill: {
        type: ControlType.Boolean,
        defaultValue: false,
        title: "Pre-fill",
        hidden: (props) => NO_PREFILL_TYPES.includes(props.type),
    },
    prefillUrlParameter: {
        type: ControlType.String,
        defaultValue: "",
        placeholder: "Pre-fill URL Parameter",
        title: " ",
        description:
            "[Documentation ->](https://insertframe.io/docs/how-to-use-pre-filled-fields-in-framerforms)",
        hidden: (props) =>
            NO_PREFILL_TYPES.includes(props.type) || !props.prefill,
    },
    textPlaceholder: {
        title: "Placeholder",
        type: ControlType.String,
        defaultValue: "Type...",
        hidden: (props) => !TEXT_PLACEHOLDER_TYPES.includes(props.type),
    },
    numberPlaceholder: {
        title: "Placeholder",
        type: ControlType.String,
        defaultValue: "0",
        hidden: (props) => props.type != "number",
    },
    emailPlaceholder: {
        title: "Placeholder",
        type: ControlType.String,
        defaultValue: "hello@example.com",
        hidden: (props) => props.type != "email",
    },
    textCharacterLimit: {
        type: ControlType.Object,
        optional: true,
        title: "Character Limit",
        hidden: (props) => !CHARACTER_LIMIT_TYPES.includes(props.type),
        controls: {
            min: {
                type: ControlType.Number,
                defaultValue: 0,
                step: 1,
                title: "Min Characters",
            },
            max: {
                type: ControlType.Number,
                defaultValue: 100,
                step: 1,
                title: "Max Characters",
            },
        },
    },
    phoneNumberFormat: {
        title: "Format",
        type: ControlType.Enum,
        defaultValue: "(123) 456 - 7890",
        options: [
            "(XXX) XXX - XXXX",
            "(XXX) XXX-XXXX",
            "XXX-XXX-XXXX",
            "XXX.XXX.XXXX",
            "XXX XXX XXXX",
            "XXXXXXXXXXX",
            "XX XXXX XXXX",
            "custom",
        ],
        optionTitles: [
            "(123) 456 - 7890",
            "(123) 456-7890",
            "123-456-7890",
            "123.456.7890",
            "123 456 7890",
            "1234567890",
            "12 3456 7890",
            "Custom Format",
        ],
        hidden: (props) => props.type !== "phoneNumber",
    },
    phoneNumberCustomFormat: {
        title: " ",
        type: ControlType.String,
        defaultValue: "(XXX) XXX - XXXX",
        description: "*X* -> phone number",
        hidden: (props) =>
            props.type !== "phoneNumber" ||
            props.phoneNumberFormat !== "custom",
    },
    phoneNumberPlaceholder: {
        type: ControlType.String,
        defaultValue: "",
        placeholder: "Auto",
        title: "Placeholder",
        hidden: (props) => props.type != "phoneNumber",
    },
    phoneNumberCountryCode: {
        type: ControlType.Object,
        title: "Country Code",
        optional: true,
        defaultValue: {
            defaultCountryCode: 1,
            format: "+1",
            width: 40,
        },
        controls: {
            defaultCountryCode: {
                title: "Default",
                type: ControlType.Number,
                min: 0,
                max: 999,
                step: 1,
                defaultValue: 1,
            },
            format: {
                title: "Format",
                type: ControlType.Enum,
                defaultValue: "+1",
                options: ["+X", "(X)", "(+X)", "X", "custom"],
                optionTitles: ["+1", "(1)", "(+1)", "1", "Custom Format"],
            },
            customFormat: {
                title: " ",
                type: ControlType.String,
                defaultValue: "+X",
                description: "*X* -> country code",
                hidden: (props) => props.format !== "custom",
            },
            width: {
                type: ControlType.Number,
                defaultValue: 50,
                min: 1,
                step: 1,
            },
        },
        hidden: (props) => props.type !== "phoneNumber",
    },
    urlAcceptedDomains: {
        type: ControlType.Object,
        optional: true,
        title: "Accepted Domains",
        controls: {
            mode: {
                type: ControlType.Enum,
                defaultValue: "blacklist",
                options: ["blacklist", "whitelist"],
                optionTitles: ["Blacklist", "Whitelist"],
                displaySegmentedControl: true,
            },
            domains: {
                type: ControlType.Array,
                control: {
                    type: ControlType.String,
                    placeholder: "example.com",
                },
                description:
                    "*Blacklist:* URLs from any domains in the list are rejected.\n*Whitelist:* Only URLs from domains in the list are accepted.",
            },
        },
        hidden: (props) => props.type != "url",
    },
    urlPlaceholder: {
        type: ControlType.String,
        defaultValue: "framerforms.com",
        placeholder: "example.com",
        title: "Placeholder",
        hidden: (props) => props.type != "url",
    },
    emailFilters: {
        type: ControlType.Object,
        buttonTitle: "Blocked Emails",
        controls: {
            businessEmailsOnly: {
                type: ControlType.Boolean,
                defaultValue: false,
                description:
                    "Block emails from free email providers such as Gmail and iCloud to require business emails. Uses [HubSpot's Domain List](https://knowledge.hubspot.com/forms/what-domains-are-blocked-when-using-the-forms-email-domains-to-block-feature)",
            },
            blockedDomains: {
                type: ControlType.String,
                displayTextArea: true,
                placeholder: "example.com",
                description:
                    "Block email addresses from domains in the list. One domain per line.",
            },
        },
        hidden: (props) => props.type != "email",
    },
    consentText: {
        type: ControlType.String,
        defaultValue: "I agree to the ",
        title: "Prefix",
        hidden: (props) => props.type != "consent",
    },
    consentLinkText: {
        type: ControlType.String,
        defaultValue: "Terms & Conditions",
        title: "Link Text",
        hidden: (props) => props.type != "consent",
    },
    consentSuffixText: {
        type: ControlType.String,
        defaultValue: ".",
        title: "Suffix",
        hidden: (props) => props.type != "consent",
    },
    consentLink: {
        type: ControlType.Object,
        title: "Link",
        buttonTitle: "Consent Link",
        controls: {
            link: {
                type: ControlType.Link,
            },
            newTab: {
                type: ControlType.Boolean,
                defaultValue: true,
            },
            color: {
                type: ControlType.Color,
                defaultValue: "#0075FF",
            },
            hoverColor: {
                type: ControlType.Color,
                defaultValue: "#2E8FFF",
            },
            pressColor: {
                type: ControlType.Color,
                defaultValue: "#000",
            },
            underline: {
                type: ControlType.Enum,
                defaultValue: "yes",
                options: ["yes", "no", "hover"],
                optionTitles: ["Yes", "No", "Hover"],
                displaySegmentedControl: true,
            },
        },
        hidden: (props) =>
            props.type != "consent" || !props.consentLinkText.length,
    },
    checkboxText: {
        type: ControlType.String,
        defaultValue: "Checkbox",
        title: "Text",
        hidden: (props) => props.type != "checkbox",
    },
    options: {
        title: "Options",
        type: ControlType.Array,
        propertyControl: {
            type: ControlType.String,
        },
        defaultValue: ["Option 1", "Option 2", "Option 3"],
        hidden: (props) => !OPTIONS_TYPES.includes(props.type),
    },
    imageOptions: {
        type: ControlType.Array,
        title: "Options",
        defaultValue: [
            { name: "Option 1" },
            { name: "Option 2" },
            { name: "Option 3" },
        ],
        control: {
            type: ControlType.Object,
            controls: {
                name: {
                    type: ControlType.String,
                },
                image: {
                    type: ControlType.ResponsiveImage,
                },
            },
        },
        hidden: (props) => props.type != "imageSelect",
    },
    imageSelectMultiSelect: {
        type: ControlType.Boolean,
        defaultValue: false,
        title: "Multi-Select",
        hidden: (props) => props.type != "imageSelect",
    },
    imageSelectButtons: {
        type: ControlType.Object,
        title: "Buttons",
        buttonTitle: "Style",
        controls: {
            images: {
                type: ControlType.Object,
                controls: {
                    aspectRatioMode: {
                        type: ControlType.Enum,
                        defaultValue: "auto",
                        options: ["auto", "fixed"],
                        optionTitles: ["Auto", "Fixed"],
                        displaySegmentedControl: true,
                        title: "Aspect Ratio",
                    },
                    aspectRatio: {
                        type: ControlType.String,
                        defaultValue: "1 / 1",
                        placeholder: "Width / Height",
                        title: " ",
                        hidden: (props) => props.aspectRatioMode != "fixed",
                    },
                    align: {
                        type: ControlType.Enum,
                        defaultValue: "center",
                        options: ["start", "center", "end"],
                        optionTitles: ["Top", "Center", "Bottom"],
                        optionIcons: [
                            "align-top",
                            "align-middle",
                            "align-bottom",
                        ],
                        displaySegmentedControl: true,
                        hidden: (props) => props.aspectRatioMode != "auto",
                    },
                    radius: {
                        type: ControlType.BorderRadius,
                        defaultValue: "0px",
                    },
                },
            },
            text: {
                type: ControlType.Object,
                optional: true,
                defaultValue: {
                    location: "top",
                    fontColorDefault: "#000",
                    fontColorSelected: "#000",
                    gap: 10,
                },
                controls: {
                    location: {
                        type: ControlType.Enum,
                        defaultValue: "top",
                        options: ["top", "bottom"],
                        optionTitles: ["Top", "Bottom"],
                        displaySegmentedControl: true,
                    },
                    font: {
                        type: "font",
                        controls: "extended",
                        defaultFontType: "sans-serif",
                        defaultValue: {
                            fontSize: 12,
                            lineHeight: 1,
                            textAlign: "center",
                        },
                    },
                    fontColorOn: {
                        type: ControlType.Color,
                        defaultValue: "#000",
                        title: "Color On",
                    },
                    fontColorOff: {
                        type: ControlType.Color,
                        defaultValue: "#000",
                        title: "Color Off",
                    },
                    gap: {
                        type: ControlType.Number,
                        defaultValue: 10,
                        min: 0,
                        step: 1,
                    },
                },
            },
            fill: fillPropOnOff({
                colorOn: "#EBF4FF",
                colorAOn: "#70B3FF",
                colorBOn: "#0075FF",
                colorOff: "#EDEDED",
                colorAOff: "#EDEDED",
                colorBOff: "#CCC",
            }),
            height: {
                type: ControlType.Enum,
                defaultValue: "fit",
                options: ["fit", "fill"],
                optionTitles: ["Fit", "Fill"],
                displaySegmentedControl: true,
            },
            padding: {
                type: ControlType.Padding,
                defaultValue: "10px",
            },
            radius: {
                type: ControlType.BorderRadius,
                defaultValue: "8px",
            },
            border: {
                type: ControlType.Object,
                optional: true,
                defaultValue: {
                    colorOn: "#0075FF",
                    colorOff: "#EDEDED00",
                    width: "2px",
                    style: "solid",
                },
                controls: {
                    colorOn: {
                        type: ControlType.Color,
                        defaultValue: "#0075FF",
                    },
                    colorOff: {
                        type: ControlType.Color,
                        defaultValue: "#0075FF00",
                    },
                    width: {
                        type: ControlType.Padding,
                        defaultValue: "2px",
                    },
                    style: {
                        type: ControlType.Enum,
                        defaultValue: "solid",
                        options: ["solid", "dashed", "dotted", "double"],
                        optionTitles: ["Solid", "Dashed", "Dotted", "Double"],
                    },
                },
            },
            shadowOn: {
                type: ControlType.BoxShadow,
            },
            shadowOff: {
                type: ControlType.BoxShadow,
            },
            transition: {
                type: ControlType.Transition,
                defaultValue: {
                    type: "spring",
                    stiffness: 1500,
                    damping: 70,
                },
            },
        },
        hidden: (props) => props.type != "imageSelect",
    },
    imageSelectColumns: {
        type: ControlType.Number,
        defaultValue: 3,
        min: 1,
        step: 1,
        displayStepper: true,
        title: "Columns",
        hidden: (props) => props.type != "imageSelect",
    },
    imageSelectAlign: {
        type: ControlType.Enum,
        defaultValue: "start",
        options: ["start", "center", "end"],
        optionTitles: ["Left", "Center", "Right"],
        displaySegmentedControl: true,
        title: "Align",
        hidden: (props) =>
            props.type != "imageSelect" || props.imageSelectColumns == 1,
    },
    checkboxStyle: {
        type: ControlType.Object,
        title: "Checkbox",
        buttonTitle: "Style",
        controls: {
            fillOn: {
                type: ControlType.Color,
                defaultValue: "#0075FF",
            },
            fillOff: {
                type: ControlType.Color,
                defaultValue: "#EDEDED",
            },
            size: {
                type: ControlType.Number,
                defaultValue: 16,
                min: 1,
                step: 1,
            },
            radius: {
                type: ControlType.Number,
                defaultValue: 4,
                min: 0,
            },
            border: {
                type: ControlType.Object,
                optional: true,
                defaultValue: {
                    colorOn: "rgba(219, 219, 219, 0)",
                    colorOff: "#DBDBDB",
                    width: 1,
                    style: "solid",
                },
                controls: {
                    colorOn: {
                        type: ControlType.Color,
                        defaultValue: "rgba(219, 219, 219, 0)",
                    },
                    colorOff: {
                        type: ControlType.Color,
                        defaultValue: "#DBDBDB",
                    },
                    width: {
                        type: ControlType.FusedNumber,
                        defaultValue: 1,
                        toggleKey: "widthIsMixed",
                        toggleTitles: ["All", "Individual"],
                        valueKeys: [
                            "widthTop",
                            "widthRight",
                            "widthBottom",
                            "widthLeft",
                        ],
                        valueLabels: ["T", "R", "B", "L"],
                        min: 0,
                    },
                    style: {
                        type: ControlType.Enum,
                        defaultValue: "solid",
                        options: ["solid", "dashed", "dotted", "double"],
                        optionTitles: ["Solid", "Dashed", "Dotted", "Double"],
                    },
                },
            },
            shadowOn: {
                type: ControlType.BoxShadow,
            },
            shadowOff: {
                type: ControlType.BoxShadow,
            },
            icon: {
                type: ControlType.Object,
                optional: true,
                defaultValue: {
                    size: 12,
                    color: "#FFF",
                    rounded: true,
                },
                buttonTitle: "Style",
                title: "Check",
                controls: {
                    size: {
                        type: ControlType.Number,
                        defaultValue: 16,
                        min: 1,
                        step: 1,
                    },
                    lineWidth: {
                        type: ControlType.Number,
                        defaultValue: 1.5,
                        min: 0.1,
                        step: 0.1,
                    },
                    color: {
                        type: ControlType.Color,
                        defaultValue: "#FFF",
                    },
                    rounded: {
                        type: ControlType.Boolean,
                        defaultValue: true,
                    },
                },
            },
            transition: {
                type: ControlType.Transition,
                defaultValue: {
                    type: "spring",
                    stiffness: 1500,
                    damping: 70,
                },
            },
        },
        hidden: (props) => !CHECKBOX_TYPES.includes(props.type),
    },
    radioStyle: {
        type: ControlType.Object,
        title: "Radio",
        buttonTitle: "Style",
        controls: {
            fillOn: {
                type: ControlType.Color,
                defaultValue: "#EDEDED",
            },
            fillOff: {
                type: ControlType.Color,
                defaultValue: "#EDEDED",
            },
            size: {
                type: ControlType.Number,
                defaultValue: 16,
                min: 1,
                step: 1,
            },
            radius: {
                type: ControlType.Number,
                defaultValue: 8,
                min: 0,
            },
            dotColor: {
                type: ControlType.Color,
                defaultValue: "#0075FF",
                optional: true,
            },
            dotSize: {
                type: ControlType.Number,
                defaultValue: 8,
                min: 1,
                step: 1,
                hidden: (props) => !props.dotColor,
            },
            border: {
                type: ControlType.Object,
                optional: true,
                defaultValue: {
                    colorOn: "#0075FF",
                    colorOff: "#DBDBDB",
                    width: 1,
                    style: "solid",
                },
                controls: {
                    colorOn: {
                        type: ControlType.Color,
                        defaultValue: "#0075FF",
                    },
                    colorOff: {
                        type: ControlType.Color,
                        defaultValue: "#DBDBDB",
                    },
                    width: {
                        type: ControlType.FusedNumber,
                        defaultValue: 1,
                        toggleKey: "widthIsMixed",
                        toggleTitles: ["All", "Individual"],
                        valueKeys: [
                            "widthTop",
                            "widthRight",
                            "widthBottom",
                            "widthLeft",
                        ],
                        valueLabels: ["T", "R", "B", "L"],
                        min: 0,
                    },
                    style: {
                        type: ControlType.Enum,
                        defaultValue: "solid",
                        options: ["solid", "dashed", "dotted", "double"],
                        optionTitles: ["Solid", "Dashed", "Dotted", "Double"],
                    },
                },
            },
            shadowOn: {
                type: ControlType.BoxShadow,
            },
            shadowOff: {
                type: ControlType.BoxShadow,
            },
            transition: {
                type: ControlType.Transition,
                defaultValue: {
                    type: "spring",
                    stiffness: 1500,
                    damping: 70,
                },
            },
        },
        hidden: (props) => props.type !== "radio",
    },
    booleanValues: {
        type: ControlType.Object,
        title: "Values",
        icon: "boolean",
        controls: {
            on: {
                type: ControlType.String,
                defaultValue: "on",
                placeholder: "Value",
            },
            off: {
                type: ControlType.String,
                defaultValue: "off",
                placeholder: "Value",
            },
        },
        hidden: (props) => !BOOLEAN_VALUE_TYPES.includes(props.type),
    },
    npsMax: {
        type: ControlType.Number,
        defaultValue: 10,
        min: 1,
        step: 1,
        displayStepper: true,
        title: "Max",
        hidden: (props) => props.type != "nps",
    },
    npsLabels: {
        type: ControlType.Object,
        title: "Labels",
        optional: true,
        defaultValue: {
            left: "Not Likely",
            right: "Extremely Likely",
            location: "top",
        },
        controls: {
            left: {
                type: ControlType.String,
                defaultValue: "Not Likely",
            },
            right: {
                type: ControlType.String,
                defaultValue: "Extremely Likely",
            },
            location: {
                type: ControlType.Enum,
                defaultValue: "top",
                options: ["top", "bottom"],
                optionTitles: ["Top", "Bottom"],
                displaySegmentedControl: true,
            },
        },
        hidden: (props) => props.type != "nps",
    },
    npsButtons: {
        type: ControlType.Object,
        buttonTitle: "Options",
        title: "Buttons",
        controls: {
            fill: fillPropOnOff({
                colorOn: "#0075FF",
                colorAOn: "#70B3FF",
                colorBOn: "#0075FF",
                colorOff: "#F0F0F0",
                colorAOff: "#F2F2F2",
                colorBOff: "#CCC",
            }),
            font: {
                type: "font",
                controls: "extended",
                defaultFontType: "sans-serif",
                defaultValue: {
                    fontSize: 12,
                    lineHeight: 1,
                },
            },
            selectedFontColor: {
                type: ControlType.Color,
                defaultValue: "#FFFFFF",
                title: "Font Color On",
            },
            deselectedFontColor: {
                type: ControlType.Color,
                defaultValue: "#000000",
                title: "Font Color Off",
            },
            innerRadius: {
                type: ControlType.Number,
                defaultValue: 4,
                min: 0,
                step: 1,
            },
            outerRadius: {
                type: ControlType.Number,
                defaultValue: 8,
                min: 0,
                step: 1,
            },
            gap: {
                type: ControlType.Number,
                defaultValue: 4,
                min: 0,
                step: 1,
            },
            height: {
                type: ControlType.Number,
                defaultValue: 40,
                min: 0,
                step: 1,
            },
            minWidth: {
                type: ControlType.Number,
                defaultValue: 30,
                min: 0,
                step: 1,
            },
            border: {
                type: ControlType.Object,
                optional: true,
                controls: {
                    selectedColor: {
                        type: ControlType.Color,
                        defaultValue: "#004CA8",
                        title: "Color On",
                    },
                    deselectedColor: {
                        type: ControlType.Color,
                        defaultValue: "#222222",
                        title: "Color Off",
                    },
                    width: {
                        type: ControlType.FusedNumber,
                        defaultValue: 1,
                        toggleKey: "widthIsMixed",
                        toggleTitles: ["All", "Individual"],
                        valueKeys: [
                            "widthTop",
                            "widthRight",
                            "widthBottom",
                            "widthLeft",
                        ],
                        valueLabels: ["T", "R", "B", "L"],
                        min: 0,
                    },
                    style: {
                        type: ControlType.Enum,
                        defaultValue: "solid",
                        options: ["solid", "dashed", "dotted", "double"],
                        optionTitles: ["Solid", "Dashed", "Dotted", "Double"],
                    },
                },
            },
            transition: {
                type: ControlType.Transition,
                defaultValue: {
                    type: "spring",
                    stiffness: 1200,
                    damping: 70,
                },
            },
        },
        hidden: (props) => props.type != "nps",
    },
    sliderHandle: {
        type: ControlType.Object,
        buttonTitle: "Options",
        title: "Handle",
        controls: {
            color: {
                type: ControlType.Color,
                defaultValue: "#0075FF",
            },
            size: {
                type: ControlType.Number,
                defaultValue: 16,
                min: 1,
                step: 1,
            },
            radius: {
                type: ControlType.Number,
                defaultValue: 8,
                min: 0,
                step: 1,
            },
            border: {
                type: ControlType.Object,
                optional: true,
                controls: {
                    color: {
                        type: ControlType.Color,
                        defaultValue: "#0069E0",
                    },
                    width: {
                        type: ControlType.Number,
                        defaultValue: 1,
                        min: 0,
                        step: 1,
                    },
                },
            },
        },
        hidden: (props) => props.type != "slider",
    },
    sliderTrack: {
        type: ControlType.Object,
        buttonTitle: "Options",
        title: "Track",
        controls: {
            color: {
                type: ControlType.Color,
                defaultValue: "#D9D9D9",
            },
            height: {
                type: ControlType.Number,
                defaultValue: 4,
                min: 1,
                step: 1,
            },
            radius: {
                type: ControlType.Number,
                defaultValue: 2,
                min: 0,
                step: 1,
            },
            border: {
                type: ControlType.Object,
                optional: true,
                controls: {
                    color: {
                        type: ControlType.Color,
                        defaultValue: "#000",
                    },
                    width: {
                        type: ControlType.Number,
                        defaultValue: 1,
                        min: 0,
                        step: 1,
                    },
                },
            },
        },
        hidden: (props) => props.type != "slider",
    },
    min: {
        title: "Min",
        type: ControlType.Number,
        defaultValue: 0,
        hidden: (props) => !MIN_MAX_STEP_TYPES.includes(props.type),
    },
    max: {
        title: "Max",
        type: ControlType.Number,
        defaultValue: 100,
        hidden: (props) => !MIN_MAX_STEP_TYPES.includes(props.type),
    },
    step: {
        type: ControlType.Number,
        defaultValue: 1,
        hidden: (props) => !MIN_MAX_STEP_TYPES.includes(props.type),
    },
    textAreaHeight: {
        type: ControlType.Object,
        title: "Height",
        controls: {
            mode: {
                type: ControlType.Enum,
                defaultValue: "auto",
                options: ["auto", "resizable", "fixed"],
                optionTitles: ["Auto", "Resizable", "Fixed"],
                displaySegmentedControl: true,
                segmentedControlDirection: "vertical",
            },
            minLines: {
                type: ControlType.Number,
                defaultValue: 3,
                min: 1,
                step: 1,
                displayStepper: true,
                hidden: (props) => props.mode === "fixed",
            },
            maxLines: {
                type: ControlType.Number,
                defaultValue: 8,
                min: 1,
                step: 1,
                displayStepper: true,
                description:
                    "Auto height is [not supported on all browsers](https://caniuse.com/mdn-css_properties_field-sizing_content)",
                hidden: (props) => props.mode === "fixed",
            },
            lines: {
                type: ControlType.Number,
                defaultValue: 5,
                min: 1,
                step: 1,
                displayStepper: true,
                hidden: (props) => props.mode !== "fixed",
            },
        },
        hidden: (props) => props.type != "textArea",
    },
    textAreaScrollbar: {
        type: ControlType.Boolean,
        defaultValue: true,
        enabledTitle: "Auto",
        disabledTitle: "Hidden",
        title: "Scrollbar",
        hidden: (props) => props.type != "textArea",
    },
    sliderDefaultValue: {
        type: ControlType.Number,
        defaultValue: 50,
        title: "Default Value",
        hidden: (props) => props.type != "slider",
    },
    sliderLabel: {
        type: ControlType.Object,
        defaultValue: {
            defaultValue: "left",
            minWidth: 24,
        },
        optional: true,
        controls: {
            position: {
                type: ControlType.Enum,
                defaultValue: "left",
                options: ["left", "right"],
                optionTitles: ["Left", "Right"],
                displaySegmentedControl: true,
            },
            minWidth: {
                type: ControlType.Number,
                defaultValue: 24,
                min: 0,
                step: 1,
            },
            prefix: {
                type: ControlType.String,
            },
            suffix: {
                type: ControlType.String,
            },
        },
        hidden: (props) => props.type != "slider",
    },
    pinnedCountries: {
        type: ControlType.Array,
        defaultValue: [],
        control: {
            type: ControlType.Enum,
            options: countries,
        },
        hidden: (props) => props.type != "country",
    },
    countryDefaultValue: {
        type: ControlType.Enum,
        defaultValue: "none",
        options: ["none", ...countries],
        optionTitles: ["None", ...countries],
        title: "Default Value",
        hidden: (props) => props.type != "country",
    },
    countryNoneSelectedText: {
        type: ControlType.String,
        defaultValue: "Select a country",
        title: "None Selected Text",
        hidden: (props) =>
            props.type != "country" || props.countryDefaultValue !== "none",
    },
    countryEmojis: {
        type: ControlType.Boolean,
        defaultValue: true,
        title: "Flag Emojis",
        hidden: (props) => props.type != "country",
    },
    dropdownDefaultValue: {
        type: ControlType.String,
        title: "Default Value",
        placeholder: "Default Value",
        hidden: (props) => props.type !== "dropdown",
    },
    dropdownNoneSelectedText: {
        type: ControlType.String,
        defaultValue: "Select an option",
        title: "None Selected Text",
        hidden: (props) =>
            props.options.includes(props.dropdownDefaultValue) ||
            props.type != "dropdown",
    },
    dropdownArrow: {
        type: ControlType.Object,
        defaultValue: {
            size: 12,
            gap: 10,
        },
        optional: true,
        buttonTitle: "Style",
        title: "Arrow",
        controls: {
            color: {
                type: ControlType.Color,
                optional: true,
            },
            size: {
                type: ControlType.Number,
                defaultValue: 12,
                min: 1,
                step: 1,
            },
            gap: {
                type: ControlType.Number,
                defaultValue: 10,
                min: 0,
                step: 1,
            },
            stroke: {
                type: ControlType.Number,
                defaultValue: 2,
                min: 0.1,
                step: 0.1,
                displayStepper: true,
            },
        },
        hidden: (props) =>
            props.type !== "dropdown" && props.type !== "country",
    },
    fill: fillProp({
        color: "#FFF",
        colorA: "#FFF",
        colorB: "#BDBDBD",
    }),
    fontColor: {
        type: ControlType.Color,
        defaultValue: "#000",
        hidden: fontIsHidden,
    },
    placeholderFontColor: {
        type: ControlType.Color,
        defaultValue: "rgba(0,0,0,0.5)",
        hidden: (props) => !PLACEHOLDER_FONT_COLOR_TYPES.includes(props.type),
    },
    font: {
        type: "font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: 14,
            lineHeight: 1.5,
        },
        hidden: fontIsHidden,
    },
    gap: {
        type: ControlType.Number,
        defaultValue: 10,
        min: 0,
        step: 1,
        hidden: (props) =>
            !GAP_TYPES.includes(props.type) ||
            (props.type == "nps" && !props.npsLabels),
    },
    gapH: {
        type: ControlType.Number,
        defaultValue: 10,
        min: 0,
        step: 1,
        hidden: (props) => !GAP_HV_TYPES.includes(props.type),
    },
    gapV: {
        type: ControlType.Number,
        defaultValue: 10,
        min: 0,
        step: 1,
        hidden: (props) => !GAP_HV_TYPES.includes(props.type),
    },
    padding: {
        type: ControlType.FusedNumber,
        defaultValue: 16,
        toggleKey: "paddingIsMixed",
        toggleTitles: ["All", "Individual"],
        valueKeys: [
            "paddingTop",
            "paddingRight",
            "paddingBottom",
            "paddingLeft",
        ],
        valueLabels: ["T", "R", "B", "L"],
        min: 0,
    },
    radius: {
        type: ControlType.FusedNumber,
        defaultValue: 8,
        toggleKey: "radiusIsMixed",
        toggleTitles: ["All", "Individual"],
        valueKeys: [
            "radiusTopLeft",
            "radiusTopRight",
            "radiusBottomRight",
            "radiusBottomLeft",
        ],
        valueLabels: ["TL", "TR", "BR", "BL"],
        min: 0,
    },
    border: {
        type: ControlType.Object,
        optional: true,
        controls: {
            color: {
                type: ControlType.Color,
                defaultValue: "#222",
            },
            width: {
                type: ControlType.FusedNumber,
                defaultValue: 1,
                toggleKey: "widthIsMixed",
                toggleTitles: ["All", "Individual"],
                valueKeys: [
                    "widthTop",
                    "widthRight",
                    "widthBottom",
                    "widthLeft",
                ],
                valueLabels: ["T", "R", "B", "L"],
                min: 0,
            },
            style: {
                type: ControlType.Enum,
                defaultValue: "solid",
                options: ["solid", "dashed", "dotted", "double"],
                optionTitles: ["Solid", "Dashed", "Dotted", "Double"],
            },
        },
    },
    shadows: {
        type: ControlType.BoxShadow,
    },
    icon: iconPropertyControls,
    invalidStyle: {
        type: ControlType.Object,
        buttonTitle: "Options",
        controls: {
            fill: fillProp({
                color: "#FFF5F5",
            }),
            border: {
                type: ControlType.Object,
                optional: true,
                defaultValue: {
                    color: "#FF0000",
                    width: 2,
                    style: "solid",
                },
                controls: {
                    color: {
                        type: ControlType.Color,
                        defaultValue: "#FF0000",
                    },
                    width: {
                        type: ControlType.FusedNumber,
                        defaultValue: 2,
                        toggleKey: "widthIsMixed",
                        toggleTitles: ["All", "Individual"],
                        valueKeys: [
                            "widthTop",
                            "widthRight",
                            "widthBottom",
                            "widthLeft",
                        ],
                        valueLabels: ["T", "R", "B", "L"],
                        min: 0,
                    },
                    style: {
                        type: ControlType.Enum,
                        defaultValue: "solid",
                        options: ["solid", "dashed", "dotted", "double"],
                        optionTitles: ["Solid", "Dashed", "Dotted", "Double"],
                    },
                },
            },
            errorMessage: {
                type: ControlType.Object,
                optional: true,
                controls: {
                    invalidMessage: {
                        type: ControlType.String,
                        defaultValue: "Invalid value.",
                        displayTextArea: true,
                    },
                    requiredMessage: {
                        type: ControlType.String,
                        defaultValue: "This field is required.",
                        displayTextArea: true,
                    },
                    fontColor: {
                        type: ControlType.Color,
                        defaultValue: "#FF0000",
                    },
                    font: {
                        type: "font",
                        controls: "extended",
                        defaultFontType: "sans-serif",
                        defaultValue: {
                            fontSize: 14,
                            lineHeight: 1,
                        },
                    },
                    gap: {
                        type: ControlType.Number,
                        defaultValue: 8,
                        min: 0,
                        step: 1,
                    },
                },
            },
            transition: {
                type: ControlType.Transition,
                defaultValue: {
                    type: "spring",
                    stiffness: 1200,
                    damping: 70,
                },
            },
        },
    },
})

// Components

function Dropdown({
    style,
    baseStyle,
    onChange,
    value,
    onFocus,
    children,
    fontColor,
    paddingRight,
    arrow,
}) {
    return (
        <div style={{ position: "relative", ...baseStyle }}>
            <select
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                style={{
                    appearance: "none",
                    height: "100%",
                    cursor: "pointer",
                    margin: 0,
                    backgroundImage: "none",
                    ...style,
                    paddingRight:
                        style.paddingRight +
                        (arrow ? arrow.size + arrow.gap : 0),
                    color: fontColor,
                }}
            >
                {children}
            </select>
            {arrow ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={arrow.size}
                    height={arrow.size}
                    viewBox="0 0 18 18"
                    fill="none"
                    stroke-width={arrow.stroke}
                    stroke={arrow.color ?? style.color}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    style={{
                        display: "block",
                        position: "absolute",
                        right: paddingRight,
                        top: `calc(50% - ${arrow.size / 2}px)`,
                        pointerEvents: "none",
                    }}
                >
                    <path d="M2 5.5L9 12.5L16 5.5" />
                </svg>
            ) : null}
        </div>
    )
}

function Checkbox(props) {
    const { on, border } = props

    return (
        <motion.div
            animate={{
                backgroundColor: on ? props.fillOn : props.fillOff,
                boxShadow: on ? props.shadowOn : props.shadowOff,
            }}
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: props.size,
                height: props.size,
                minWidth: props.size,
                borderRadius: props.radius,
                position: "relative",
            }}
            initial={false}
            transition={props.transition}
        >
            {props.icon && (
                <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={props.icon.size}
                    height={props.icon.size}
                    viewBox="0 0 24 24"
                    strokeWidth={props.icon.lineWidth * (24 / props.icon.size)}
                    stroke={props.icon.color}
                    fill="none"
                    strokeLinecap={props.icon.rounded ? "round" : "butt"}
                    strokeLinejoin={props.icon.rounded ? "round" : "miter"}
                    animate={{
                        opacity: on ? 1 : 0,
                    }}
                    style={{
                        display: "block",
                    }}
                    initial={false}
                    transition={props.transition}
                >
                    <path d="M5 12l5 5l10 -10" />
                </motion.svg>
            )}
            {border && (
                <motion.div
                    animate={{
                        borderColor: on ? border.colorOn : border.colorOff,
                    }}
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderWidth: border.widthIsMixed
                            ? `${border.widthTop}px ${border.widthRight}px ${border.widthBottom}px ${border.widthLeft}px`
                            : `${border.width}px`,
                        borderStyle: border.style,
                        borderRadius: props.radius,
                        pointerEvents: "none",
                    }}
                    initial={false}
                    transition={props.transition}
                />
            )}
        </motion.div>
    )
}

// Utility functions

function isEmailAddress(string) {
    return /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,64}$/.test(string)
}

function formatPhoneNumber(phoneNumber, format) {
    if (!phoneNumber) {
        return ""
    }

    let index = 0 // Tracks the position in the replacements string
    let cutOffIndex = null // To determine where to slice the template after replacement

    const result = format.replace(/[Xx]/g, (match, offset) => {
        if (index < phoneNumber.length) {
            return phoneNumber[index++]
        } else {
            if (phoneNumber.length < 10 && cutOffIndex === null) {
                // Set cut-off index at the first unmatched Xx after all replacements are used
                cutOffIndex = offset
            }
            return ""
        }
    })

    // Slice the template to remove the part after the last valid replacement if necessary
    return cutOffIndex !== null ? result.slice(0, cutOffIndex) : result
}

function unformatPhoneNumber(phoneNumberString) {
    return phoneNumberString.replace(/\D/g, "")
}

function formatCountryCode(countryCode, format) {
    return format.replace(/[Xx]/, countryCode)
}

function unformatCountryCode(countryCodeString) {
    return countryCodeString.replace(/\D/g, "")
}

// Returns [isValid, domain, fullURL]
const INVALID_URL_RETURN = [false, null, null]
function parseURL(value, urlAcceptedDomains) {
    // Empty strings can still be "valid" if the field is not required
    if (value.length == 0) {
        return [true, "", ""]
    }

    // Every URL has a period so check for it in the string.
    if (!value.includes(".")) {
        return INVALID_URL_RETURN
    }

    try {
        let fullURL = value

        // Add https:// if not already included
        if (!fullURL.match(/^https?:\/\//)) {
            fullURL = "https://" + fullURL
        }

        const url = new URL(fullURL)

        if (!/^[^\.]+\.[a-z]+$/i.test(url.hostname)) {
            return INVALID_URL_RETURN
        }

        if (urlAcceptedDomains) {
            if (urlAcceptedDomains.mode == "blacklist") {
                if (urlAcceptedDomains.domains.includes(url.hostname)) {
                    return INVALID_URL_RETURN
                }
            } else {
                if (!urlAcceptedDomains.domains.includes(url.hostname)) {
                    return INVALID_URL_RETURN
                }
            }
        }

        return [true, url.hostname, fullURL]
    } catch (error) {
        return INVALID_URL_RETURN
    }
}

function isNumber(str) {
    return !isNaN(str) && isFinite(str)
}

function replaceXWithNumbers(input) {
    let count = 1
    return input.replace(/[Xx]/g, () => {
        let number = count % 10
        if (number === 0) number = 0
        count++
        return number
    })
}

function isLastCharacterANumber(str) {
    if (str.length === 0) return false // Check if the string is empty

    const lastChar = str[str.length - 1] // Get the last character
    return !isNaN(lastChar) && !isNaN(parseFloat(lastChar)) // Check if it's a numeric value
}

function fontIsHidden(props) {
    switch (props.type) {
        case "slider":
            return !props.sliderLabel
        case "nps":
            return !props.npsLabels
        case "imageSelect":
            return true
    }
    return false
}
