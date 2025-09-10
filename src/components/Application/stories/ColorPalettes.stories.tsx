import React from "react";
import { render } from "react-dom";
import { loremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";
import Color from "color";

import CssCustomProperties from "./../../../common/utils/CssCustomProperties";
import {
    ApplicationContainer,
    Badge,
    Button,
    Checkbox,
    CLASSPREFIX as eccgui,
    COLORMINCONTRAST,
    COLORMINDISTANCE,
    ContextMenu,
    FieldItem,
    FieldItemRow,
    FieldSet,
    FlexibleLayoutContainer,
    FlexibleLayoutItem,
    IconButton,
    MenuItem,
    Section,
    SectionHeader,
    Spacing,
    Switch,
    Tabs,
    TabTitle,
    Tag,
    TagList,
    TextField,
    TitleSubsection,
    utils,
} from "./../../../index";

interface ColorPaletteConfiguratorProps {
    /** Color palette as custom CSS properties */
    customColorProperties?: string;
    /** Default value for minimal color distance */
    distanceMin?: number;
    /** Default value for minimal contrast */
    contrastMin?: number;
    /** Enable color checks by default */
    enableCalculations?: boolean;
}

const ColorPaletteConfigurator = ({
    customColorProperties,
    distanceMin = COLORMINDISTANCE, // @see https://wisotop.de/farbabstand-farben-vergleichen.php
    contrastMin = COLORMINCONTRAST,
    enableCalculations = false,
}: ColorPaletteConfiguratorProps) => {
    const palettePrefix = `--${eccgui}-color-palette-`;
    const userInputDelayTime = 500;
    const correctionStep = 0.01;
    let userInputDelay; // timeout id
    const refConfigurator = React.useRef<HTMLDivElement>(null);
    const [calculateDistanceWarnings, setCalculateDistanceWarnings] = React.useState<boolean>(enableCalculations);
    const [calculateContrastWarnings, setCalculateContrastWarnings] = React.useState<boolean>(enableCalculations);
    const [minimalDistance, setMinimalDistance] = React.useState<number>(distanceMin);
    const [minimalContrast, setMinimalContrast] = React.useState<number>(contrastMin);
    const [paletteData, setPaletteData] = React.useState<object | undefined>(undefined);
    const [hashtestGroups, setHashtestGroups] = React.useState<string[]>(["layout"]);
    const [hashtestWeights, setHashtestWeights] = React.useState<string[]>(["100", "300", "500", "700", "900"]);
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

    const createSimpleColorList = (data: object, checkColorDistance: boolean) => {
        let colorlist = [] as Color[];
        for (const [group, tints] of Object.entries(data)) {
            if (hashtestGroups.includes(group)) {
                for (const [, weights] of Object.entries(tints as object)) {
                    for (const [weight, value] of Object.entries(weights)) {
                        if (hashtestWeights.includes(weight)) {
                            colorlist.push(value as Color);
                        }
                    }
                }
            }
        }

        if (checkColorDistance) {
            colorlist = colorlist.reduce((enoughDistance: Color[], color: Color) => {
                if (enoughDistance.includes(color)) {
                    return enoughDistance.filter((checkColor) => {
                        const distance = utils.colorCalculateDistance({ color1: color, color2: checkColor });
                        return checkColor === color || (distance && distanceMin <= distance);
                    });
                } else {
                    return enoughDistance;
                }
            }, colorlist);
        }

        return colorlist;
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

    const updateHashtestGroups = (group: string, active: boolean) => {
        let updatedGroups;
        if (active) {
            updatedGroups = [...hashtestGroups, group];
        } else {
            updatedGroups = hashtestGroups.filter((value) => value !== group);
        }
        setHashtestGroups(updatedGroups);
    };

    const updateHashtestWeights = (weight: string, active: boolean) => {
        let updatedWeights;
        if (active) {
            updatedWeights = [...hashtestWeights, weight];
        } else {
            updatedWeights = hashtestWeights.filter((value) => value !== weight);
        }
        setHashtestWeights(updatedWeights);
    };

    const fixColorByLuminosity = (
        color: Color,
        colorTest: Color,
        testFn: (color1: Color, color2: Color) => boolean
    ) => {
        let fixedColor = color as Color;
        let check = testFn(fixedColor, colorTest);
        while (check === true && fixedColor.luminosity() > 0 && fixedColor.luminosity() < 1) {
            if (fixedColor.luminosity() < (colorTest as Color).luminosity()) {
                fixedColor = fixedColor.darken(correctionStep);
            } else {
                fixedColor = fixedColor.lighten(correctionStep);
            }
            check = testFn(fixedColor, colorTest);
        }

        return fixedColor;
    };

    const createWarnings = (id: string[], colors: object) => {
        if (
            (!calculateDistanceWarnings && !calculateContrastWarnings) ||
            !colors[id[0]] ||
            !colors[id[0]][id[1]] ||
            !colors[id[0]][id[1]][id[2]]
        ) {
            return undefined;
        }
        const color = colors[id[0]][id[1]][id[2]];
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
                                                Fix with{" "}
                                                <Tag backgroundColor={(value as Color).hex()}>{tint + weight}</Tag> (
                                                {distance.toPrecision(2)})
                                            </>
                                        }
                                    >
                                        <MenuItem
                                            key={"this"}
                                            text={
                                                <>
                                                    Fix{" "}
                                                    <Tag backgroundColor={(color as Color).hex()}>
                                                        {`${id[1]}}${id[2]}}`}
                                                    </Tag>
                                                </>
                                            }
                                            onClick={() => {
                                                colors[id[0]][id[1]][id[2]] = fixColorByLuminosity(
                                                    color,
                                                    value as Color,
                                                    (c1, c2) => {
                                                        const distance =
                                                            utils.colorCalculateDistance({ color1: c1, color2: c2 }) ??
                                                            0;
                                                        // eslint-disable-next-line no-console
                                                        console.log(`${c1.hex()} -> ${distance}`);
                                                        return distance < minimalDistance;
                                                    }
                                                );
                                                setPaletteData({ ...colors });
                                            }}
                                        />
                                        <MenuItem
                                            key={"that"}
                                            text={
                                                <>
                                                    Fix{" "}
                                                    <Tag backgroundColor={(value as Color).hex()}>
                                                        {`${tint}${weight}`}
                                                    </Tag>
                                                </>
                                            }
                                            onClick={() => {
                                                colors[group][tint][weight] = fixColorByLuminosity(
                                                    value as Color,
                                                    color,
                                                    (c1, c2) => {
                                                        const distance =
                                                            utils.colorCalculateDistance({ color1: c1, color2: c2 }) ??
                                                            0;
                                                        // eslint-disable-next-line no-console
                                                        console.log(`${c1.hex()} -> ${distance}`);
                                                        return distance < minimalDistance;
                                                    }
                                                );
                                                setPaletteData({ ...colors });
                                            }}
                                        />
                                    </MenuItem>
                                );
                            }
                        }
                        if (calculateContrastWarnings) {
                            // color contrasts
                            if (
                                // test to text/background colors in identity group
                                ((group === "identity" && (tint === "text" || tint === "background")) ||
                                    // test to same color tint
                                    (group === id[0] && tint === id[1])) &&
                                // test only for light and strong weights, let out 500
                                // 500 is necessary to have a good gradient but they are never good to use as text color/bg
                                id[2] !== "500" &&
                                weight !== "500"
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
                                                        Fix with{" "}
                                                        <Tag backgroundColor={(value as Color).hex()}>
                                                            {`${tint}${weight}`} (
                                                            {color.contrast(value as Color).toPrecision(2)})
                                                        </Tag>
                                                    </>
                                                }
                                            >
                                                <MenuItem
                                                    key="this"
                                                    text={
                                                        <>
                                                            Fix{" "}
                                                            <Tag backgroundColor={(color as Color).hex()}>
                                                                {`${id[1]}}${id[2]}}`}
                                                            </Tag>
                                                        </>
                                                    }
                                                    onClick={() => {
                                                        colors[id[0]][id[1]][id[2]] = fixColorByLuminosity(
                                                            color,
                                                            value as Color,
                                                            (c1, c2) => {
                                                                const contrast = c1.contrast(c2 as Color);
                                                                // eslint-disable-next-line no-console
                                                                console.log(`${c1.hex()} -> ${contrast}`);
                                                                return contrast < minimalContrast;
                                                            }
                                                        );
                                                        setPaletteData({ ...colors });
                                                    }}
                                                />
                                                <MenuItem
                                                    key="that"
                                                    text={
                                                        <>
                                                            Fix{" "}
                                                            <Tag backgroundColor={(value as Color).hex()}>
                                                                {`${tint}${weight}`}
                                                            </Tag>
                                                        </>
                                                    }
                                                    onClick={() => {
                                                        colors[group][tint][weight] = fixColorByLuminosity(
                                                            value as Color,
                                                            color,
                                                            (c1, c2) => {
                                                                const contrast = c1.contrast(c2 as Color);
                                                                // eslint-disable-next-line no-console
                                                                console.log(`${c1.hex()} -> ${contrast}`);
                                                                return contrast < minimalContrast;
                                                            }
                                                        );
                                                        setPaletteData({ ...colors });
                                                    }}
                                                />
                                            </MenuItem>
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
        id: string[],
        updateFn: (color: string) => void
    ) => {
        if (!paletteData[id[0]] || !paletteData[id[0]][id[1]] || !paletteData[id[0]][id[1]][id[2]]) {
            return <></>;
        }
        const color = paletteData[id[0]][id[1]][id[2]];
        const menuWarnings = createWarnings(id, paletteData);
        return (
            <FieldItem
                key={label}
                labelProps={{ text: label }}
                messageText={`${color.hex()} / ${color.luminosity().toPrecision(2)}`}
            >
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
                                    <FlexibleLayoutContainer
                                        key={id}
                                        noEqualItemSpace
                                        gapSize="small"
                                        style={{
                                            alignItems: "center",
                                            marginBottom: "0.5rem",
                                        }}
                                    >
                                        <FlexibleLayoutItem key="tints">
                                            <FieldItemRow justifyItemWidths key={id}>
                                                {Object.keys(paletteData[group][tint]).map((weight) => {
                                                    return renderColorInput(
                                                        paletteData,
                                                        `${tint}${weight}`,
                                                        [group, tint, weight],
                                                        (newcolor) => {
                                                            paletteData[group][tint][weight] = Color(newcolor).rgb();
                                                            setPaletteData({ ...paletteData });
                                                        }
                                                    );
                                                })}
                                            </FieldItemRow>
                                        </FlexibleLayoutItem>
                                        <FlexibleLayoutItem key="actions" growFactor={0}>
                                            <IconButton
                                                name={"operation-magic"}
                                                text="Auto-span tint value from 100 to 900"
                                                onClick={() => {
                                                    const tintValues = Object.values(
                                                        paletteData[group][tint]
                                                    ) as Color[];
                                                    const tintKeys = Object.keys(paletteData[group][tint]);
                                                    if (tintValues.length > 0) {
                                                        const tint100 = tintValues[0];
                                                        const tint900 = tintValues[tintValues.length - 1];
                                                        tintKeys.forEach((weight, id) => {
                                                            paletteData[group][tint][weight] = Color(tint100).mix(
                                                                Color(tint900),
                                                                id / (tintValues.length - 1)
                                                            );
                                                            // eslint-disable-next-line no-console
                                                            console.log(
                                                                `mix ${Color(tint100).hex()} with ${Color(
                                                                    tint900
                                                                ).hex()} by ${id / (tintValues.length - 1)} -> ${
                                                                    paletteData[group][tint][weight]
                                                                }`
                                                            );
                                                        });
                                                    }
                                                    setPaletteData({ ...paletteData });
                                                }}
                                            />
                                        </FlexibleLayoutItem>
                                    </FlexibleLayoutContainer>
                                );
                            })}
                            <Spacing size="large" hasDivider />
                        </Section>
                    );
                })}
        </div>
    );

    const currentLayoutColorList = createSimpleColorList(paletteData ?? {}, calculateDistanceWarnings);

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
                        {
                            id: "hashtest",
                            title: "Color hashes",
                            panel: (
                                <div>
                                    <FieldSet title="Include groups" boxed>
                                        <FieldItemRow>
                                            {["identity", "semantic", "layout", "extra"].map((group) => (
                                                <FieldItem>
                                                    <Checkbox
                                                        value={group}
                                                        onChange={(event) => {
                                                            updateHashtestGroups(
                                                                event.target.value,
                                                                event.target.checked
                                                            );
                                                        }}
                                                        checked={hashtestGroups.includes(group)}
                                                    >
                                                        {group}
                                                    </Checkbox>
                                                </FieldItem>
                                            ))}
                                        </FieldItemRow>
                                    </FieldSet>
                                    <FieldSet title="Include weights" boxed>
                                        <FieldItemRow>
                                            {["100", "300", "500", "700", "900"].map((weight) => (
                                                <FieldItem>
                                                    <Checkbox
                                                        value={weight}
                                                        onChange={(event) => {
                                                            updateHashtestWeights(
                                                                event.target.value,
                                                                event.target.checked
                                                            );
                                                        }}
                                                        checked={hashtestWeights.includes(weight)}
                                                    >
                                                        {weight}
                                                    </Checkbox>
                                                </FieldItem>
                                            ))}
                                        </FieldItemRow>
                                    </FieldSet>
                                    {Object.values(currentLayoutColorList).length > 0 && (
                                        <>
                                            <Section>
                                                <SectionHeader>
                                                    <TitleSubsection>Allow text as direct color hash</TitleSubsection>
                                                </SectionHeader>
                                                <Spacing size="small" />
                                                <TagList>
                                                    {"yellow purple magenta pink violet indigo cyan teal lime grey rgb(128,0,128) #00ffff no_valid_color_string"
                                                        .toString()
                                                        .split(" ")
                                                        .map((text, index) => (
                                                            <Badge
                                                                key={index}
                                                                tagProps={{
                                                                    large: true,
                                                                    backgroundColor: utils.textToColorHash({
                                                                        text,
                                                                        options: {
                                                                            enabledColors: currentLayoutColorList,
                                                                            returnValidColorsDirectly: true,
                                                                        },
                                                                    }) as string,
                                                                }}
                                                            >
                                                                {text}
                                                            </Badge>
                                                        ))}
                                                </TagList>
                                            </Section>
                                            <Spacing />
                                            <Section>
                                                <SectionHeader>
                                                    <TitleSubsection>
                                                        Allow text as color but look for nearest palette neighbour
                                                    </TitleSubsection>
                                                </SectionHeader>
                                                <Spacing size="small" />
                                                <TagList>
                                                    {"yellow purple magenta pink violet indigo cyan teal lime amber vermilion grey rgb(128,0,128) #00ffff no_valid_color_string"
                                                        .toString()
                                                        .split(" ")
                                                        .map((text, index) => (
                                                            <Badge
                                                                key={index}
                                                                tagProps={{
                                                                    large: true,
                                                                    backgroundColor: utils.textToColorHash({
                                                                        text,
                                                                        options: {
                                                                            enabledColors: currentLayoutColorList,
                                                                            returnValidColorsDirectly: false,
                                                                        },
                                                                    }) as string,
                                                                }}
                                                            >
                                                                {text}
                                                            </Badge>
                                                        ))}
                                                </TagList>
                                            </Section>
                                            <Spacing />
                                            <Section>
                                                <SectionHeader>
                                                    <TitleSubsection>Directly used color hash</TitleSubsection>
                                                </SectionHeader>
                                                <Spacing size="small" />
                                                <TagList>
                                                    {loremIpsum({
                                                        p: 1,
                                                        avgSentencesPerParagraph: 1,
                                                        avgWordsPerSentence: 40,
                                                        random: false,
                                                    })
                                                        .toString()
                                                        .split(" ")
                                                        .map((text, index) => (
                                                            <Badge
                                                                key={index}
                                                                tagProps={{
                                                                    large: true,
                                                                    backgroundColor: utils.textToColorHash({
                                                                        text,
                                                                        options: {
                                                                            enabledColors: "all",
                                                                            returnValidColorsDirectly: false,
                                                                        },
                                                                    }) as string,
                                                                }}
                                                            >
                                                                {text}
                                                            </Badge>
                                                        ))}
                                                </TagList>
                                            </Section>
                                            <Spacing />
                                            <Section>
                                                <SectionHeader>
                                                    <TitleSubsection>
                                                        Nearest layout palette neighbour of color hash
                                                    </TitleSubsection>
                                                </SectionHeader>
                                                <Spacing size="small" />
                                                <TagList>
                                                    {loremIpsum({
                                                        p: 1,
                                                        avgSentencesPerParagraph: 1,
                                                        avgWordsPerSentence: 40,
                                                        random: false,
                                                    })
                                                        .toString()
                                                        .split(" ")
                                                        .map((text, index) => (
                                                            <Badge
                                                                key={index}
                                                                tagProps={{
                                                                    large: true,
                                                                    backgroundColor: utils.textToColorHash({
                                                                        text,
                                                                        options: {
                                                                            enabledColors: currentLayoutColorList,
                                                                            returnValidColorsDirectly: false,
                                                                        },
                                                                    }) as string,
                                                                }}
                                                            >
                                                                {text}
                                                            </Badge>
                                                        ))}
                                                </TagList>
                                            </Section>
                                        </>
                                    )}
                                </div>
                            ),
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
    enableCalculations: false,
};
