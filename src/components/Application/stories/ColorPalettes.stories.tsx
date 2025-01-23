import React from "react";
import { render } from "react-dom";
import { Meta, StoryFn } from "@storybook/react";
import Color from "color";

import CssCustomProperties from "./../../../common/utils/CssCustomProperties";
import {
    ApplicationContainer,
    Badge,
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
    Switch,
    Tabs,
    TabTitle,
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
    const refConfigurator = React.useRef<HTMLDivElement>(null);
    const [calculateDistanceWarnings, setCalculateDistanceWarnings] = React.useState<boolean>(false);
    const [calculateContrastWarnings, setCalculateContrastWarnings] = React.useState<boolean>(false);
    const [minimalDistance, setMinimalDistance] = React.useState<number>(10); // @see https://wisotop.de/farbabstand-farben-vergleichen.php
    const [minimalContrast, setMinimalContrast] = React.useState<number>(4);
    const [paletteData, setPaletteData] = React.useState<object | undefined>(undefined);
    const userPaletteRef = React.useRef<HTMLTextAreaElement | null>(null);

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
        if (refConfigurator.current) {
            const panelConfig = document.getElementById("bp5-tab-panel_colorconfig_editor");
            if (panelConfig) {
                const warnings = Array.from(panelConfig.getElementsByClassName("eccgui-badge"))
                    .map((warning: Element) => {
                        return (warning as HTMLElement).textContent;
                    })
                    .reduce((partial, value) => {
                        return partial + parseInt(value ?? "");
                    }, 0 as number);
                const warningsTarget = document.getElementById("sumWarnings");
                if (warningsTarget) {
                    if (warnings > 0) {
                        render(<Badge intent={"warning"}>{warnings}</Badge>, warningsTarget);
                    } else {
                        render(<></>, warningsTarget);
                    }
                }
            }
        }
    });

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
        if (!calculateDistanceWarnings && !calculateContrastWarnings) {
            return undefined;
        }
        const warningsDistance: React.ReactElement[] = [];
        const warningsContrast: React.ReactElement[] = [];
        for (const [group, tints] of Object.entries(colors)) {
            for (const [tint, weights] of Object.entries(tints as object)) {
                for (const [weight, value] of Object.entries(weights)) {
                    if (color.hex().toString() !== (value as Color).hex().toString()) {
                        if (calculateDistanceWarnings) {
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
                        if (calculateContrastWarnings) {
                            // color contrasts
                            if (
                                // test to text/background colors in identity group
                                group === "identity" &&
                                (tint === "text" || tint === "background")
                            ) {
                                if (
                                    // only calculate light versions to dark versions b/c other usage combination would not make sense at all
                                    (color.isDark() && (value as Color).isLight()) ||
                                    (color.isLight() && (value as Color).isDark())
                                ) {
                                    if (color.contrast(value as Color) < minimalContrast) {
                                        warningsContrast.push(
                                            <MenuItem
                                                key={tint + weight}
                                                text={
                                                    <>
                                                        Fix for{" "}
                                                        <Tag backgroundColor={(value as Color).hex()}>
                                                            {`${tint}${weight}`} (
                                                            {color.contrast(value as Color).toPrecision(2)})
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
                }
            }
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
            <FieldItemRow justifyItemWidths>
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
                        rightElement={
                            <Switch
                                style={{ marginTop: "9px", marginBottom: "7px" }}
                                checked={calculateDistanceWarnings}
                                innerLabel="off"
                                innerLabelChecked="calc"
                                onChange={() => setCalculateDistanceWarnings(!calculateDistanceWarnings)}
                            />
                        }
                    />
                </FieldItem>
                <FieldItem
                    key="contrast"
                    labelProps={{ text: "Minimum contrast", tooltip: "WCAG level AA: 4.5" }}
                    messageText="Calculated to lighter/darker colors of text/background"
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
                                setMinimalContrast(parseFloat(value));
                            }, userInputDelayTime);
                        }}
                        rightElement={
                            <Switch
                                style={{ marginTop: "9px", marginBottom: "7px" }}
                                checked={calculateContrastWarnings}
                                innerLabel="off"
                                innerLabelChecked="calc"
                                onChange={() => setCalculateContrastWarnings(!calculateContrastWarnings)}
                            />
                        }
                    />
                </FieldItem>
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
            <div ref={refConfigurator}>
                <Tabs
                    id="colorconfig"
                    onChange={() => {}}
                    tabs={[
                        {
                            id: "editor",
                            panel: editorPanel,
                            title: <TabTitle text="Editor" titleSuffix={<span id="sumWarnings"></span>} />,
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
            </div>
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
