import React, { CSSProperties } from "react";
import classNames from "classnames";
import { ColorLike } from "color";

import { utils } from "../../common";
import { getEnabledColorsProps } from "../../common/utils/colorHash";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { ContextOverlay } from "../ContextOverlay";
import { FieldSet } from "../Form";
import { RadioButton } from "../RadioButton/RadioButton";
import { Spacing } from "../Separation/Spacing";
import { Tag, TagList } from "../Tag";
import { TextField, TextFieldProps } from "../TextField";
import { Tooltip } from "../Tooltip/Tooltip";
import { WhiteSpaceContainer } from "../Typography";

type ColorPresets = [string, string][] | [string, ColorLike][];
type ColorPresetConfiguration = Pick<getEnabledColorsProps, "includeColorWeight" | "includePaletteGroup">;

export interface ColorFieldProps extends Omit<TextFieldProps, "invisibleCharacterWarning"> {
    /**
     * Any color can be selected, not only from the color presets.
     */
    allowCustomColor?: boolean;
    /**
     * List of named colors that are used a selectable color options.
     */
    colorPresets?: ColorPresets;
}

/**
 * Color input field that provides resets from the configured color palette.
 * Use `includeColorWeight` and `includePaletteGroup` to filter them.
 */
export const ColorField = ({
    className = "",
    allowCustomColor = false,
    colorPresets = listColorPalettePresets(),
    defaultValue,
    value,
    onChange,
    fullWidth = false,
    ...otherTextFieldProps
}: ColorFieldProps) => {
    const ref = React.useRef(null);
    const [colorValue, setColorValue] = React.useState<string>(defaultValue || value || "#000000");
    if (value && value !== colorValue) {
        setColorValue(value);
    }

    const disableNativePicker = colorPresets.length > 0;
    const disabled = (!disableNativePicker && !allowCustomColor) || otherTextFieldProps.disabled;

    const forwardOnChange = (forwardedEvent: React.ChangeEvent<HTMLInputElement>) => {
        setColorValue(forwardedEvent.target.value);
        if (onChange) {
            onChange(forwardedEvent);
        }
    };

    const colorInput = (
        <TextField
            inputRef={ref}
            className={classNames(
                `${eccgui}-colorfield`,
                // Swatch chrome ported from _colorfield.scss (SCSS sunset). This classname lands on
                // the `TextField` wrapper; the input is reached via its shadcn `data-slot="input"`
                // (the BEM `.eccgui-textfield__input` classname can't be targeted by a Tailwind
                // arbitrary variant — `__` underscores get turned into spaces at build time).
                // `--eccgui-colorfield-background` is set inline (below).
                "cursor-default",
                "[&_[data-slot=input]]:cursor-[inherit] [&_[data-slot=input]]:border-border",
                "[&_[data-slot=input]]:bg-[var(--eccgui-colorfield-background)] [&_[data-slot=input]]:text-[var(--eccgui-colorfield-background)]",
                "[&_[data-slot=input]::-webkit-color-swatch-wrapper]:hidden [&_[data-slot=input]::-moz-color-swatch]:hidden",
                // (The former `__leftcontainer` / `__action` inset backdrops are dropped: ColorField
                // never renders a leftIcon/rightElement by default, so those slots don't exist here.)
                // not-fill: cap the swatch width (was `max-width: 4 * $eccgui-size-textfield-height-regular`,
                // ~4x the h-9 input height)
                !fullWidth && "w-full max-w-36",
                className,
                {
                    [`${eccgui}-colorfield--custom-picker`]: disableNativePicker,
                    [`${eccgui}-colorfield--disabled`]: disabled,
                },
                // disabled dims the whole swatch (was `$eccgui-opacity-disabled`)
                disabled && "opacity-[0.39]",
            )}
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
                            className={
                                `${eccgui}-colorfield__palette ` +
                                // ported from _colorfield.scss (SCSS sunset): the <li> wrapping the
                                // `__palette-linebreak` <br> collapses to a full-width, zero-height
                                // break so the swatch grid wraps after every 8th color. Targeted via
                                // `li:has(br)` (the palette's only <br>) because the BEM `__` classname
                                // can't be used in a Tailwind arbitrary variant (`__` -> spaces).
                                "[&>li:has(br)]:block [&>li:has(br)]:h-0 [&>li:has(br)]:w-full [&>li:has(br)]:overflow-hidden"
                            }
                        >
                            {colorPresets!.map((color: [string, ColorLike], idx: number) => {
                                const colorString = typeof color[1] === "string" ? color[1] : color[1].toString();
                                return [
                                    <RadioButton
                                        key={idx}
                                        // `m-0` ported from _colorfield.scss `.eccgui-colorfield__palette__color`.
                                        className={`${eccgui}-colorfield__palette__color m-0`}
                                        hideIndicator
                                        value={colorString}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            forwardOnChange(e);
                                        }}
                                    >
                                        <Tooltip content={color[0]}>
                                            <Tag
                                                large
                                                // Solid color swatch (was `.eccgui-colorfield__palette__color
                                                // .eccgui-tag__item { width; color; background-color }` in
                                                // _colorfield.scss). bg == text color hides the label so the tag
                                                // reads as a color block; set inline so it wins over the Tag
                                                // recipe without `!important` (and reaches the BEM tag element,
                                                // which a Tailwind arbitrary variant cannot target).
                                                className="w-12"
                                                style={
                                                    { backgroundColor: colorString, color: colorString } as CSSProperties
                                                }
                                            >
                                                {colorString}
                                            </Tag>
                                        </Tooltip>
                                    </RadioButton>,
                                    // Looks like we cannot force some type of line break in the tag list via CSS only
                                    (idx + 1) % 8 === 0 && (
                                        <>
                                            <br className={`${eccgui}-colorfield__palette-linebreak`} />
                                        </>
                                    ),
                                ];
                            })}
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

const defaultColorPaletteSet: ColorPresetConfiguration = {
    // on default, we only include color weights that can have enough contrasts to black/white
    includeColorWeight: [100, 300, 700, 900],
    // on default, we only include layout colors
    includePaletteGroup: ["layout"],
};

/**
 * Simple helper function to get a list of colors defined in the color palette.
 */
const listColorPalettePresets = (colorPaletteSet = defaultColorPaletteSet) => {
    return utils
        .getEnabledColorPropertiesFromPalette({
            ...colorPaletteSet,
            minimalColorDistance: 0, // we use all allowed colors, and do not check distances between them
        })
        .map((color: [string, ColorLike]) => [
            color[0].replace(`${eccgui}-color-palette-`, ""),
            color[1],
        ]) as ColorPresets;
};

ColorField.listColorPalettePresets = listColorPalettePresets;

type calculateColorHashValueProps = Pick<ColorFieldProps, "allowCustomColor"> & ColorPresetConfiguration;

/**
 * Simple helper function that provide simple access to color hash calculation.
 */
ColorField.calculateColorHashValue = (
    text: string,
    options: calculateColorHashValueProps = {
        ...defaultColorPaletteSet,
        allowCustomColor: false,
    },
) => {
    const hash = utils.textToColorHash({
        text,
        options: {
            returnValidColorsDirectly: options.allowCustomColor as boolean,
            enabledColors: utils.getEnabledColorsFromPalette({
                includePaletteGroup: options.includePaletteGroup,
                includeColorWeight: options.includeColorWeight,
                minimalColorDistance: 0,
            }),
        },
    });

    return hash ? hash : undefined;
};

export default ColorField;
