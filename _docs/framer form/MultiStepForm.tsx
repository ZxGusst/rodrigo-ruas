import { addPropertyControls, ControlType, RenderTarget, withCSS } from "framer"
import { useState, useEffect, useRef, ComponentType } from "react"
import {
    createId,
    HiddenComponentLabel,
    useMultiStepFormStore,
    getFormInfo,
    isAncestor,
} from "https://framer.com/m/FramerFormsShared-XPyb.js@RhTkfEJwV2NS1uN2FS3e"

const OPTIMIZATION_CLASS_NAME = "framerforms-multi-step-form"
const SUBMIT_BUTTON_HIDDEN_ATTRIBUTE = "framerforms-submit-button-hidden"

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
function MultiStepFormComponent(props) {
    const id = createId()
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const isOptimizing = typeof window === "undefined"

    const [multiStepFormState, setMultiStepFormState] = useMultiStepFormStore()
    const [formInfo, setFormInfo] = useState(null)
    const stateRef = useRef(multiStepFormState[formInfo?.formId])
    const ref = useRef(null)

    const state = multiStepFormState[formInfo?.formId]
    const pageHistory = state?.pageHistory

    useEffect(() => {
        const formInfo = getFormInfo(ref.current)
        setFormInfo(formInfo)

        const formId = formInfo.formId

        function previousPage() {
            const pageHistory = stateRef.current?.pageHistory
            if (pageHistory?.length > 1) {
                setMultiStepFormState((prev) => ({
                    [formId]: {
                        ...prev[formId],
                        pageHistory: prev[formId].pageHistory.slice(0, -1),
                        isEndPage: false,
                    },
                }))
            }
        }

        function nextPage() {
            const state = stateRef.current
            const pages = formInfo?.pages

            if (state) {
                const page = state.pageHistory[state.pageHistory.length - 1]
                const { logicConfigs } = state

                let newPage = null

                if (logicConfigs.length) {
                    if (pages) {
                        const step = pages.children?.[page]
                        for (const logic of logicConfigs) {
                            if (isAncestor(step, logic.ref.current)) {
                                const nextPageName = logic.getNextPage()
                                if (nextPageName) {
                                    const nextPageIndex =
                                        getChildIndexByDataFramerName(
                                            pages,
                                            nextPageName
                                        )

                                    if (nextPageIndex !== -1) {
                                        newPage = nextPageIndex
                                    }
                                    break
                                }
                            }
                        }
                    }
                } else if (page < state.totalPages - 1) {
                    newPage = page + 1
                }

                const pageElement = pages.children[page]
                if (pageElement && !isFormValid(pageElement)) {
                    newPage = null
                }

                if (newPage) {
                    setMultiStepFormState((prev) => {
                        const prevState = prev[formId]
                        return {
                            [formId]: {
                                ...prevState,
                                pageHistory: [
                                    ...prevState.pageHistory,
                                    newPage,
                                ],
                                isEndPage: isPageAnEndPage(
                                    newPage,
                                    prevState,
                                    formInfo?.pages,
                                    props.endPage,
                                    props.endPageCustom
                                ),
                            },
                        }
                    })
                }
            }
        }

        function setPageHistoryLength(newLength) {
            setMultiStepFormState((prev) => {
                const pageHistory = prev[formId]?.pageHistory ?? []

                return {
                    [formId]: {
                        ...prev[formId],
                        pageHistory:
                            newLength >= pageHistory.length
                                ? pageHistory
                                : pageHistory.slice(0, newLength),
                        isEndPage: isPageAnEndPage(
                            pageHistory[newLength - 1],
                            prev[formId],
                            formInfo?.pages,
                            props.endPage,
                            props.endPageCustom
                        ),
                    },
                }
            })
        }

        if (formInfo.formId && formInfo.pages) {
            setMultiStepFormState({
                [formInfo.formId]: {
                    totalPages: formInfo.pages.children.length,
                    pageHistory: [0],
                    logicConfigs: [],
                    isEndPage: formInfo.pages.children.length == 1,
                    previousPage,
                    nextPage,
                    setPageHistoryLength,
                },
            })
        }
    }, [])

    useEffect(() => {
        stateRef.current = state
    }, [state])

    useEffect(() => {
        if (
            state &&
            (!isCanvas ||
                ref.current?.closest(
                    '[data-framer-component-container="true"]'
                ))
        ) {
            const submitButton = formInfo.form?.querySelector(
                'button[type="submit"]'
            )?.parentElement

            if (submitButton) {
                submitButton.setAttribute(
                    SUBMIT_BUTTON_HIDDEN_ATTRIBUTE,
                    state.isEndPage ? "false" : "true"
                )
            }
        }
    }, [state?.isEndPage])

    useEffect(() => {
        const pages = formInfo?.pages
        if (
            pages &&
            pageHistory &&
            (state?.logicConfigs?.length || props.endPage == "customPages")
        ) {
            for (let i = 0; i < pages.children.length; i++) {
                if (pageHistory.includes(i)) {
                    const inputs = pages.children[i]?.querySelectorAll(
                        `input[name][disabled="FramerForms"], select[name][disabled="FramerForms"], textarea[name][disabled="FramerForms"]`
                    )

                    for (const input of inputs) {
                        input.removeAttribute("disabled")
                    }
                } else {
                    const inputs = pages.children[i]?.querySelectorAll(
                        "input[name]:not([disabled]), select[name]:not([disabled]), textarea[name]:not([disabled])"
                    )

                    for (const input of inputs) {
                        input.setAttribute("disabled", "FramerForms")
                    }
                }
            }
        }
    }, [pageHistory])

    return (
        <HiddenComponentLabel text="Multi-Step Form">
            <div
                ref={ref}
                id={id}
                data-framerforms-multi-step-form
                className={isOptimizing ? OPTIMIZATION_CLASS_NAME : ""}
                style={{ display: "none" }}
            >
                {!isOptimizing && !isCanvas && (
                    <style>{`form[framerforms-id="${formInfo?.formId}"] > [data-framer-name="Pages" i] > *:not(:nth-child(${
                        pageHistory
                            ? pageHistory[pageHistory.length - 1] + 1
                            : 1
                    })) { display: none; }`}</style>
                )}
                {isCanvas && (
                    <style>{`[data-framer-component-container="true"] form[framerforms-id="${formInfo?.formId}"] > [data-framer-name="Pages" i] > *:not(:first-child) { display: none; }`}</style>
                )}
            </div>
        </HiddenComponentLabel>
    )
}

const MultiStepForm: ComponentType = withCSS(
    MultiStepFormComponent,
    [
        `form:has(.${OPTIMIZATION_CLASS_NAME}) > [data-framer-name="Pages" i] > *:not(:first-child) { display: none; }`,
        `form:has(.${OPTIMIZATION_CLASS_NAME}) div:has(> button[type="submit"]) { display: none; }`,
        `[${SUBMIT_BUTTON_HIDDEN_ATTRIBUTE}="true"] { display: none; }`,
    ],
    OPTIMIZATION_CLASS_NAME
) as typeof MultiStepFormComponent
export default MultiStepForm

MultiStepForm.displayName = "Multi-Step Form"

addPropertyControls(MultiStepForm, {
    endPage: {
        type: ControlType.Enum,
        defaultValue: "lastPage",
        options: ["lastPage", "customPages"],
        optionTitles: ["Last Page", "Custom Pages"],
        displaySegmentedControl: true,
        segmentedControlDirection: "vertical",
    },
    endPageCustom: {
        type: ControlType.Array,
        control: {
            type: ControlType.String,
            defaultValue: "",
            placeholder: "Page Layer Name",
        },
        title: "Pages",
        description: "List of page names where the submit button is shown",
        hidden: (props) => props.endPage !== "customPages",
    },
    // analytics: {
    //     type: ControlType.Object,
    //     buttonTitle: "Custom Event",
    //     controls: {
    //         platform: {
    //             type: ControlType.Enum,
    //             options: ["googleAnalytics"],
    //             optionTitles: ["Google Analytics 4"],
    //         },
    //         eventName: {
    //             type: ControlType.String,
    //             placeholder: "Event Name",
    //         },
    //     },
    // },
})

//////////////////////////////////////////////////////////////

function isFormValid(element) {
    const inputs = element.querySelectorAll("input, select, textarea")
    let invalidInputs = []

    for (const input of inputs) {
        if (isVisible(input) && !input.reportValidity()) {
            invalidInputs.push(input)
        }
    }

    if (invalidInputs.length > 0) {
        console.log(
            "Invalid inputs: ",
            invalidInputs.map((input) => input.name || input.type).join(", ")
        )
    }

    return invalidInputs.length === 0
}

function isVisible(element) {
    return element.offsetParent !== null || element.type == "hidden"
}

function getChildIndexByDataFramerName(parentElement, name) {
    const children = parentElement.children
    for (let i = 0; i < children.length; i++) {
        if (children[i].getAttribute("data-framer-name") === name) {
            return i
        }
    }
    return -1 // Return -1 if no child with the specified attribute value is found
}

function isPageAnEndPage(pageIndex, state, pages, endPageMode, customEndPages) {
    let isEndPage = false
    if (endPageMode === "customPages" && pages) {
        const step = pages.children[pageIndex]
        if (customEndPages.includes(step.getAttribute("data-framer-name"))) {
            isEndPage = true
        }
    } else {
        isEndPage = pageIndex == state.totalPages - 1
    }

    return isEndPage
}
