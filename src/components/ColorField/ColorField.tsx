import React, { CSSProperties } from "react";
import classNames from "classnames";

import { utils } from "../../common";
import { ColorWeight, PaletteGroup } from "../../common/utils/colorHash";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { ContextOverlay } from "../ContextOverlay";
import { FieldSet } from "../Form";
import { RadioButton } from "../RadioButton/RadioButton";
import { Spacing } from "../Separation/Spacing";
import { Tag, TagList } from "../Tag";
import { TextField, TextFieldProps } from "../TextField";
import { Tooltip } from "../Tooltip/Tooltip";
import { WhiteSpaceContainer } from "../Typography";

export interface ColorFieldProps extends Omit<TextFieldProps, "invisibleCharacterWarning"> {
    /**
     * Any color can be selected, not only from the configured color palette.
     */
    allowCustomColor?: boolean;
    /**
     * What color weights should be included in the set of allowed colors.
     */
    colorWeightFilter?: ColorWeight[];
    /**
     * What palette groups should be included in the set of allowed colors.
     */
    paletteGroupFilter?: PaletteGroup[];
}

/**
 * Color input field that provides resets from the configured color palette.
 * Use `colorWeightFilter` and `paletteGroupFilter` to filter them.
 */
export const ColorField = ({
    className = "",
    allowCustomColor = false,
    colorWeightFilter = [100, 300, 700, 900],
    paletteGroupFilter = ["layout"],
    defaultValue,
    value,
    onChange,
    fullWidth = false,
    ...otherTextFieldProps
}: ColorFieldProps) => {
    const ref = React.useRef(null);
    const [colorValue, setColorValue] = React.useState<string>(defaultValue || value || "#000000");

    let allowedPaletteColors, disableNativePicker, disabled;
    const updateConfig = () => {
        allowedPaletteColors = utils.getEnabledColorPropertiesFromPalette({
            includePaletteGroup: paletteGroupFilter,
            includeColorWeight: colorWeightFilter,
            minimalColorDistance: 0, // we use all allowed colors, and do not check distances between them
        });

        disableNativePicker =
            colorWeightFilter.length > 0 && paletteGroupFilter.length > 0 && allowedPaletteColors.length > 0;
        disabled = (!disableNativePicker && !allowCustomColor) || otherTextFieldProps.disabled;
    };
    updateConfig();
    React.useEffect(() => {
        updateConfig();
    }, [allowCustomColor, colorWeightFilter, paletteGroupFilter, otherTextFieldProps]);

    React.useEffect(() => {
        setColorValue(defaultValue || value || "#000000");
    }, [defaultValue, value]);

    const forwardOnChange = (forwardedEvent: React.ChangeEvent<HTMLInputElement>) => {
        setColorValue(forwardedEvent.target.value);
        if (onChange) {
            onChange(forwardedEvent);
        }
    };

    const colorInput = (
        <TextField
            inputRef={ref}
            className={classNames(`${eccgui}-colorfield`, className, {
                [`${eccgui}-colorfield--custom-picker`]: disableNativePicker,
            })}
            // we cannot use `color` type for the custom picker because we do not have control over it then
            type={!disableNativePicker ? "color" : "text"}
            readOnly={disableNativePicker}
            disabled={disabled}
            value={colorValue}
            fullWidth={fullWidth}
            {...otherTextFieldProps}
            onChange={
                !disableNativePicker
                    ? (e: React.ChangeEvent<HTMLInputElement>) => {
                          forwardOnChange(e);
                      }
                    : undefined
            }
            style={{ ...otherTextFieldProps.style, [`--eccgui-colorfield-background`]: colorValue } as CSSProperties}
        />
    );

    return disableNativePicker && !disabled ? (
        <ContextOverlay
            fill={fullWidth}
            content={
                <WhiteSpaceContainer
                    paddingTop={"small"}
                    paddingRight={"small"}
                    paddingBottom={"small"}
                    paddingLeft={"small"}
                    className={`${eccgui}-colorfield__picker`}
                >
                    {allowCustomColor && (
                        <>
                            <TextField
                                type={"color"}
                                value={colorValue}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    forwardOnChange(e);
                                }}
                            />
                            <Spacing size={"small"} />
                        </>
                    )}
                    <FieldSet>
                        <TagList
                            className={`${eccgui}-colorfield__palette ${eccgui}-colorfield__palette--${
                                colorWeightFilter.length >= 3 ? colorWeightFilter.length * 2 : "8"
                            }col`}
                        >
                            {allowedPaletteColors!.map((color: [string, string], idx: number) => [
                                <RadioButton
                                    className={`${eccgui}-colorfield__palette__color`}
                                    hideIndicator
                                    value={color[1]}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        forwardOnChange(e);
                                    }}
                                >
                                    <Tooltip key={idx} content={color[0].replace(`${eccgui}-color-palette-`, "")}>
                                        <Tag
                                            large
                                            style={{ [`--eccgui-colorfield-palette-color`]: color[1] } as CSSProperties}
                                        >
                                            {color[1]}
                                        </Tag>
                                    </Tooltip>
                                </RadioButton>,
                                // Looks like we cannot force some type of line break in the tag list via CSS only
                                (idx + 1) % (colorWeightFilter.length >= 3 ? colorWeightFilter.length * 2 : 8) ===
                                    0 && (
                                    <>
                                        <br className={`${eccgui}-colorfield__palette-linebreak`} />
                                    </>
                                ),
                            ])}
                        </TagList>
                    </FieldSet>
                </WhiteSpaceContainer>
            }
        >
            {colorInput}
        </ContextOverlay>
    ) : (
        colorInput
    );
};

type calculateColorHashValueProps = Pick<
    ColorFieldProps,
    "allowCustomColor" | "colorWeightFilter" | "paletteGroupFilter"
>;

/**
 * Simple helper function that provide simple access to color hash calculation.
 * Using the same default values for the color palette filter.
 */
ColorField.calculateColorHashValue = (
    text: string,
    options: calculateColorHashValueProps = {
        allowCustomColor: false,
        colorWeightFilter: [100, 300, 700, 900],
        paletteGroupFilter: ["layout"],
    }
) => {
    const hash = utils.textToColorHash({
        text,
        options: {
            returnValidColorsDirectly: options.allowCustomColor as boolean,
            enabledColors: utils.getEnabledColorsFromPalette({
                includePaletteGroup: options.paletteGroupFilter,
                includeColorWeight: options.colorWeightFilter,
                minimalColorDistance: 0,
            }),
        },
    });

    return hash ? hash : undefined;
};

export default ColorField;
