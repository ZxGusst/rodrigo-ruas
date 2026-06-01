import { addPropertyControls, ControlType, Link } from "framer"
import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import {
    FormIcon,
    iconPropertyControls,
    useFormStore,
    SUPABASE_KEY,
    fillProp,
    createBackground,
} from "https://framer.com/m/SharedFormCode-HQOZ.js@pl3ng44Hc2Iq0qNooDOc"

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 500
 */
export default function SubmitButton(props) {
    const {
        formId,
        clickAction,
        submitPlatform,
        submitUrl,
        responseInfo,
        redirectOnSuccess,
        scrollOptions,
        icon,
        border,
        success,
        failure,
        apiConfig,
    } = props
    const borderRadius = props.radiusIsMixed
        ? `${props.radiusTopLeft}px ${props.radiusTopRight}px ${props.radiusBottomRight}px ${props.radiusBottomLeft}px`
        : `${props.radius}px`

    const [formState, setFormState] = useFormStore()
    const [submitted, setSubmitted] = useState(false)
    const redirectLinkRef = useRef(null)

    // Reset/clear form
    function resetFormState() {
        setFormState((prev) => {
            const newForm = {}
            for (const fieldName in prev[formId]) {
                newForm[fieldName] = {
                    ...prev[formId][fieldName],
                    value: prev[formId][fieldName].defaultValue,
                }
            }
            return { [formId]: newForm }
        })
    }

    useEffect(() => {
        setFormState({})

        return () => {
            setFormState((prev) => {
                const { [formId]: _, ...newState } = prev
                return newState
            })
        }
    }, [])

    async function onSubmitClick() {
        const invalidFields = []

        if (submitted) {
            return
        }

        // Find invalid fields
        const form = formState[formId]
        for (const fieldName in form) {
            const field = form[fieldName]

            if (field.visible && !(await field.isValid(field.value))) {
                invalidFields.push(fieldName)
            }
        }

        if (invalidFields.length == 0) {
            if (clickAction == "submitForm") {
                // Process final field values
                const formData = {}
                for (const fieldName in form) {
                    const field = form[fieldName]
                    const name = processFieldName(fieldName, submitPlatform)

                    if (field.processValue) {
                        formData[name] = await field.processValue(field.value)
                    } else {
                        formData[name] = field.value
                    }
                }

                let url = ""
                let fetchMode = "no-cors"
                let formEncoded = true
                let headers = {}
                let fetchOptions = {}

                switch (submitPlatform) {
                    case "url":
                        url = submitUrl.replace(
                            "submit-form.com",
                            "api.formspark.io"
                        )

                        formEncoded =
                            props.submitDataType ==
                            "application/x-www-form-urlencoded"

                        // Fix CORS issues with Formspark and Make.com
                        if (
                            url.includes("submit-form.com") ||
                            url.includes("api.formspark.io") ||
                            url.includes(".make.com")
                        ) {
                            fetchMode = "cors"
                        }

                        if (apiConfig?.apiKey?.length) {
                            headers.Authorization = `Bearer ${apiConfig.apiKey}`
                        }
                        break
                    case "zapier":
                        url = props.zapierWebhookUrl
                        formEncoded = false
                        break
                    case "make":
                        url = props.makeWebhookUrl
                        fetchMode = "cors"
                        formEncoded = false
                        break
                    case "formspark":
                        url = `https://api.formspark.io/${props.formsparkFormId}`
                        fetchMode = "cors"
                        break
                    case "formspree":
                        url = props.formspreeEndpoint
                        break
                    case "loops":
                        url = props.loopsUrl
                        fetchMode = "cors"
                        if (props.loopsUserGroup?.length) {
                            formData.userGroup = props.loopsUserGroup
                        }

                        // Email address
                        for (const fieldName in form) {
                            const field = form[fieldName]
                            if (field.type == "email") {
                                delete formData[field.name]
                                formData.email = field.value
                                break
                            }
                        }
                        break
                    case "mailchimp":
                        const [domain, parameters] = parseMailchimpUrl(
                            props.mailchimpUrl
                        )

                        url = `https://${domain}/subscribe/post`

                        if (parameters) {
                            for (const key in parameters) {
                                formData[key] = parameters[key]
                            }
                        }

                        // Find email, phone, and birthday fields
                        let emailFound = false
                        let phoneFound = false
                        let birthdayFound = false
                        for (const fieldName in form) {
                            const field = form[fieldName]

                            if (!emailFound && field.type == "email") {
                                delete formData[field.name]
                                formData.EMAIL = field.value
                                emailFound = true
                            }

                            if (!phoneFound && field.type == "phone") {
                                delete formData[field.name]
                                formData.PHONE = field.value
                                phoneFound = true
                            }

                            if (
                                !birthdayFound &&
                                field.type == "date" &&
                                field.name == "birthday"
                            ) {
                                formData["BIRTHDAY[month]"] =
                                    field.value.getMonth() + 1
                                formData["BIRTHDAY[day]"] =
                                    field.value.getDate()
                                delete formData[field.name]
                                birthdayFound = true
                            }
                        }

                        break
                    case "mailerLite":
                        url = props.mailerLiteUrl

                        // Email address
                        for (const fieldName in form) {
                            const field = form[fieldName]
                            if (field.type == "email") {
                                delete formData[field.name]
                                formData["fields[email]"] = field.value
                                break
                            }
                        }
                        break
                    case "hubSpot":
                        url = `https://api.hsforms.com/submissions/v3/integration/submit/${props.hubSpotPortalId}/${props.hubSpotFormId}`
                        fetchMode = "cors"
                        break
                    case "basin":
                        url = props.basinUrl
                        break
                    case "getform":
                        url = props.getformUrl
                        break
                    case "formcarry":
                        url = props.formcarryUrl
                        fetchOptions = { enctype: "multipart/form-data" }
                        break
                    case "formBackend":
                        url = props.formBackendUrl
                        break
                    case "web3forms":
                        url = "https://api.web3forms.com/submit"
                        formData.access_key = props.web3formsAccessKey
                        break
                    case "formBold":
                        url = props.formBoldUrl
                        break
                    case "n8n":
                        url = props.n8nWebhookUrl
                        formEncoded = false
                        break
                }

                // Add URL to form response
                if (responseInfo.url) {
                    formData[responseInfo.urlName] = window.location.href
                }

                // Add UTM parameters
                if (responseInfo.utmParams) {
                    const queryParams = new URLSearchParams(
                        window.location.search
                    )

                    queryParams.forEach((value, key) => {
                        // Check if the key starts with 'utm_' (indicating it's a UTM parameter)
                        if (key.startsWith("utm_")) {
                            formData[key] = value
                        }
                    })
                }

                let body = ""
                if (formEncoded) {
                    body = new URLSearchParams(formData).toString()
                } else {
                    body = JSON.stringify(formData)
                }

                setSubmitted(true)

                // 🎯 FUNÇÃO DE REDIRECIONAMENTO (reutilizável)
                const redirectUser = () => {
                    if (redirectOnSuccess?.length && redirectLinkRef.current) {
                        const queryParams = new URLSearchParams()

                        const urlParams = new URLSearchParams(
                            window.location.search
                        )
                        urlParams.forEach((value, key) => {
                            if (key.startsWith("utm_")) {
                                queryParams.append(key, value)
                            }
                        })

                        for (const [key, value] of Object.entries(formData)) {
                            if (
                                ![
                                    "tipo_ingresso",
                                    "url",
                                    "tipo_assinatura",
                                ].includes(key)
                            ) {
                                queryParams.append(key, value)
                            }
                        }

                        const redirectUrl = `${redirectOnSuccess}?${queryParams.toString()}`
                        redirectLinkRef.current.href = redirectUrl
                        redirectLinkRef.current.click()
                    }
                }

                // ⏰ TIMEOUT DE SEGURANÇA (1 segundo - otimizado para n8n)
                const timeoutId = setTimeout(() => {
                    console.log("⏰ Timeout atingido - redirecionando...")
                    redirectUser()
                    resetFormState()
                    success?.()
                    setSubmitted(false)
                }, 1000) // ✅ 1 segundo - perfeito para n8n

                // 🚀 ENVIAR WEBHOOK
                try {
                    console.time("webhook-response") // 📊 Para você testar o tempo real

                    const response = await fetch(url, {
                        method: "POST",
                        mode: fetchMode,
                        body,
                        headers: {
                            "Content-Type": formEncoded
                                ? "application/x-www-form-urlencoded"
                                : "application/json",
                            Accept: "application/json",
                            ...headers,
                        },
                    })

                    console.timeEnd("webhook-response") // 📊 Mostra tempo real no console

                    // ✅ RESPOSTA RECEBIDA - cancelar timeout e redirecionar
                    clearTimeout(timeoutId)
                    console.log("✅ Resposta recebida - redirecionando...")

                    // 🚀 ENVIAR LOG SUPABASE EM BACKGROUND
                    if (response.ok || response.type === "opaque") {
                        fetch(
                            "https://mhrwdvsitrzczrneuaxg.supabase.co/rest/v1/framerforms_websites",
                            {
                                method: "POST",
                                headers: {
                                    apikey: SUPABASE_KEY,
                                    Authorization: `Bearer ${SUPABASE_KEY}`,
                                    "Content-Type": "application/json",
                                    Prefer: "return=minimal",
                                },
                                body: JSON.stringify({
                                    url: window.location.href,
                                }),
                            }
                        ).catch((error) => {
                            console.error("Supabase error:", error)
                        })
                    }

                    // ✅ REDIRECIONAR IMEDIATAMENTE
                    redirectUser()
                    resetFormState()
                    success?.()
                    setSubmitted(false)
                } catch (error) {
                    // ❌ ERRO - cancelar timeout e redirecionar mesmo assim
                    clearTimeout(timeoutId)
                    console.error(
                        "❌ Erro no webhook - redirecionando mesmo assim:",
                        error
                    )

                    redirectUser()
                    resetFormState()
                    failure?.() // ✅ Chama failure em caso de erro
                    setSubmitted(false)
                }
            } else {
                // Validate form without submitting to URL
                setSubmitted(false)
                success?.()
            }
        } else {
            console.log(
                "Not all form fields are valid:",
                invalidFields.join(", ")
            )

            if (scrollOptions) {
                // Scroll to first invalid field
                let closestRef = null
                let closestDistance = Number.POSITIVE_INFINITY

                for (const fieldName in form) {
                    const ref = form[fieldName].ref

                    if (invalidFields.includes(fieldName) && ref.current) {
                        const rect = ref.current.getBoundingClientRect()
                        const distance = rect.top + window.pageYOffset
                        if (distance >= 0 && distance < closestDistance) {
                            closestRef = ref
                            closestDistance = distance
                        }
                    }
                }

                if (closestRef) {
                    window.scrollTo({
                        behavior: "smooth",
                        top:
                            closestRef.current.getBoundingClientRect().top -
                            document.body.getBoundingClientRect().top +
                            scrollOptions.offset,
                    })
                }
            }

            setSubmitted(false)
            failure?.()
        }
    }

    return (
        <motion.button
            type="submit"
            onClick={onSubmitClick}
            whileHover={{
                ...createBackground(props.hoverCustomization?.fill),
                color: props.hoverCustomization?.fontColor,
                "--border-color": props.hoverCustomization?.borderColor,
            }}
            whileTap={{
                ...createBackground(props.pressCustomization?.fill),
                color: props.pressCustomization?.fontColor,
                "--border-color": props.pressCustomization?.borderColor,
            }}
            animate={{
                borderRadius: borderRadius,
                padding: props.paddingIsMixed
                    ? `${props.paddingTop}px ${props.paddingRight}px ${props.paddingBottom}px ${props.paddingLeft}px`
                    : `${props.padding}px`,
                ...createBackground(props.fill),
                boxShadow: props.shadows,
                color: props.fontColor,
                "--border-color": border?.color,
            }}
            style={{
                position: "relative",
                display: "flex",
                flexDirection:
                    icon?.position == "right" ? "row-reverse" : "row",
                gap: icon?.gap,
                alignItems: "center",
                justifyContent: props.font?.textAlign || "center",
                border: "none",
                outline: "none",
                cursor: "pointer",
                userSelect: "none",
                ...props.font,
                ...props.style,
            }}
            initial={false}
            transition={props.transition}
        >
            <FormIcon icon={icon} style={{}} />
            {props.text}
            {border && (
                <motion.div
                    animate={{
                        borderRadius: borderRadius,
                    }}
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderWidth: border.widthIsMixed
                            ? `${border.widthTop}px ${border.widthRight}px ${border.widthBottom}px ${border.widthLeft}px`
                            : `${border.width}px`,
                        borderStyle: border.style,
                        borderColor: "var(--border-color)",
                        pointerEvents: "none",
                    }}
                    initial={false}
                    transition={props.transition}
                />
            )}
            {redirectOnSuccess && (
                <Link
                    ref={redirectLinkRef}
                    href={redirectOnSuccess}
                    openInNewTab={props.newTab}
                    smoothScroll={false}
                >
                    <a />
                </Link>
            )}
        </motion.button>
    )
}

SubmitButton.displayName = "Submit Button"

addPropertyControls(SubmitButton, {
    formId: {
        type: ControlType.Number,
        defaultValue: 0,
        step: 1,
        min: 0,
        displayStepper: true,
        title: "Form ID",
    },
    clickAction: {
        type: ControlType.Enum,
        defaultValue: "submitForm",
        options: ["submitForm", "validateForm"],
        optionTitles: ["Submit Form", "Validate Form"],
    },
    ///////////////////////////////////////////////////////////////////////
    submitPlatform: {
        type: ControlType.Enum,
        defaultValue: "url",
        options: [
            "url",
            "basin",
            "formBackend",
            "formBold",
            "formcarry",
            "formspark",
            "formspree",
            "getform",
            "loops",
            "mailchimp",
            "mailerLite",
            "make",
            "n8n",
            "web3forms",
            "zapier",
        ],
        optionTitles: [
            "Webhook",
            "Basin",
            "FormBackend",
            "FormBold",
            "Formcarry",
            "Formspark",
            "Formspree",
            "Getform",
            "Loops",
            "Mailchimp",
            "MailerLite",
            "Make.com",
            "n8n",
            "Web3Forms",
            "Zapier",
        ],
        title: "Submit To",
        hidden: notSubmitForm,
    },
    submitUrl: {
        title: "URL",
        type: ControlType.String,
        defaultValue: "",
        hidden: isPlatformHidden("url"),
    },
    submitDataType: {
        type: ControlType.Enum,
        defaultValue: "application/json",
        options: ["application/json", "application/x-www-form-urlencoded"],
        title: "Data Type",
        hidden: isPlatformHidden("url"),
    },
    zapierWebhookUrl: {
        title: "Webhook URL",
        type: ControlType.String,
        defaultValue: "",
        placeholder: "https://hooks.zapier.com/hooks/catch/...",
        description:
            "Webhook URL from the [Webhooks by Zapier](https://zapier.com/apps/webhook/integrations) action\n\n[Setup Tutorial →](https://insertframe.io/docs/how-to-connect-zapier-with-framerforms)",
        hidden: isPlatformHidden("zapier"),
    },
    makeWebhookUrl: {
        title: "Webhook URL",
        type: ControlType.String,
        defaultValue: "",
        placeholder: "https://hook.us1.make.com/...",
        description:
            "Webhook URL from custom webhook in [Make.com](https://make.com/en?pc=framestack)\n\n[Setup Tutorial →](https://insertframe.io/docs/how-to-connect-make-com-with-framerforms)",
        hidden: isPlatformHidden("make"),
    },
    formsparkFormId: {
        title: "Formspark Form ID",
        type: ControlType.String,
        defaultValue: "",
        description:
            "Form ID from [Formspark](https://formspark.io/)\n\n[Setup Tutorial →](https://insertframe.io/docs/how-to-integrate-formspark-with-framerforms)",
        hidden: isPlatformHidden("formspark"),
    },
    formspreeEndpoint: {
        title: "Formspree Endpoint",
        type: ControlType.String,
        defaultValue: "",
        placeholder: "https://formspree.io/f/...",
        description:
            "Form endpoint URL from [Formspree](https://formspree.io/)\n\n[Setup Tutorial →](https://insertframe.io/docs/how-to-connect-formspree-with-framerforms)",
        hidden: isPlatformHidden("formspree"),
    },
    loopsUrl: {
        title: "Loops URL",
        type: ControlType.String,
        defaultValue: "",
        placeholder: "https://app.loops.so/api/newsletter-form/...",
        description:
            "Form endpoint URL from [Loops](https://loops.so/)\n\n[Setup Tutorial →](https://insertframe.io/docs/how-to-connect-loops-with-framerforms)",
        hidden: isPlatformHidden("loops"),
    },
    loopsUserGroup: {
        title: "User Group",
        type: ControlType.String,
        defaultValue: "",
        placeholder: "Loops User Group",
        hidden: isPlatformHidden("loops"),
    },
    mailchimpUrl: {
        title: "Mailchimp URL",
        type: ControlType.String,
        defaultValue: "",
        placeholder: "https://***.us*.list-manage.com/subscribe/post?u=...",
        description:
            "Form URL from [Mailchimp](https://mailchimp.com/)\n\n[Setup Tutorial →](https://insertframe.io/docs/how-to-connect-mailchimp-with-framerforms)",
        hidden: isPlatformHidden("mailchimp"),
    },
    mailerLiteUrl: {
        title: "MailerLite URL",
        type: ControlType.String,
        defaultValue: "",
        placeholder:
            "https://assets.mailerlite.com/jsonp/.../forms/.../subscribe",
        description:
            "Form URL from [MailerLite](https://www.mailerlite.com/a/rtThSkNv1R7m)\n\n[Setup Tutorial →](https://insertframe.io/docs/how-to-connect-mailerlite-with-framerforms)",
        hidden: isPlatformHidden("mailerLite"),
    },
    formBackendUrl: {
        title: "FormBackend URL",
        type: ControlType.String,
        defaultValue: "",
        placeholder: "https://www.formbackend.com/f/...",
        description:
            "Form endpoint from [FormBackend](https://formbackend.com/)",
        hidden: isPlatformHidden("formBackend"),
    },
    formcarryUrl: {
        title: "Formcarry URL",
        type: ControlType.String,
        defaultValue: "",
        placeholder: "https://formcarry.com/s/...",
        description:
            "Form endpoint from [Formcarry](https://formcarry.com/?via=framestack)",
        hidden: isPlatformHidden("formcarry"),
    },
    basinUrl: {
        title: "Basin URL",
        type: ControlType.String,
        defaultValue: "",
        placeholder: "https://usebasin.com/f/...",
        description:
            "Form endpoint from [Basin](https://usebasin.com?via=framestack)",
        hidden: isPlatformHidden("basin"),
    },
    getformUrl: {
        title: "Getform URL",
        type: ControlType.String,
        defaultValue: "",
        placeholder: "https://getform.io/f/...",
        description: "Form endpoint from [Getform](https://getform.io/)",
        hidden: isPlatformHidden("getform"),
    },
    web3formsAccessKey: {
        title: "Web3Forms Access Key",
        type: ControlType.String,
        defaultValue: "",
        placeholder: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
        description: "Access key from [Web3Forms](https://web3forms.com/)",
        hidden: isPlatformHidden("web3forms"),
    },
    formBoldUrl: {
        title: "FormBold URL",
        type: ControlType.String,
        defaultValue: "",
        placeholder: "https://formbold.com/s/...",
        description: "Form URL from [FormBold](https://formbold.com/)",
        hidden: isPlatformHidden("formBold"),
    },
    n8nWebhookUrl: {
        title: "n8n Webhook URL",
        type: ControlType.String,
        defaultValue: "",
        placeholder: "https://...app.n8n.cloud/...",
        description: "Webhook URL from [n8n](https://n8n.io/)",
        hidden: isPlatformHidden("n8n"),
    },
    apiConfig: {
        type: ControlType.Object,
        optional: true,
        title: "API Config",
        buttonTitle: "API Key",
        controls: {
            apiKey: {
                type: ControlType.String,
                title: "API Key",
            },
        },
        hidden: (props) =>
            notSubmitForm(props) || props.submitPlatform != "url",
    },
    ///////////////////////////////////////////////////////////////////////
    responseInfo: {
        type: ControlType.Object,
        buttonTitle: "Options",
        controls: {
            utmParams: {
                type: ControlType.Boolean,
                defaultValue: false,
                description:
                    "Include UTM parameters in the form response.\n[Learn More →](https://insertframe.io/docs/how-to-add-utm-parameters)",
                title: "UTM Params",
            },
            url: {
                type: ControlType.Boolean,
                defaultValue: false,
                description: "Include the page URL in the form response.",
                title: "URL",
            },
            urlName: {
                type: ControlType.String,
                defaultValue: "url",
                description: "Form response field name.",
                title: "URL Name",
                hidden: (props) => !props.url,
            },
        },
        hidden: (props) =>
            notSubmitForm(props) || props.submitPlatform == "hubSpot",
    },
    redirectOnSuccess: {
        type: ControlType.Link,
        hidden: notSubmitForm,
    },
    newTab: {
        type: ControlType.Boolean,
        defaultValue: false,
        hidden: notSubmitForm,
    },
    scrollToInvalidField: {
        type: ControlType.Object,
        defaultValue: { offset: -24 },
        optional: true,
        description: " ",
        controls: {
            offset: {
                type: ControlType.Number,
                defaultValue: -24,
                step: 1,
            },
        },
        hidden: notSubmitForm,
    },
    fill: fillProp({
        color: "#0075FF",
        colorA: "#70B3FF",
        colorB: "#0075FF",
    }),
    fontColor: {
        type: ControlType.Color,
        defaultValue: "#FFF",
    },
    font: {
        type: "font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontWeight: 700,
            fontSize: 16,
            lineHeight: 1,
        },
    },
    text: {
        type: ControlType.String,
        defaultValue: "Submit",
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
                min: 1,
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
    hoverCustomization: {
        type: ControlType.Object,
        optional: true,
        buttonTitle: "Colors",
        title: "Hover",
        icon: "effect",
        controls: {
            fill: fillProp({ noDefault: true }),
            fontColor: {
                type: ControlType.Color,
                optional: true,
            },
            borderColor: {
                type: ControlType.Color,
                optional: true,
            },
        },
    },
    pressCustomization: {
        type: ControlType.Object,
        optional: true,
        buttonTitle: "Colors",
        title: "Press",
        icon: "effect",
        controls: {
            fill: fillProp({ noDefault: true }),
            fontColor: {
                type: ControlType.Color,
                optional: true,
            },
            borderColor: {
                type: ControlType.Color,
                optional: true,
            },
        },
    },
    transition: {
        type: ControlType.Transition,
    },
    success: {
        type: ControlType.EventHandler,
    },
    failure: {
        type: ControlType.EventHandler,
    },
})

// Functions

function notSubmitForm(props) {
    return props.clickAction != "submitForm"
}

const parseMailchimpUrl = (url) => {
    const matchResult = url
        .replace(/&amp;/g, "&")
        .match(/^https?:\/\/([^\/]+)[^\?]+\??(.+)$/)

    // Check if there was no match
    if (!matchResult) {
        return [null, null]
    }

    // Extract domain and parameters from the match result
    const [, domain, parameters] = matchResult

    // Convert parameters to an object if they exist, otherwise null
    const parametersObject = parameters
        ? Object.fromEntries(new URLSearchParams(parameters))
        : null

    return [domain, parametersObject]
}

const MAILCHIMP_REPLACE = {
    firstName: "FNAME",
    lastName: "LNAME",
    addressLine1: "ADDRESS[addr1]",
    addressLine2: "ADDRESS[addr2]",
    addressCity: "ADDRESS[city]",
    addressState: "ADDRESS[state]",
    addressZip: "ADDRESS[zip]",
    addressCountry: "ADDRESS[country]",
}

function processFieldName(name, submitPlatform) {
    switch (submitPlatform) {
        case "mailchimp":
            return MAILCHIMP_REPLACE[name] || name
        case "mailerLite":
            return `fields[${name}]`
        default:
            return name
    }
}

function getCookieValue(cookieName) {
    const name = cookieName + "="
    const decodedCookie = decodeURIComponent(document.cookie)
    const ca = decodedCookie.split(";")
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === " ") {
            c = c.substring(1)
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ""
}

function isPlatformHidden(name) {
    return (props) => notSubmitForm(props) || props.submitPlatform != name
}
