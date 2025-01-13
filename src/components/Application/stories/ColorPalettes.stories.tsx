import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Color from "color";

import CssCustomProperties from "./../../../common/utils/CssCustomProperties";
import {
    ApplicationContainer,
    Button,
    CLASSPREFIX as eccgui,
    ContextMenu,
    FieldItem,
    FieldItemRow,
    IconButton,
    MenuItem,
    Section,
    SectionHeader,
    Spacing,
    Tabs,
    Tag,
    TextField,
    TitleSubsection,
    utils,
} from "./../../../index";

interface ColorPaletteConfiguratorProps {
    customColorProperties?: string;
}

const ColorPaletteConfigurator = ({ customColorProperties }: ColorPaletteConfiguratorProps) => {
    const palettePrefix = `--${eccgui}-color-palette-`;
    const userInputDelayTime = 500;
    let userInputDelay; // timeout id
    // let minimalDistance = 10; // @see https://wisotop.de/farbabstand-farben-vergleichen.php
    const [minimalDistance, setMinimalDistance] = React.useState<number>(10);
    const [minimalContrast, setMinimalContrast] = React.useState<number>(4);
    const [paletteData, setPaletteData] = React.useState<object | undefined>(undefined);
    const userPaletteRef = React.useRef<HTMLTextAreaElement | null>(null);
    const [textColor, setTextColor] = React.useState<Color>(Color("#444"));
    const [bgColor, setBgColor] = React.useState<Color>(Color("#f5f5f5"));

    const createPaletteData = (csscustomprops: string | undefined) => {
        const colors = (
            csscustomprops
                ? csscustomprops.split(";").map((rule: string) => {
                      return rule.split(":").map((rulepart: string) => {
                          return rulepart.trim();
                      });
                  })
                : new CssCustomProperties({
                      selectorText: `:root`,
                      filterName: (name: string) => {
                          return name.includes(palettePrefix);
                      },
                      removeDashPrefix: false,
                      returnObject: false,
                  }).customProperties()
        )
            .filter((colorconfig: object) => {
                if (!Array.isArray(colorconfig)) {
                    return false;
                }
                if (colorconfig.length !== 2) {
                    return false;
                }
                return true;
            })
            .map((colorconfig: object) => {
                return [colorconfig[0].replace(palettePrefix, ""), Color(colorconfig[1]).rgb()];
            });

        const data = new Object();

        for (const [key, value] of colors) {
            const hierarchy = key.split("-");
            if (!data[hierarchy[0]]) {
                data[hierarchy[0]] = new Object();
            }
            if (!data[hierarchy[0]][hierarchy[1]]) {
                data[hierarchy[0]][hierarchy[1]] = new Object();
            }
            if (!data[hierarchy[0]][hierarchy[1]][hierarchy[2]]) {
                data[hierarchy[0]][hierarchy[1]][hierarchy[2]] = value;
            }
        }

        return data;
    };

    const createCustomPropsSerialization = (data: object) => {
        let serialization = "";
        for (const [group, tints] of Object.entries(data)) {
            for (const [tint, weights] of Object.entries(tints as object)) {
                for (const [weight, value] of Object.entries(weights)) {
                    serialization =
                        serialization +
                        `--${eccgui}-color-palette-${group}-${tint}-${weight}: ${(value as Color).hex()};\n`;
                }
            }
        }
        return serialization.trim();
    };

    const createSassSerialization = (data: object) => {
        const createTintData = (tint: string, weights: object) => {
            return `\t\t"${tint}": eccgui-create-color-tints(${Object.values(weights)
                .map((color) => color.hex())
                .join(" ")}),\n`;
        };

        const createGroupData = (group: string, tints: object) => {
            let groupData = `\t"${group}": (\n`;
            for (const [tint, weights] of Object.entries(tints)) {
                groupData = groupData + createTintData(tint, weights);
            }
            return groupData + `\t),\n`;
        };

        let sassData = `$eccgui-color-palette-light: (\n`;

        for (const [group, tints] of Object.entries(data)) {
            sassData = sassData + createGroupData(group, tints);
        }

        return sassData + `) !default;`;
    };

    React.useEffect(() => {
        const paletteData = createPaletteData(customColorProperties);
        setPaletteData(paletteData);
    }, [customColorProperties]);

    React.useEffect(() => {
        if (userPaletteRef && userPaletteRef.current) {
            userPaletteRef.current.value = createCustomPropsSerialization(paletteData || {});
        }
    }, [paletteData]);

    const createWarnings = (color: Color, colors: object) => {
        const warningsDistance: React.ReactElement[] = [];
        for (const [, tints] of Object.entries(colors)) {
            for (const [tint, weights] of Object.entries(tints as object)) {
                for (const [weight, value] of Object.entries(weights)) {
                    if (color.hex().toString() !== (value as Color).hex().toString()) {
                        // color distance
                        const distance = utils.colorCalculateDistance({ color1: color, color2: value as Color });
                        if (distance && distance < minimalDistance) {
                            warningsDistance.push(
                                <MenuItem
                                    key={tint + weight}
                                    text={
                                        <>
                                            Fix for{" "}
                                            <Tag backgroundColor={(value as Color).hex()}>
                                                {tint + weight} ({distance.toPrecision(2)})
                                            </Tag>
                                        </>
                                    }
                                />
                            );
                        }
                    }
                }
            }
        }
        // color contrast, only calculate to lighter/darker color
        const warningsContrast: React.ReactElement[] = [];
        if (color.isDark() && color.contrast(bgColor) < minimalContrast) {
            warningsContrast.push(
                <MenuItem
                    key="contrast"
                    text={
                        <>
                            Fix for{" "}
                            <Tag backgroundColor={bgColor.hex()}>
                                Background ({color.contrast(bgColor).toPrecision(2)})
                            </Tag>
                        </>
                    }
                />
            );
        }
        if (color.isLight() && color.contrast(textColor) < minimalContrast) {
            warningsContrast.push(
                <MenuItem
                    key="contrast"
                    text={
                        <>
                            Fix for{" "}
                            <Tag backgroundColor={textColor.hex()}>
                                Text ({color.contrast(textColor).toPrecision(2)})
                            </Tag>
                        </>
                    }
                />
            );
        }
        return warningsDistance.length + warningsContrast.length > 0 ? (
            <ContextMenu
                togglerElement={
                    <IconButton
                        name="state-warning"
                        hasStateWarning
                        badge={warningsDistance.length + warningsContrast.length}
                        badgeProps={{
                            intent: "warning",
                            position: "top-right",
                            size: "small",
                        }}
                    />
                }
            >
                {warningsDistance.length > 0 ? <TitleSubsection key="dist">Distances</TitleSubsection> : <></>}
                <>{warningsDistance}</>
                {warningsContrast.length > 0 ? <TitleSubsection key="contrast">Contrasts</TitleSubsection> : <></>}
                <>{warningsContrast}</>
            </ContextMenu>
        ) : undefined;
    };

    const renderColorInput = (
        paletteData: object = {},
        label: string,
        color: Color,
        updateFn: (color: string) => void
    ) => {
        const menuWarnings = createWarnings(color, paletteData);
        return (
            <FieldItem key={label} labelProps={{ text: label }} messageText={color.hex()}>
                <TextField
                    type="color"
                    value={color.hex()}
                    onValueChange={(newcolor) => {
                        if (userInputDelay) {
                            clearTimeout(userInputDelay);
                        }
                        userInputDelay = setTimeout(() => {
                            updateFn(newcolor);
                        }, userInputDelayTime);
                    }}
                    intent={menuWarnings ? "warning" : undefined}
                    rightElement={menuWarnings}
                />
            </FieldItem>
        );
    };

    const editorPanel = (
        <div>
            <FieldItemRow>
                <FieldItem
                    key="distance"
                    labelProps={{ text: "Minimal color distance" }}
                    messageText="CIE76 formula is used"
                >
                    <TextField
                        defaultValue={minimalDistance.toString()}
                        type="number"
                        step={1}
                        min={1}
                        onValueChange={(value) => {
                            if (userInputDelay) {
                                clearTimeout(userInputDelay);
                            }
                            userInputDelay = setTimeout(() => {
                                setMinimalDistance(parseInt(value, 10));
                            }, userInputDelayTime);
                        }}
                    />
                </FieldItem>
                <FieldItem
                    key="contrast"
                    labelProps={{ text: "Minimum contrast", tooltip: "WCAG level AA: 4.5" }}
                    messageText="Calculated to lighter/darker ()"
                >
                    <TextField
                        defaultValue={minimalContrast.toString()}
                        type="number"
                        step={0.1}
                        min={1}
                        onValueChange={(value) => {
                            if (userInputDelay) {
                                clearTimeout(userInputDelay);
                            }
                            userInputDelay = setTimeout(() => {
                                setMinimalContrast(parseInt(value, 10));
                            }, userInputDelayTime);
                        }}
                    />
                </FieldItem>
                {renderColorInput(paletteData, "Text", Color(textColor), (newcolor) => {
                    setTextColor(Color(newcolor));
                })}
                {renderColorInput(paletteData, "Background", Color(bgColor), (newcolor) => {
                    setBgColor(Color(newcolor));
                })}
            </FieldItemRow>
            {paletteData &&
                Object.keys(paletteData).map((group, id) => {
                    return (
                        <Section key={id}>
                            <SectionHeader>
                                <TitleSubsection>{group}</TitleSubsection>
                            </SectionHeader>
                            <Spacing size="small" />
                            {Object.keys(paletteData[group]).map((tint, id) => {
                                return (
                                    <FieldItemRow justifyItemWidths key={id}>
                                        {Object.keys(paletteData[group][tint]).map((weight) => {
                                            return renderColorInput(
                                                paletteData,
                                                `${tint}${weight}`,
                                                paletteData[group][tint][weight],
                                                (newcolor) => {
                                                    paletteData[group][tint][weight] = Color(newcolor).rgb();
                                                    setPaletteData({ ...paletteData });
                                                }
                                            );
                                        })}
                                    </FieldItemRow>
                                );
                            })}
                            <Spacing size="large" hasDivider />
                        </Section>
                    );
                })}
        </div>
    );

    return (
        <ApplicationContainer>
            <Tabs
                id="colorconfig"
                onChange={() => {}}
                tabs={[
                    {
                        id: "editor",
                        panel: editorPanel,
                        title: "Editor",
                    },
                    {
                        id: "css",
                        panel: (
                            <div>
                                <textarea
                                    ref={userPaletteRef}
                                    style={{
                                        display: "block",
                                        width: "100%",
                                    }}
                                    spellCheck="false"
                                    rows={20}
                                />
                                <Spacing size="small" />
                                <Button
                                    text="Load to editor"
                                    onClick={() => {
                                        setPaletteData(createPaletteData(userPaletteRef.current?.value));
                                    }}
                                />
                            </div>
                        ),
                        title: "CSS properties",
                    },
                    {
                        id: "scss",
                        panel: (
                            <div>
                                <textarea
                                    style={{
                                        display: "block",
                                        width: "100%",
                                    }}
                                    spellCheck="false"
                                    rows={20}
                                    readOnly
                                    value={paletteData && createSassSerialization(paletteData)}
                                />
                            </div>
                        ),
                        title: "SCSS configuration",
                    },
                ]}
            />
        </ApplicationContainer>
    );
};

export default {
    title: "Components/Application/Colors",
    component: ColorPaletteConfigurator,
    argTypes: {},
} as Meta<typeof ColorPaletteConfigurator>;

const Template: StoryFn<typeof ColorPaletteConfigurator> = (args) => <ColorPaletteConfigurator {...args} />;

export const Default = Template.bind({});

Default.args = {
    customColorProperties: "",
};
